"""
API-layer request and response models.

These models define the HTTP contract between clients and the API.
They are separate from domain models to keep API shape independent
from internal data transformations.
"""

from pydantic import BaseModel, Field


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
    Response returned after successfully indexing a YouTube video.

    Contains the video identifier, indexing status, number of
    parent and child chunks processed, and a status message.
    """
    
    video_id: str
    indexed: bool
    parent_count: int
    child_count: int
    message: str