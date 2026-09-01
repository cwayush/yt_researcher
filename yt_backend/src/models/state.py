"""
Future orchestration state models.

NOTE: TranscribeState is NOT currently used in the active API flow.
It is preserved here as a scaffold for future LangGraph-based agentic workflows,
where a stateful graph node will populate video metadata alongside the transcript.
"""


from pydantic import BaseModel, Field

from src.models.transcript import TranscriptSegment


class TranscribeState(BaseModel):
    """
    Full state for a transcript ingestion workflow.

    This is designed for use with LangGraph or similar stateful orchestration
    frameworks. Currently NOT wired into any active endpoint.

    Fields:
        video_id:   YouTube video ID (required to start)
        video_url:  Full original URL
        title:      Video title (populated by metadata fetcher — not yet implemented)
        channel:    Channel name (populated by metadata fetcher — not yet implemented)
        duration:   Video duration in seconds (not yet implemented)
        language:   Detected transcript language (not yet implemented)
        transcript: Raw segments from YouTube API
        success:    Whether ingestion completed without error
        error:      Error message if success=False
    """

    # Input
    video_id: str
    video_url: str

    # Video metadata — populated by future metadata step
    title: str | None = None
    channel: str | None = None
    duration: float | None = None
    language: str | None = None

    # Transcript segments
    transcript: list[TranscriptSegment] = Field(default_factory=list)

    # Status
    success: bool = False
    error: str | None = None
