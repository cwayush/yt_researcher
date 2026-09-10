from src.models.retrieval import RetrievedChunk
from src.retrieval.deduplication.base import Deduplicator


class ExactDeduplicator(Deduplicator):

    def deduplicate(self, results: list[RetrievedChunk]) -> list[RetrievedChunk]:

        seen: set[str] = set()
        unique_results: list[RetrievedChunk] = []

        for result in results:

            if result.chunk_id in seen:
                continue

            seen.add(result.chunk_id)
            unique_results.append(result)

        return unique_results
