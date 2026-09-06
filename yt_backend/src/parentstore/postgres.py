from sqlalchemy import select, delete
from src.parentstore.base import ParentStore
from src.models.chunks import ParentChunk
from src.database.models import ParentChunkRecord

class PostgresParentStore(ParentStore):

    def __init__(self, session_factory):
        self._session_factory = session_factory


    def add_parents(self, parents: list[ParentChunk]) -> None:

        if not parents:
            return

        video_id = parents[0].video_id

        with self._session_factory() as session:

            session.execute(delete(ParentChunkRecord).where(
                ParentChunkRecord.video_id == video_id)
            )

            records = [
                ParentChunkRecord(
                    chunk_id=parent.chunk_id,
                    video_id=parent.video_id,
                    text=parent.text,
                    index=parent.index,
                    start_time=parent.start,
                    end_time=parent.end,
                    sentence_indices=parent.sentence_indices,
                    token_count=parent.token_count,
                )

                for parent in parents
            ]

            session.add_all(records)
            session.commit()


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