from pydantic import BaseModel, Field


class ChildChunk(BaseModel):
    """
    Smaller retrieval unit.

    Child chunks are embedded and searched in the vector store.
    Each child points back to its parent through parent_id.
    """

    chunk_id: str
    parent_id: str
    video_id: str
    text: str
    start: float
    end: float
    index: int
    sentence_indices: list[int] = Field(default_factory=list)
    token_count: int = 0


class ParentChunk(BaseModel):
    """
    Large contextual chunk.

    A parent contains multiple sentences and provides
    broader context to the LLM after retrieval.
    """

    chunk_id: str
    video_id: str
    text: str
    start: float
    end: float
    index: int
    sentence_indices: list[int] = Field(default_factory=list)
    token_count: int = 0


class HierarchicalChunks(BaseModel):
    """
    Complete output of the hierarchical chunking process.
    """

    parents: list[ParentChunk] = Field(default_factory=list)

    children: list[ChildChunk] = Field(default_factory=list)


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