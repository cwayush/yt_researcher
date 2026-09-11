"""
API-layer request and response models.

These models define the HTTP contract between clients and the API.
They are separate from domain models to keep API shape independent
from internal data transformations.
"""

from typing import Literal

from pydantic import BaseModel, Field

from src.models.index_state import VideoMetadata


class IndexRequest(BaseModel):
    """
    Request body for indexing a YouTube video.

    The provided YouTube URL is used to fetch the transcript,
    create parent and child chunks, generate child embeddings,
    and store the resulting data in the configured databases.
    """

    url: str = Field(min_length=1,
                     description="YouTube video URL to index")

    
class IndexResponse(BaseModel):
    """
    Response returned after a video is made searchable.
    """

    video_id: str
    indexed: bool
    action: Literal["indexed", "reused", "rebuilt"]
    parent_count: int | None = None
    child_count: int | None = None
    metadata: VideoMetadata | None = None
    message: str