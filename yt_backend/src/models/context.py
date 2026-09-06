from pydantic import BaseModel


class ContextSource(BaseModel):
    parent_id: str
    video_id: str
    text: str
    start: float
    end: float
    relevance_score: float


class BuiltContext(BaseModel):
    text: str
    sources: list[ContextSource]