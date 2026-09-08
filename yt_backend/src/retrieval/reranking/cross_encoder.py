from sentence_transformers import CrossEncoder
from src.models.retrieval import RetrievedChunk
from src.retrieval.reranking.base import Reranker

class CrossEncoderReranker(Reranker):

    def __init__(self, model_name: str) -> None:
        self._model = CrossEncoder(model_name)


    def rerank(self,
               query: str,
               results: list[RetrievedChunk],
               limit: int = 5) -> list[RetrievedChunk]:

        if not results:
            return []

        pairs = [(query, result.text) for result in results]

        scores = self._model.predict(pairs)

        scored_results: list[RetrievedChunk] = []

        for result, score in zip(results, scores):

            scored_results.append(
                result.model_copy(
                    update={
                        "score": float(score),
                        "source": "reranker"
                        }
                    ))


        scored_results.sort(
            key=lambda result: result.score,
            reverse=True)

        return scored_results[:limit]