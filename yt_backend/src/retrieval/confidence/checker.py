from src.models.retrieval import RetrievedChunk
from src.retrieval.confidence.base import ConfidenceChecker


class RerankerConfidenceChecker(ConfidenceChecker):
    """
    Decides whether reranked results are strong enough to answer from.

    Requires both a top result above `min_score` and at least
    `min_support_res` results clearing that same bar, so a single
    borderline chunk cannot carry an answer on its own.
    """

    def __init__(self,
                 min_score: float,
                 min_support_res: int = 1) -> None:

        self._min_score = min_score
        self._min_support_res = min_support_res


    def check(self,
              query: str,
              results: list[RetrievedChunk]) -> bool:

        if not results:
            return False

        if results[0].score < self._min_score:
            return False

        supporting = sum(result.score >= self._min_score
                         for result in results)

        return supporting >= self._min_support_res
