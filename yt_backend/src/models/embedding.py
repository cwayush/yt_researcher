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
