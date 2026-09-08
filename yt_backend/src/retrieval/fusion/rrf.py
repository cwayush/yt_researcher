from collections import defaultdict
from src.models.retrieval import RetrievedChunk
from src.retrieval.fusion.base import ResultFusion


class RRFFusion(ResultFusion):

    def __init__(self, k: int = 60) -> None:
        self._k = k


    def fuse(self,
             result_lists: list[list[RetrievedChunk]],
             limit: int= 5) -> list[RetrievedChunk]:

        scores = defaultdict(float)
        chunks: dict[str, RetrievedChunk] = {}

        for results in result_lists:

            for rank, chunk in enumerate(results, start=1):

                scores[chunk.chunk_id] += (1 / (self._k + rank))

                chunks[chunk.chunk_id] = chunk

        ranked_ids = sorted(scores, key=scores.get, reverse=True)

        fused_results: list[RetrievedChunk] = []

        for chunk_id in ranked_ids[:limit]:

            chunk = chunks[chunk_id]

            fused_results.append(
                chunk.model_copy(
                    update={
                        "score": scores[chunk_id],
                        "source": "rrf"
                    }
                )
            )

        return fused_results