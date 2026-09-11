"""
ResetService — development-only reset of every store this application owns.

Clears the PostgreSQL indexing tables, the points in the Qdrant collection and
the in-memory BM25 cache, so the next /index request runs the first-time path
for every video.
"""

import logging
from collections.abc import Callable

from src.api.exceptions import ResetFailed
from src.indexstate.postgres import PostgresIndexStateStore
from src.models.reset import ResetResponse
from src.retrieval.keyword.bm25 import BM25Retriever
from src.vectorstore.base import VectorStore

logger = logging.getLogger(__name__)


class ResetService:
    """
    Coordinates the reset across PostgreSQL, Qdrant and the BM25 cache.

    Dependencies are injected so tests can drive the same orchestration
    without touching a live store.
    """

    def __init__(self,
                 index_state: PostgresIndexStateStore,
                 vector_store: VectorStore,
                 keyword_retriever: BM25Retriever) -> None:

        self._index_state = index_state
        self._vector_store = vector_store
        self._keyword_retriever = keyword_retriever


    def reset(self) -> ResetResponse:
        """
        Remove all indexed application data.

        Raises:
            ResetFailed: if any store could not be cleared, naming the stage
                that failed and the stages that had already completed.
        """

        completed: list[str] = []

        counts = self._stage("postgresql", completed, self._index_state.reset_all)
        deleted_vectors = self._stage("qdrant", completed, self._vector_store.delete_all)

        self._stage("bm25", completed, self._keyword_retriever.clear)

        logger.info("Reset removed %d parent chunks, %d videos and %d vectors.",
                    counts.parent_chunks, counts.videos, deleted_vectors)

        return ResetResponse(reset=True,
                             deleted_parent_chunks=counts.parent_chunks,
                             deleted_videos=counts.videos,
                             deleted_metadata=counts.metadata,
                             deleted_vectors=deleted_vectors,
                             cleared_bm25_cache=True,
                             message="Application data reset successfully.")


    def _stage(self, name: str, completed: list[str], operation: Callable):
        """Run one store's reset, turning any failure into ResetFailed."""

        try:
            result = operation()

        except Exception as exc:
            logger.exception("Reset failed while clearing %s.", name)

            raise ResetFailed(stage=name,
                              reason=str(exc),
                              completed=list(completed)) from exc

        completed.append(name)

        return result
