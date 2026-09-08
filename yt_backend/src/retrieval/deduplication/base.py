from abc import ABC, abstractmethod
from src.models.retrieval import RetrievedChunk


class Deduplicator(ABC):

    @abstractmethod
    def deduplicate(self, results: list[RetrievedChunk]) -> list[RetrievedChunk]:

        raise NotImplementedError