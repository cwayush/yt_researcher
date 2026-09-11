"""
Contracts for the development reset endpoint.

ResetRequest and ResetResponse are the HTTP shape; IndexResetCounts is what
the PostgreSQL store reports back so the response can state exactly how much
was removed.
"""

from typing import Literal

from pydantic import BaseModel, Field


class ResetRequest(BaseModel):
    """
    Request body for resetting all indexed application data.
    """

    confirm: Literal[True] = Field(description="Must be true. Guards against an accidental reset.")


class IndexResetCounts(BaseModel):
    """Rows removed from each indexing table."""

    parent_chunks: int
    videos: int
    metadata: int


class ResetResponse(BaseModel):
    """What the reset actually removed from each store."""

    reset: bool
    deleted_parent_chunks: int
    deleted_videos: int
    deleted_metadata: int
    deleted_vectors: int
    cleared_bm25_cache: bool
    message: str
