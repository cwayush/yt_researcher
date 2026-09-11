"""
Application configuration using pydantic-settings.

Settings are loaded from environment variables and/or a .env file.
All config is typed and validated at startup — missing required values
raise a clear error before any request is served.

Usage:
    from src.config.settings import get_settings
    settings = get_settings()
    print(settings.google_api_key)
"""

from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    All fields with no default are required at startup.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # silently ignore unknown env vars
    )

    # Google: embeddings (required: every index and query call embeds text)
    google_api_key: str
    google_embedding_model: str
    google_embedding_dimensions: int = 768

    # Groq: answer generation
    groq_api_key: str
    groq_model: str

    # Hugging Face: used by sentence-transformers when the reranker model is gated
    hf_token: str | None = None

    # LangSmith observability - read from the process environment by the
    # LangChain SDK itself; declared here so startup fails loudly if a
    # malformed value is present.
    langchain_api_key: str | None = None
    langchain_project: str | None = None

    # Application
    app_name: str = "YouTube Researcher API"
    app_version: str = "0.1.0"
    debug: bool = False

    # Transcript processing
    sentence_pause_threshold: float = 2.0  # seconds between segments to force sentence break

    # Indexing freshness: days before an indexed video's transcript is re-checked
    freshness_check_days: int 

    # Qdrant vector database: stores child chunk vectors
    qdrant_url: str
    qdrant_api_key: str | None = None
    qdrant_collection: str = "youtube_chunks"

    # PostgreSQL: stores parent chunks for context expansion
    database_url: str

    # Reciprocal Rank Fusion constant
    rrf_k: int

    # Retrieval funnel: candidates fetched per retriever, then survivors after reranking
    retrieval_candidate_limit: int
    retrieval_final_limit: int

    # Cross-encoder reranking
    reranker_model: str
    reranker_min_score: float = Field(gt=0.0, lt=1.0)


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Returns a cached Settings singleton.

    Using lru_cache means .env is read once at startup, not on every request.
    Call `get_settings.cache_clear()` in tests to reset between test cases.
    """
    return Settings()
