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
