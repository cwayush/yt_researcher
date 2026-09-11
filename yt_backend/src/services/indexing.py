"""
IndexingService — application service for indexing YouTube videos.

Pipeline:
    YouTube URL → transcript → sentences → chunks → parent storage → child embeddings → vector storage

An indexed video is not rebuilt on every request. Its transcript is re-checked
at most once per freshness window, and rebuilt only when a hash of the
reconstructed transcript shows the content actually changed.
"""

import logging
from datetime import UTC, datetime, timedelta

from src.api.exceptions import TranscriptNotAvailable
from src.chunking.service import ChunkingService
from src.config.settings import get_settings
from src.embeddings.service import EmbeddingService
from src.indexstate.postgres import PostgresIndexStateStore
from src.ingestion.oembed import YoutubeOEmbedProvider
from src.models.chunks import HierarchicalChunks
from src.models.index import IndexResponse
from src.models.index_state import VideoIndexState, VideoMetadata
from src.models.transcript import PreparedTranscript
from src.processing.hashing import transcript_hash
from src.retrieval.keyword.bm25 import BM25Retriever
from src.services.generation import GenerationService
from src.services.transcript import TranscriptService
from src.vectorstore.base import VectorStore

logger = logging.getLogger(__name__)

MESSAGES = {
    "indexed": "Video successfully indexed.",
    "rebuilt": "Video content changed; index rebuilt.",
    "reused": "Video already indexed.",
}


class IndexingService:
    """
    Orchestrates the transcript fetch-and-process pipeline.

    Dependencies are injected via the constructor so they can be
    swapped in tests without touching application code.

    """

    def __init__(self,
                 transcript_service: TranscriptService,
                 chunking_service: ChunkingService,
                 embedding_service: EmbeddingService,
                 generation_service: GenerationService,
                 vector_store: VectorStore,
                 index_state: PostgresIndexStateStore,
                 oembed_provider: YoutubeOEmbedProvider,
                 keyword_retriever: BM25Retriever) -> None:

        self._transcript_service = transcript_service
        self._chunking_service = chunking_service
        self._embedding_service = embedding_service
        self._generation_service = generation_service
        self._vector_store = vector_store
        self._index_state = index_state
        self._oembed_provider = oembed_provider
        self._keyword_retriever = keyword_retriever

        self._freshness_window = timedelta(days=get_settings().freshness_check_days)


    def index(self, url: str) -> IndexResponse:
        """
        Make a video searchable, reusing the existing index where possible.

        Returns:
            The video ID and which path the request took.
        """

        video_id = self._transcript_service.extract_id(url)

        state, metadata = self._index_state.get_with_metadata(video_id)

        if state is not None and state.is_indexed and self._is_fresh(state):
            return self._reuse(video_id, metadata)

        self._index_state.ensure(video_id)

        with self._index_state.lock(video_id):

            state = self._index_state.get(video_id)

            if not state.is_indexed:
                return self._build(video_id, action="indexed", state=state)

            if self._is_fresh(state):
                return self._reuse(video_id)

            return self._check_freshness(video_id, state)


    def _is_fresh(self, state: VideoIndexState) -> bool:

        if state.last_checked_at is None:
            return False

        return datetime.now(UTC) - state.last_checked_at < self._freshness_window


    def _check_freshness(self,
                         video_id: str,
                         state: VideoIndexState) -> IndexResponse:
        """
        Re-fetch the transcript and rebuild only if its content changed.
        """

        try:
            prepared = self._transcript_service.prepare_by_id(video_id)

        except TranscriptNotAvailable as exc:

            logger.warning("Freshness check for '%s' could not fetch a transcript: %s", video_id, exc)

            self._index_state.touch_checked_at(video_id)

            return self._reuse(video_id)

        if transcript_hash(prepared.sentences) == state.transcript_hash:
            self._index_state.touch_checked_at(video_id)

            return self._reuse(video_id)

        return self._build(video_id, action="rebuilt", state=state, prepared=prepared)


    def _build(self,
               video_id: str,
               action: str,
               state: VideoIndexState,
               prepared: PreparedTranscript | None = None) -> IndexResponse:
        """
        Run the full pipeline and swap in the result.
        """

        try:
            if prepared is None:
                prepared = self._transcript_service.prepare_by_id(video_id)

            chunks = self._chunking_service.create_chunks(sentences=prepared.sentences,
                                                          video_id=video_id)

            if not chunks.parents:
                raise TranscriptNotAvailable(video_id,
                                             reason="Transcript contains no usable text.")

            embedded_children = self._embedding_service.embed_children(chunks.children)

            self._vector_store.add_chunks(embedded_children)

            metadata = self._collect_metadata(video_id, prepared, chunks)

            self._index_state.commit_rebuild(video_id=video_id,
                                             parents=chunks.parents,
                                             transcript_hash=transcript_hash(prepared.sentences),
                                             metadata=metadata)

            self._vector_store.delete_stale(video_id,
                                            [child.chunk_id for child in chunks.children])

            self._keyword_retriever.invalidate(video_id)

        except Exception as exc:
            self._index_state.mark_failed(video_id, str(exc))

            if not state.is_indexed:
                raise

            logger.exception("Rebuilding '%s' failed; serving the previous index.", video_id)

            return self._reuse(video_id)

        return IndexResponse(video_id=video_id,
                             indexed=True,
                             action=action,
                             parent_count=len(chunks.parents),
                             child_count=len(chunks.children),
                             metadata=metadata,
                             message=MESSAGES[action])


    def _collect_metadata(self,
                          video_id: str,
                          prepared: PreparedTranscript,
                          chunks: HierarchicalChunks) -> VideoMetadata:
        """
        Gather video-level metadata. Never raises — metadata is presentation
        detail and must not block indexing.
        """

        oembed = self._oembed_provider.fetch(video_id)

        try:
            overview = self._generation_service.generate_overview(chunks.parents)

        except Exception:
            logger.exception("Overview generation failed for '%s'.", video_id)
            overview = None

        return VideoMetadata(video_id=video_id,
                             title=oembed.title if oembed else None,
                             channel=oembed.channel if oembed else None,
                             duration=prepared.duration,
                             language=prepared.language,
                             language_code=prepared.language_code,
                             overview=overview)


    def _reuse(self,
               video_id: str,
               metadata: VideoMetadata | None = None) -> IndexResponse:
        """Callers that already hold the metadata pass it in to save a query."""

        if metadata is None:
            metadata = self._index_state.get_metadata(video_id)

        return IndexResponse(video_id=video_id,
                             indexed=True,
                             action="reused",
                             metadata=metadata,
                             message=MESSAGES["reused"])
