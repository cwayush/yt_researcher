from pydantic import BaseModel


class BuiltContext(BaseModel):
    text: str
