from pydantic import BaseModel, Field
from src.models.chunks import ParentChunk
from src.models.context import BuiltContext

class RetrievedChunk(BaseModel):
    
    chunk_id: str
    parent_id: str
    video_id: str
    text: str
    score: float
    start: float
    end: float
    sentence_indices: list[int]
    token_count: int
    source: str = "dense"


class RetrievalRequest(BaseModel):
    video_id: str = Field(min_length=5, description="ID of the indexed YouTube video")
    question: str = Field(min_length=5, description="Question to ask about indexed YouTube videos")


class Evidence(BaseModel):
    start: float = Field(description="Start timestamp in seconds")
    end: float = Field(description="End timestamp in seconds")
    text: str
    relevance_score: float


class RetrievalResponse(BaseModel):
    answer: str
    evidence: list[Evidence]


class RetrievedParent(BaseModel):
    parent: ParentChunk
    relevance_score: float


class RetrievalResult(BaseModel):
    context: BuiltContext | None = None
    confident: bool