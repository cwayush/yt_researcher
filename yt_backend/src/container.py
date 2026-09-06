from src.config.settings import get_settings
from src.services.transcript import TranscriptService
from src.services.indexing import IndexingService
from src.chunking.service import ChunkingService
from src.embeddings.service import EmbeddingService
from src.embeddings.gemini import GoogleEmbeddingProvider
from src.vectorstore.qdrant import QdrantVectorStore
from src.parentstore.postgres import PostgresParentStore
from src.database.connection import SessionFactory
from src.services.retrieval import RetrievalService
from src.services.generation import GenerationService
from src.generation.gemini import GeminiGenerationProvider
from src.generation.groq import GroqGenerationProvider
from src.retrieval.dense.retriever import DenseRetriever
from src.retrieval.parent.expander import ParentExpander
from src.retrieval.context.builder import ContextBuilder
from src.retrieval.pipeline import RetrievalPipeline


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


def create_parent_store() -> PostgresParentStore:
    return PostgresParentStore(
        session_factory=SessionFactory,
    )


def create_generation_service() -> GenerationService:

    settings = get_settings()

    # provider = GeminiGenerationProvider(api_key=settings.google_api_key,
    #                                     model=settings.google_generation_model)
    
    provider = GroqGenerationProvider(api_key=settings.groq_api_key,
                                        model=settings.groq_model)

    return GenerationService(provider=provider)


def create_indexing_service() -> IndexingService:

    return IndexingService(
        transcript_service=create_transcript_service(),
        chunking_service=create_chunking_service(),
        embedding_service=create_embedding_service(),
        vector_store=create_vector_store(),
        parent_store=create_parent_store(),
    )


def create_retrieval_service() -> RetrievalService:

    embedding_service = create_embedding_service()

    vector_store = create_vector_store()

    dense_retriever = DenseRetriever(vector_store=vector_store)

    parent_store = create_parent_store()

    parent_expander = ParentExpander(parent_store=parent_store)

    context_builder = ContextBuilder()

    retrieval_pipeline = RetrievalPipeline(dense_retriever=dense_retriever,
                                           parent_expander=parent_expander,
                                           context_builder=context_builder)

    generation_service = create_generation_service()

    return RetrievalService(embedding_service=embedding_service,
                            retrieval_pipeline=retrieval_pipeline,
                            generation_service=generation_service)