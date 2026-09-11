from sqlalchemy import select
from src.parentstore.base import ParentStore
from src.models.chunks import ParentChunk
from src.database.models import ParentChunkRecord

class PostgresParentStore(ParentStore):
    """
    Read access to parent chunks for context expansion.

    Parents are written by PostgresIndexStateStore.commit_rebuild, which
    replaces them in the same transaction that marks the video indexed.
    """

    def __init__(self, session_factory):
        self._session_factory = session_factory


    def get_by_ids(self, ids: list[str]) -> list[ParentChunk]:

        if not ids:
            return []

        with self._session_factory() as session:

            records = session.scalars(
                select(ParentChunkRecord).where(
                    ParentChunkRecord.chunk_id.in_(ids))
                ).all()

        return [
            ParentChunk(
                chunk_id=record.chunk_id,
                video_id=record.video_id,
                text=record.text,
                start=record.start_time,
                end=record.end_time,
                index=record.index,
                sentence_indices=record.sentence_indices,
                token_count=record.token_count
            )

            for record in records
        ]