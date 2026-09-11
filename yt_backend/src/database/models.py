from datetime import datetime

from sqlalchemy import DateTime, Float, Integer, String, Text, func
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


class VideoIndexRecord(Base):
    __tablename__ = "video_index"

    video_id:           Mapped[str] = mapped_column(String, primary_key=True)
    status:             Mapped[str] = mapped_column(String, nullable=False)
    transcript_hash:    Mapped[str | None] = mapped_column(String, nullable=True)
    indexed_at:         Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_checked_at:    Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_error:         Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at:         Mapped[datetime] = mapped_column(DateTime(timezone=True),
                                                         nullable=False,
                                                         server_default=func.now())


class VideoMetadataRecord(Base):
    __tablename__ = "video_metadata"

    video_id:           Mapped[str] = mapped_column(String, primary_key=True)
    title:              Mapped[str | None] = mapped_column(String, nullable=True)
    channel:            Mapped[str | None] = mapped_column(String, nullable=True)
    duration:           Mapped[float | None] = mapped_column(Float, nullable=True)
    language:           Mapped[str | None] = mapped_column(String, nullable=True)
    language_code:      Mapped[str | None] = mapped_column(String, nullable=True)
    overview:           Mapped[str | None] = mapped_column(Text, nullable=True)
    metadata_updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
