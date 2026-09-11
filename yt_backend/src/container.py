"""
Composition root.

Builds and wires every concrete implementation the application needs.
This is the only module that knows which provider backs each interface,
so swapping Groq for Gemini, or Qdrant for another vector store, is a
single-line change here.

Every factory is cached with lru_cache, which makes each dependency a
process-wide singleton. That matters because these objects own expensive
resources: HTTP clients, a database engine, and the cross-encoder model.
FastAPI routes depend on these factories through Depends(), so nothing is
constructed until the first request that actually needs it.
"""

from functools import lru_cache

from src.config.settings import get_settings
from src.database.connection import SessionFactory

from src.chunking.service import ChunkingService
from src.embeddings.gemini import GoogleEmbeddingProvider
from src.embeddings.service import EmbeddingService
from src.generation.groq import GroqGenerationProvider
from src.indexstate.postgres import PostgresIndexStateStore
from src.ingestion.oembed import YoutubeOEmbedProvider
from src.parentstore.postgres import PostgresParentStore
from src.vectorstore.qdrant import QdrantVectorStore

from src.retrieval.confidence.checker import RerankerConfidenceChecker
from src.retrieval.context.builder import ContextBuilder
from src.retrieval.deduplication.deduplicator import ExactDeduplicator
from src.retrieval.dense.retriever import DenseRetriever
from src.retrieval.fusion.rrf import RRFFusion
from src.retrieval.keyword.bm25 import BM25Retriever
from src.retrieval.parent.expander import ParentExpander
from src.retrieval.pipeline import RetrievalPipeline
from src.retrieval.reranking.cross_encoder import CrossEncoderReranker

from src.services.generation import GenerationService
from src.services.indexing import IndexingService
from src.services.reset import ResetService
from src.services.retrieval import RetrievalService
from src.services.transcript import TranscriptService


@lru_cache(maxsize=1)
def get_transcript_service() -> TranscriptService:
    return TranscriptService()


@lru_cache(maxsize=1)
def get_chunking_service() -> ChunkingService:
    return ChunkingService()


@lru_cache(maxsize=1)
def get_embedding_service() -> EmbeddingService:
    settings = get_settings()

    provider = GoogleEmbeddingProvider(
        api_key=settings.google_api_key,
        model=settings.google_embedding_model,
        output_dimensionality=settings.google_embedding_dimensions,
    )

    return EmbeddingService(provider=provider)


@lru_cache(maxsize=1)
def get_vector_store() -> QdrantVectorStore:
    settings = get_settings()

    return QdrantVectorStore(
        url=settings.qdrant_url,
        api_key=settings.qdrant_api_key,
        collection_name=settings.qdrant_collection,
        vector_size=settings.google_embedding_dimensions,
    )


@lru_cache(maxsize=1)
def get_parent_store() -> PostgresParentStore:
    return PostgresParentStore(session_factory=SessionFactory)


@lru_cache(maxsize=1)
def get_index_state_store() -> PostgresIndexStateStore:
    return PostgresIndexStateStore(session_factory=SessionFactory)


@lru_cache(maxsize=1)
def get_oembed_provider() -> YoutubeOEmbedProvider:
    return YoutubeOEmbedProvider()


@lru_cache(maxsize=1)
def get_keyword_retriever() -> BM25Retriever:
    return BM25Retriever(vector_store=get_vector_store())


@lru_cache(maxsize=1)
def get_generation_service() -> GenerationService:
    settings = get_settings()

    provider = GroqGenerationProvider(api_key=settings.groq_api_key,
                                      model=settings.groq_model)

    return GenerationService(provider=provider)


@lru_cache(maxsize=1)
def get_indexing_service() -> IndexingService:
    return IndexingService(
        transcript_service=get_transcript_service(),
        chunking_service=get_chunking_service(),
        embedding_service=get_embedding_service(),
        generation_service=get_generation_service(),
        vector_store=get_vector_store(),
        index_state=get_index_state_store(),
        oembed_provider=get_oembed_provider(),
        keyword_retriever=get_keyword_retriever(),
    )


@lru_cache(maxsize=1)
def get_reset_service() -> ResetService:
    return ResetService(
        index_state=get_index_state_store(),
        vector_store=get_vector_store(),
        keyword_retriever=get_keyword_retriever(),
    )


@lru_cache(maxsize=1)
def get_retrieval_pipeline() -> RetrievalPipeline:
    settings = get_settings()

    vector_store = get_vector_store()

    return RetrievalPipeline(
        dense_retriever=DenseRetriever(vector_store=vector_store),
        keyword_retriever=get_keyword_retriever(),
        rrf_fusion=RRFFusion(k=settings.rrf_k),
        deduplicator=ExactDeduplicator(),
        reranker=CrossEncoderReranker(model_name=settings.reranker_model),
        confidence_checker=RerankerConfidenceChecker(min_score=settings.reranker_min_score),
        parent_expander=ParentExpander(parent_store=get_parent_store()),
        context_builder=ContextBuilder(),
        candidate_limit=settings.retrieval_candidate_limit,
        final_limit=settings.retrieval_final_limit,
    )


@lru_cache(maxsize=1)
def get_retrieval_service() -> RetrievalService:
    return RetrievalService(
        embedding_service=get_embedding_service(),
        retrieval_pipeline=get_retrieval_pipeline(),
        generation_service=get_generation_service(),
    )
