"""
YouTube Researcher API — application entry point.

Registers:
    - FastAPI application with metadata
    - All API routers
    - Global exception handlers (domain errors → HTTP responses)

Never expose stack traces or internal error details to clients.
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.api.chunking import router as chunking_router
from src.api.embedding import router as embedding_router
from src.api.exceptions import (
    InvalidYouTubeURL,
    ResetFailed,
    TranscriptNotAvailable,
    VideoNotFound,
)
from src.api.indexing import router as index_router
from src.api.reset import router as reset_router
from src.api.retrieval import router as query_router
from src.api.transcript import router as transcript_router
from src.config.settings import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description="Backend for YouTube Video RAG - fetch, process, chunk, embed, and query YouTube transcripts.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# The browser client runs on its own origin, so it needs explicit permission.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Exception Handlers
@app.exception_handler(InvalidYouTubeURL)
async def invalid_youtube_url_handler(request: Request, exc: InvalidYouTubeURL) -> JSONResponse:
    return JSONResponse(
        status_code=400,
        content={"error": "invalid_youtube_url", "detail": str(exc)},
    )


@app.exception_handler(TranscriptNotAvailable)
async def transcript_not_available_handler(request: Request, exc: TranscriptNotAvailable) -> JSONResponse:
    return JSONResponse(
        status_code=422,
        content={
            "error": "transcript_not_available",
            "detail": str(exc),
            "video_id": exc.video_id,
        },
    )


@app.exception_handler(VideoNotFound)
async def video_not_found_handler(request: Request, exc: VideoNotFound) -> JSONResponse:
    return JSONResponse(
        status_code=404,
        content={"error": "video_not_found", "detail": str(exc), "video_id": exc.video_id},
    )


@app.exception_handler(ResetFailed)
async def reset_failed_handler(request: Request, exc: ResetFailed) -> JSONResponse:
    return JSONResponse(
        status_code=500,
        content={
            "error": "reset_failed",
            "detail": str(exc),
            "stage": exc.stage,
            "completed": exc.completed,
        },
    )


# Main pipeline: index a video, then ask questions about it
app.include_router(index_router, prefix="/api/v1")
app.include_router(query_router, prefix="/api/v1")

# Inspection routes: expose intermediate pipeline stages, nothing is stored
app.include_router(transcript_router, prefix="/api/v1")
app.include_router(chunking_router, prefix="/api/v1")
app.include_router(embedding_router, prefix="/api/v1")

# Development only: wipes every video this application has indexed.
app.include_router(reset_router, prefix="/api/v1")


@app.get("/health", tags=["System"])
def health_check() -> dict:
    """Returns service liveness status."""
    return {"status": "ok", "version": settings.app_version}
