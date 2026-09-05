from pydantic import BaseModel

class VectorStoreResult(BaseModel):
    stored_count: int