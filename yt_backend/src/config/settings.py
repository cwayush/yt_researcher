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
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.

    All fields with no default are required at startup.
    Optional fields default to None and may be unused depending on
    which providers are active.
    """

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # silently ignore unknown env vars
    )

    # LLM Providers and API Key(for generation final output)
    google_api_key: str | None = None
    google_generation_model: str

    # Embedding Models and dimensions
    google_embedding_model: str
    google_embedding_dimensions: int = 768

    openai_api_key: str | None = None

    # LLM Providers and API Key(for generation final output)
    groq_api_key: str
    groq_model: str

    # Embedding & Search 
    hf_token: str | None = None

    # LangSmith Observability 
    langchain_api_key: str | None = None
    langchain_project: str | None = None

    # Tavily Web Search 
    tavily_api_key: str | None = None

    # Application 
    app_name: str = "YouTube Researcher API"
    app_version: str = "0.1.0"
    debug: bool = False

    # Transcript Processing 
    sentence_pause_threshold: float = 2.0  # seconds between segments to force sentence break

    # Quant vector database configuration
    qdrant_url: str
    qdrant_api_key: str | None = None
    qdrant_collection: str = "youtube_chunks"

    # PostgreSQl database url(which use for storing parent chunks context)
    database_url: str

    # RRFFusion constant(k)
    rrf_k: int

    retrieval_candidate_limit: int
    retrieval_final_limit: int

    # Reranking Model and Minimum score for each res
    reranker_model: str
    reranker_min_score: float



@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """
    Returns a cached Settings singleton.

    Using lru_cache means .env is read once at startup, not on every request.
    Call `get_settings.cache_clear()` in tests to reset between test cases.
    """
    return Settings()
