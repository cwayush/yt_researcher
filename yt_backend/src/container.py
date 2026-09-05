from src.config.settings import get_settings
from src.services.transcript import TranscriptService
from src.services.indexing import IndexingService
from src.chunking.service import ChunkingService
from src.embeddings.service import EmbeddingService
from src.embeddings.gemini import GoogleEmbeddingProvider
from src.vectorstore.qdrant import QdrantVectorStore

def create_transcript_service() -> TranscriptService:
    return TranscriptService()


def create_chunking_service() -> ChunkingService:
    return ChunkingService()


def create_embedding_service() -> EmbeddingService:
    settings = get_settings()

    provider = GoogleEmbeddingProvider(
        api_key=settings.google_api_key,
        model=settings.google_embedding_model,
        output_dimensionality=settings.google_embedding_dimensions,
    )

    return EmbeddingService(provider=provider)


def create_vector_store() -> QdrantVectorStore:
    settings = get_settings()

    return QdrantVectorStore(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key,
        collection_name=settings.qdrant_collection,
        vector_size=settings.google_embedding_dimensions,
    )


def create_indexing_service() -> IndexingService:

    return IndexingService(
        transcript_service=create_transcript_service(),
        chunking_service=create_chunking_service(),
        embedding_service=create_embedding_service(),
        vector_store=create_vector_store(),
    )
