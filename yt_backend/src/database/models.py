from sqlalchemy import Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class ParentChunkRecord(Base):
    __tablename__ = "parent_chunks"

    chunk_id:           Mapped[str] = mapped_column(String, primary_key=True)
    video_id:           Mapped[str] = mapped_column(String, nullable=False, index=True)
    text:               Mapped[str] = mapped_column(Text, nullable=False)
    index:              Mapped[int] = mapped_column(Integer, nullable=False)
    start_time:         Mapped[float] = mapped_column(Float, nullable=False)
    end_time:           Mapped[float] = mapped_column(Float, nullable=False)
    sentence_indices:   Mapped[list[int]] = mapped_column(ARRAY(Integer), nullable=False)
    token_count:        Mapped[int] = mapped_column(Integer, nullable=False)
