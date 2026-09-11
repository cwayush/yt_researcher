"""
Domain models for video-level indexing state and metadata.

VideoIndexState answers "is this video indexed, and when was that last
verified". VideoMetadata describes the video itself for display.
"""

from datetime import datetime

from pydantic import BaseModel


class VideoIndexState(BaseModel):
    """
    Indexing state for one video.

    A video is usable when it has both an indexed_at and a transcript_hash:
    that pair is written in the same transaction as the searchable data, so
    it is the only reliable signal that an index exists. `status` is for
    reporting and debugging, never for branching.
    """

    video_id: str
    status: str
    transcript_hash: str | None = None
    indexed_at: datetime | None = None
    last_checked_at: datetime | None = None
    last_error: str | None = None

    @property
    def is_indexed(self) -> bool:
        return self.indexed_at is not None and self.transcript_hash is not None


class VideoMetadata(BaseModel):
    """
    Video-level metadata shown alongside the research workspace.

    Every field but video_id is optional: metadata lookup and overview
    generation must never prevent a video from being indexed.

    duration is the end timestamp of the last transcript sentence, so it
    measures caption coverage rather than exact video length.
    """

    video_id: str
    title: str | None = None
    channel: str | None = None
    duration: float | None = None
    language: str | None = None
    language_code: str | None = None
    overview: str | None = None


class OEmbedMetadata(BaseModel):
    """The subset of video metadata YouTube's oEmbed endpoint exposes."""

    title: str | None = None
    channel: str | None = None
