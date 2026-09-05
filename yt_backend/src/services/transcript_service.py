"""
TranscriptService — application service for transcript operations.

This module contains all business logic for fetching and processing
YouTube transcripts. The API layer calls this service and never
directly touches ingestion or processing modules.

Architecture:
    API route → TranscriptService → ingestion / processing → models
"""

from src.api.exceptions import InvalidYouTubeURL, TranscriptNotAvailable
from src.ingestion.youtube import YoutubeTranscriptProvider
from src.ingestion.base import TranscriptProvider
from src.models.api import TranscriptResponse, ChunkResponse, EmbeddedResponse, IndexResponse
from src.config.settings import get_settings
from src.models.transcript import Sentence
from src.processing.sentences import reconstruct_sentences
from src.processing.transcript import process_transcript
from src.utility.youtube_url import extract_video_id
from src.services.chunking_service import ChunkingService
from src.embeddings.gemini import GoogleEmbeddingProvider
from src.services.embedding_service import EmbeddingService
from src.vectorstore.qdrant import QdrantVectorStore
from src.vectorstore.base import VectorStore



class TranscriptService:
    """
    Orchestrates the transcript fetch-and-process pipeline.

    Dependencies are injected via the constructor so they can be
    swapped in tests without touching application code.

    Usage:
        service = TranscriptService()
        response = service.get_transcript("https://www.youtube.com/watch?v=...")
    """

    def __init__(self, 
                 provider: TranscriptProvider | None = None,
                 chunking_service: ChunkingService | None = None,
                 embedding_service: EmbeddingService | None = None,
                 vector_database: VectorStore | None = None,) -> None:
                    
        settings = get_settings()

        self._pause_threshold = settings.sentence_pause_threshold
        self._provider = provider or YoutubeTranscriptProvider()
        self._chunking_service = chunking_service or ChunkingService()

        if embedding_service is not None:
            self._embedding_service = embedding_service

        else:
            embedding_provider = GoogleEmbeddingProvider(
                                            api_key=settings.google_api_key,
                                            model=settings.google_embedding_model,
                                            output_dimensionality=settings.google_embedding_dimensions,
                                        )

            self._embedding_service = EmbeddingService(
                provider=embedding_provider
            )

        if vector_database is not None:
            self._vector_database = vector_database

        else:
            self._vector_database = QdrantVectorStore(
                                        url=settings.qdrant_url,
                                        api_key=settings.qdrant_api_key,
                                        collection_name=settings.qdrant_collection,
                                        vector_size=settings.google_embedding_dimensions,
                                    )

            
    def _prepare_transcript(self,url: str) -> tuple[str, list[Sentence]]:
        """
        Fetch, process, and reconstruct the transcript for a YouTube URL.

        Pipeline:
            URL → video_id extraction
                → raw TranscriptSegments (ingestion)
                → ProcessedSegments (normalization)
                → Sentences (reconstruction)
                → TranscriptResponse

        Args:
            url: Any valid YouTube URL (youtube.com or youtu.be).

        Returns:
            TranscriptResponse with video_id and list of reconstructed Sentences.

        Raises:
            InvalidYouTubeURL: If the URL cannot be parsed.
            TranscriptNotAvailable: If the transcript cannot be fetched.
        """

        video_id = extract_video_id(url)

        if not video_id:
            raise InvalidYouTubeURL(url)

        try:
            raw_segments = self._provider.fetch(video_id)

        except ValueError as exc:
            raise TranscriptNotAvailable(video_id,reason=str(exc),) from exc

        processed = process_transcript(raw_segments)

        sentences = reconstruct_sentences(
            processed,
            pause_threshold=self._pause_threshold,
        )

        return video_id, sentences
    
    
    def get_transcript(self, url: str) -> TranscriptResponse:

        video_id, sentences = self._prepare_transcript(url)

        return TranscriptResponse.from_sentences(
            video_id=video_id,
            sentences=sentences,
        )


    def get_chunks(self, url: str) -> ChunkResponse:

        video_id, sentences = self._prepare_transcript(url)

        chunks = self._chunking_service.create_chunks(sentences=sentences,
                                                      video_id=video_id)

        return ChunkResponse.from_chunks(video_id=video_id,
                                        parents=chunks.parents,
                                        children=chunks.children)

    
    def get_embedding(self, url: str) -> EmbeddedResponse:

        video_id, sentences = self._prepare_transcript(url)

        chunks = self._chunking_service.create_chunks(sentences=sentences,
                                                      video_id=video_id)

        embeddings = self._embedding_service.embed_children(chunks.children)

        return EmbeddedResponse.from_embedding(video_id=video_id,
                                               embeddings=embeddings)
        
    
    def get_response(self, url: str) -> IndexResponse:

        video_id, sentences = self._prepare_transcript(url)
        
        chunks = self._chunking_service.create_chunks(sentences=sentences,
                                                      video_id=video_id)

        embeddings = self._embedding_service.embed_children(chunks.children)

        self._vector_database.add_chunks(embeddings)

        return IndexResponse(video_id=video_id,
                             indexed=True,
                             parent_count=len(chunks.parents),
                             child_count=len(chunks.children),
                             message="Video chunks successfully embedded and stored.")
    