from src.services.embedding_service import EmbeddingService
from src.vectorstore.base import VectorStore


class RetrievalService:

    def __init__(self,
                 embedding_service,
                 retrieval_pipeline):
        
        self._embedding_service = embedding_service
        self._retrieval_pipeline = retrieval_pipeline

    def search(self, query: str):

        query_vector = self._embedding_service.embed_query(query)

        return self._retrieval_pipeline.retrieve(query=query,
                                                 query_vector=query_vector)