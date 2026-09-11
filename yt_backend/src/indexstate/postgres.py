import hashlib
from collections.abc import Iterator
from contextlib import contextmanager
from datetime import UTC, datetime

from sqlalchemy import delete, text
from sqlalchemy.dialects.postgresql import insert

from src.database.models import ParentChunkRecord, VideoIndexRecord, VideoMetadataRecord
from src.models.chunks import ParentChunk
from src.models.index_state import VideoIndexState, VideoMetadata
from src.models.reset import IndexResetCounts

# Upper bound on how long a request will wait for another worker to finish
# indexing the same video before giving up.
LOCK_TIMEOUT_MS = 120_000


def _lock_key(video_id: str) -> int:
    """Map a video ID onto the signed 64-bit integer pg_advisory_lock expects."""
    digest = hashlib.sha256(video_id.encode("utf-8")).digest()

    return int.from_bytes(digest[:8], byteorder="big", signed=True)


def _to_state(record: VideoIndexRecord | None) -> VideoIndexState | None:

    if record is None:
        return None

    return VideoIndexState(
        video_id=record.video_id,
        status=record.status,
        transcript_hash=record.transcript_hash,
        indexed_at=record.indexed_at,
        last_checked_at=record.last_checked_at,
        last_error=record.last_error,
    )


def _to_metadata(record: VideoMetadataRecord | None) -> VideoMetadata | None:

    if record is None:
        return None

    return VideoMetadata(
        video_id=record.video_id,
        title=record.title,
        channel=record.channel,
        duration=record.duration,
        language=record.language,
        language_code=record.language_code,
        overview=record.overview,
    )


class PostgresIndexStateStore:
    """
    Tracks which videos are indexed and owns the commit point of indexing.

    Concrete rather than interface-backed: the advisory lock ties this to
    PostgreSQL, so there is no second implementation to swap in.
    """

    def __init__(self, session_factory):
        self._session_factory = session_factory


    def ensure(self, video_id: str) -> None:
        """Create the state row if this video has never been seen."""

        with self._session_factory() as session:

            session.execute(
                insert(VideoIndexRecord)
                .values(video_id=video_id, status="indexing")
                .on_conflict_do_nothing(index_elements=["video_id"])
            )

            session.commit()


    def get(self, video_id: str) -> VideoIndexState | None:

        with self._session_factory() as session:

            return _to_state(session.get(VideoIndexRecord, video_id))


    def get_with_metadata(self,
                          video_id: str) -> tuple[VideoIndexState | None, VideoMetadata | None]:
        """
        Read state and metadata together.

        One session instead of two matters here: this is the first thing every
        request does, and the round trips are the whole cost of a cache hit.
        """

        with self._session_factory() as session:

            return (_to_state(session.get(VideoIndexRecord, video_id)),
                    _to_metadata(session.get(VideoMetadataRecord, video_id)))


    @contextmanager
    def lock(self, video_id: str) -> Iterator[None]:
        """
        Serialise indexing of one video across every worker and process.

        The commit straight after acquiring is deliberate: it closes the
        transaction while keeping the lock, because a session-level advisory
        lock outlives the transaction that took it. Without it the caller
        would hold an open transaction across the embedding API call.
        """

        key = _lock_key(video_id)

        with self._session_factory() as session:

            session.execute(text(f"SET lock_timeout = {LOCK_TIMEOUT_MS}"))
            session.execute(text("SELECT pg_advisory_lock(:key)"), {"key": key})
            session.commit()

            try:
                yield

            finally:
                session.execute(text("SELECT pg_advisory_unlock(:key)"), {"key": key})
                session.commit()


    def touch_checked_at(self, video_id: str) -> datetime:
        """Record that freshness was verified without rebuilding the index."""

        checked_at = datetime.now(UTC)

        with self._session_factory() as session:

            record = session.get(VideoIndexRecord, video_id)
            record.last_checked_at = checked_at

            session.commit()

        return checked_at


    def mark_failed(self, video_id: str, error: str) -> None:
        """
        Record a failed indexing attempt.

        Deliberately leaves transcript_hash, indexed_at and last_checked_at
        alone: any previously indexed data is still valid and still searchable,
        and an untouched last_checked_at means the next request retries.
        """

        with self._session_factory() as session:

            record = session.get(VideoIndexRecord, video_id)
            record.status = "failed"
            record.last_error = error

            session.commit()


    def commit_rebuild(self,
                       video_id: str,
                       parents: list[ParentChunk],
                       transcript_hash: str,
                       metadata: VideoMetadata) -> datetime:
        """
        Swap in a freshly built index in one transaction.

        Replacing the parent chunks and marking the video ready together means
        a failure here rolls back to the previous working index rather than
        leaving parents and state disagreeing.
        """

        indexed_at = datetime.now(UTC)

        with self._session_factory() as session:

            session.execute(
                delete(ParentChunkRecord).where(ParentChunkRecord.video_id == video_id)
            )

            session.add_all([
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
            ])

            session.execute(
                insert(VideoIndexRecord)
                .values(video_id=video_id,
                        status="ready",
                        transcript_hash=transcript_hash,
                        indexed_at=indexed_at,
                        last_checked_at=indexed_at,
                        last_error=None)
                .on_conflict_do_update(index_elements=["video_id"],
                                       set_={"status": "ready",
                                             "transcript_hash": transcript_hash,
                                             "indexed_at": indexed_at,
                                             "last_checked_at": indexed_at,
                                             "last_error": None})
            )

            metadata_values = {
                "title": metadata.title,
                "channel": metadata.channel,
                "duration": metadata.duration,
                "language": metadata.language,
                "language_code": metadata.language_code,
                "overview": metadata.overview,
                "metadata_updated_at": indexed_at,
            }

            session.execute(
                insert(VideoMetadataRecord)
                .values(video_id=video_id, **metadata_values)
                .on_conflict_do_update(index_elements=["video_id"],
                                       set_=metadata_values)
            )

            session.commit()

        return indexed_at


    def get_metadata(self, video_id: str) -> VideoMetadata | None:

        with self._session_factory() as session:

            return _to_metadata(session.get(VideoMetadataRecord, video_id))


    def reset_all(self) -> IndexResetCounts:
        """
        Remove every indexed video from PostgreSQL in one transaction.

        Development reset only. It deletes rows from the three tables this
        application owns; schema and migration history are untouched.
        """

        with self._session_factory() as session:

            parent_chunks = session.execute(delete(ParentChunkRecord)).rowcount
            metadata = session.execute(delete(VideoMetadataRecord)).rowcount
            videos = session.execute(delete(VideoIndexRecord)).rowcount

            session.commit()

        return IndexResetCounts(parent_chunks=parent_chunks,
                                videos=videos,
                                metadata=metadata)
