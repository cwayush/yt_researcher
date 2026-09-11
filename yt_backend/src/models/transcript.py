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


class FetchedTranscript(BaseModel):
    """
    A transcript as returned by an ingestion provider.

    Carries the language the captions were published in alongside the segments,
    so the indexing pipeline can record it without a second lookup.
    """

    segments: list[TranscriptSegment]
    language: str
    language_code: str


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


class PreparedTranscript(BaseModel):
    """
    The output of the transcript preparation pipeline.

    Sentences are what chunking and hashing consume; the language fields are
    carried through for video metadata.
    """

    sentences: list[Sentence]
    language: str
    language_code: str

    @property
    def duration(self) -> float:
        """End timestamp of the last sentence, or 0.0 for an empty transcript."""
        return self.sentences[-1].end if self.sentences else 0.0


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

