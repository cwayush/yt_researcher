"""
API-layer request and response models.

These models define the HTTP contract between clients and the API.
They are separate from domain models to keep API shape independent
from internal data transformations.
"""

from pydantic import BaseModel, Field
from src.models.transcript import Sentence
from src.models.chunks import ChildChunk, ParentChunk
from src.models.embeddings import EmbeddedChunk


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
    def from_sentences(cls, 
                       video_id: str, 
                       sentences: list[Sentence]) -> "TranscriptResponse":

        return cls(
            video_id=video_id,
            sentences=sentences,
            sentence_count=len(sentences),
        )


class ChunkRequest(BaseModel):
    """
    Request body for transcript chunking.
    """

    url: str = Field(min_length=1,
                     description="YouTube video URL")


class ChunkResponse(BaseModel):
    """
    Response containing hierarchical chunks.
    """

    video_id: str

    parent_count: int
    child_count: int

    parents: list[ParentChunk]
    children: list[ChildChunk]

    @classmethod
    def from_chunks(cls,
                    video_id: str,
                    parents: list[ParentChunk],
                    children: list[ChildChunk]) -> "ChunkResponse":

        return cls(
            video_id=video_id,
            parent_count=len(parents),
            child_count=len(children),
            parents=parents,
            children=children,
        )

class EmbeddedResponse(BaseModel):
    """
        Response containing hierarchical chunks with Embeddings.
    """
    video_id: str

    embeddings: list[EmbeddedChunk]

    @classmethod
    def from_embedding(cls,
                    video_id: str,
                    embeddings: list[EmbeddedChunk]) -> "EmbeddedResponse":

        return cls(
            video_id=video_id,
            embeddings=embeddings
        )

class IndexResponse(BaseModel):
    """
    Response return after savind data on vecotrDB
    """
    
    video_id: str
    indexed: bool
    parent_count: int
    child_count: int
    message: str