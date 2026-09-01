"""
API-layer request and response models.

These models define the HTTP contract between clients and the API.
They are separate from domain models to keep API shape independent
from internal data transformations.
"""

from pydantic import BaseModel

from src.models.transcript import Sentence


class TranscriptRequest(BaseModel):
    """Request body for the transcript endpoint."""

    url: str


class TranscriptResponse(BaseModel):
    """
    Response body for the transcript endpoint.

    Returns the reconstructed sentences (not raw segments) so clients
    receive logically complete units of text with preserved timestamps.
    """

    video_id: str
    sentences: list[Sentence]
    sentence_count: int

    @classmethod
    def from_sentences(cls, video_id: str, sentences: list[Sentence]) -> "TranscriptResponse":
        return cls(
            video_id=video_id,
            sentences=sentences,
            sentence_count=len(sentences),
        )
