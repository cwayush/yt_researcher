"""
Transcript API route - thin HTTP layer.

Responsibilities:
    1. Parse and validate the incoming request.
    2. Call TranscriptService.
    3. Return the response.
    4. Let exception handlers translate domain errors.

No business logic lives here.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from src.container import get_transcript_service
from src.models.index import IndexRequest
from src.models.transcript import TranscriptResponse
from src.services.transcript import TranscriptService


router = APIRouter(tags=["Transcript"])


@router.post("/transcript",
             response_model=TranscriptResponse,
             summary="Fetch and process a YouTube transcript",
             description=(
                 "Accepts a YouTube URL, fetches the transcript, normalises the text, "
                 "and reconstructs logical sentences with preserved timestamps."),
)
def get_transcript(request: IndexRequest,
                   service: Annotated[TranscriptService, Depends(get_transcript_service)]) -> TranscriptResponse:

    video_id, sentences = service.prepare(request.url)

    return TranscriptResponse.from_sentences(video_id=video_id, sentences=sentences)
