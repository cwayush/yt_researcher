from src.models.retrieval import RetrievedChunk
from src.vectorstore.base import VectorStore

class DenseRetriever:

    def __init__(self, vector_store: VectorStore) -> None:
        self._vector_store = vector_store

    def retrieve(self, 
                 query_vector: list[float], 
                 video_id: str, 
                 limit: int = 10) -> list[RetrievedChunk]:

        results = self._vector_store.search(vector=query_vector,
                                            video_id=video_id,
                                            limit=limit)

        return [
            RetrievedChunk(
                chunk_id=result.payload["chunk_id"],
                parent_id=result.payload["parent_id"],
                video_id=result.payload["video_id"],
                text=result.payload["text"],
                score=result.score,
                start=result.payload["start"],
                end=result.payload["end"],
                sentence_indices=result.payload["sentence_indices"],
                token_count=result.payload["token_count"],
            )
            for result in results.points
        ]