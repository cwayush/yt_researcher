"""
Domain models for transcript data.

These models represent the full data lifecycle from raw YouTube transcript
segments through to reconstructed sentences. They are the source of truth
for all transcript-related data transformations.
"""

from pydantic import BaseModel, Field

        
class TranscriptSegment(BaseModel):
    """
    Raw transcript segment as returned by youtube-transcript-api.

    Preserves the exact data from YouTube: text, start time, and duration.
    The `end` property is computed to avoid storing redundant data.
    """

    text: str
    start: float
    duration: float

    @property
    def end(self) -> float:
        """Computed end timestamp = start + duration."""
        return self.start + self.duration


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


class ProcessedSegment(BaseModel):
    """
    A cleaned transcript segment after normalization.

    Differences from TranscriptSegment:
    - `text` is whitespace-normalized
    - `duration` is dropped; `end` is stored explicitly
    - `index` tracks the original position in the segment list
    """

    text: str
    start: float
    end: float
    index: int


class Sentence(BaseModel):
    """
    A logically reconstructed sentence composed of one or more ProcessedSegments.

    Sentence boundaries are determined by punctuation and/or timestamp pauses.
    The sentence preserves full timestamp lineage from its source segments.
    """

    text: str
    start: float
    end: float
    index: int
    source_segments: list[int] = Field(
        default_factory=list,
        description="Indices of the ProcessedSegments that formed this sentence.",
    )


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
    def from_sentences(cls, 
                       video_id: str, 
                       sentences: list[Sentence]) -> "TranscriptResponse":

        return cls(
            video_id=video_id,
            sentences=sentences,
            sentence_count=len(sentences),
        )

