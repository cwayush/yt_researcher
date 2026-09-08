from abc import ABC, abstractmethod
from src.models.retrieval import RetrievedChunk


class ConfidenceChecker(ABC):

    @abstractmethod
    def check(self,
              query: str,
              results: list[RetrievedChunk]) -> bool:

        raise NotImplementedError