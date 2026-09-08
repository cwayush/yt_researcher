from abc import ABC, abstractmethod
from src.models.retrieval import RetrievedChunk

class ResultFusion(ABC):

    @abstractmethod
    def fuse(self, 
             result_lists: list[list[RetrievedChunk]],
             limit: int = 5) -> list[RetrievedChunk]:

        raise NotImplementedError