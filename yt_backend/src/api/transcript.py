"""
Transcript API route — thin HTTP layer.

Responsibility:
    1. Parse and validate the incoming request.
    2. Call the TranscriptService.
    3. Return the response or let exception handlers translate errors.

NO business logic lives here.
"""

from fastapi import APIRouter

from src.models.api import TranscriptRequest, TranscriptResponse, ChunkRequest, ChunkResponse, EmbeddedResponse, IndexResponse
from src.services.transcript_service import TranscriptService

router = APIRouter(tags=["Transcript"])

_service = TranscriptService()


@router.post(
    "/transcript",
    response_model=TranscriptResponse,
    summary="Fetch and process a YouTube transcript",
    description=(
        "Accepts a YouTube URL, fetches the transcript, normalises the text, "
        "and reconstructs logical sentences with preserved timestamps."
    ),
)
def get_transcript(request: TranscriptRequest) -> TranscriptResponse:
    """
    POST /api/v1/transcript

    Request body:
        { "url": "https://www.youtube.com/watch?v=..." }

    Response:
        TranscriptResponse with video_id, sentence_count, and sentences list.

    Errors:
        400 — Invalid YouTube URL
        422 — Transcript not available for this video
        500 — Unexpected server error
    """
    # Exceptions bubble up to the handlers registered in main.py
    return _service.get_transcript(request.url)

@router.post('/chunks',
             response_model=ChunkResponse,
             summary="Create Hierarchical transcript chunks")
def get_chunks(request:ChunkRequest):

    return _service.get_chunks(request.url)


@router.post('/embeddings',
             response_model=EmbeddedResponse,
             summary="Create Hierarchical chunks embeddings")
def get_embeddings(request:ChunkRequest):

    return _service.get_embedding(request.url)


@router.post('/response',
             response_model=IndexResponse,
             summary="Get Overall flow response after embeddings store")
def get_response(request:ChunkRequest):

    return _service.get_response(request.url)