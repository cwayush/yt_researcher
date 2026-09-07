from abc import ABC, abstractmethod
from src.models.retrieval import RetrievedChunk

class KeywordRetriever(ABC):

    @abstractmethod
    def retrieve(self, 
               query: str, 
               video_id: str, 
               limit: int) -> list[RetrievedChunk]:

        raise NotImplementedError