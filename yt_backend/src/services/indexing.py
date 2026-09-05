"""
IndexingService — application service for indexing YouTube videos.

Pipeline:
    YouTube URL → transcript → sentences → chunks → parent storage → child embeddings → vector storage
"""

from src.models.index import IndexResponse
from src.services.transcript import TranscriptService
from src.chunking.service import ChunkingService
from src.embeddings.service import EmbeddingService
from src.vectorstore.base import VectorStore

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
                 vector_store: VectorStore) -> None:

        self._transcript_service = transcript_service
        self._chunking_service = chunking_service
        self._embedding_service = embedding_service
        self._vector_store = vector_store

    def index(self, url: str) -> IndexResponse:
        """
        Fetch, process, and reconstruct a YouTube transcript.

        Returns:
            Video ID and reconstructed sentences.
        """

        # 1. Transcript
        video_id, sentences = self._transcript_service.prepare(url)

        # 2. Parent + child chunks
        chunks = self._chunking_service.create_chunks(sentences=sentences,video_id=video_id)

        # 3. Generate child embeddings
        embedded_children = self._embedding_service.embed_children(chunks.children)

        # 4. Store child vectors in Qdrant
        self._vector_store.add_chunks(embedded_children)

        return IndexResponse(video_id=video_id,
                             indexed=True,
                             parent_count=len(chunks.parents),
                             child_count=len(chunks.children),
                             message="Video successfully indexed.")