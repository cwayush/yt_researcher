from src.models.retrieval import RetrievedChunk
from src.retrieval.confidence.base import ConfidenceChecker

class RerankerConfidenceChecker(ConfidenceChecker):

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

        top_score = results[0].score

        if top_score < self._min_score:
            return False

        results = sum(result.score >= self._min_score 
                          for result in results)

        return results >= self._min_support_res