from abc import ABC, abstractmethod
from src.models.retrieval import RetrievedChunk


class Reranker(ABC):

    @abstractmethod
    def rerank(self,
               query: str,
               results: list[RetrievedChunk],
               limit: int = 5,) -> list[RetrievedChunk]:

        raise NotImplementedError