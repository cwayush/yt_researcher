from pydantic import BaseModel, Field

class EmbeddedChunk(BaseModel):
    chunk_id: str
    parent_id: str
    video_id: str

    text: str
    vector: list[float]

    start: float
    end: float

    sentence_indices: list[int] = Field(default_factory=list)
    token_count: int