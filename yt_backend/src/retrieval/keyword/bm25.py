import re
from rank_bm25 import BM25Okapi
from src.vectorstore.base import VectorStore
from src.models.retrieval import RetrievedChunk
from src.retrieval.keyword.base import KeywordRetriever

class BM25Retriever(KeywordRetriever):

    def __init__(self, vector_store: VectorStore) -> None:

        self._vector_store = vector_store
        self._indexes: dict[str, BM25Okapi] = {}
        self._documents: dict[str, list[RetrievedChunk]] = {}


    def invalidate(self, video_id: str) -> None:
        self._indexes.pop(video_id, None)
        self._documents.pop(video_id, None)


    def clear(self) -> None:
        """Drop every cached keyword index, not just one video's."""
        self._indexes.clear()
        self._documents.clear()


    @staticmethod
    def _tokenize(text: str) -> list[str]:
        return re.findall(r"\b[\w-]+\b", text.lower())


    def _get_index(self, video_id: str) -> tuple[BM25Okapi, list[RetrievedChunk]]:

        if video_id not in self._indexes:

            chunks = self._vector_store.get_chunks(video_id)

            tokenized_docs = [self._tokenize(chunk.text) for chunk in chunks]

            self._indexes[video_id] = BM25Okapi(tokenized_docs)

            self._documents[video_id] = chunks

        return (self._indexes[video_id], self._documents[video_id])


    def retrieve(self, 
                 query: str, 
                 video_id: str, 
                 limit: int = 5) -> list[RetrievedChunk]:

        query_tokens = self._tokenize(query)

        if not query_tokens:
            return []

        bm25, chunks = self._get_index(video_id)

        scores = bm25.get_scores(query_tokens)

        ranked_indexes = sorted(range(len(scores)),
                               key=lambda index: scores[index],
                               reverse=True)

        results: list[RetrievedChunk] = []

        for index in ranked_indexes:

            score = float(scores[index])

            if score <= 0:
                continue

            chunk = chunks[index]

            results.append(
                chunk.model_copy(
                    update={
                        "score": score,
                        "source": "bm25"
                    }
                )
            )

            if len(results) >= limit:
                break

        return results
