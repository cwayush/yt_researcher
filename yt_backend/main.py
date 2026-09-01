"""
YouTube Researcher API — application entry point.

Registers:
    - FastAPI application with metadata
    - All API routers
    - Global exception handlers (domain errors → HTTP responses)

Never expose stack traces or internal error details to clients.
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from src.api.exceptions import InvalidYouTubeURL, TranscriptNotAvailable, VideoNotFound
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


#  Routers 
app.include_router(transcript_router, prefix="/api/v1")


#  Health Check 
@app.get("/health", tags=["System"])
def health_check() -> dict:
    """Returns service liveness status."""
    return {"status": "ok", "version": settings.app_version}