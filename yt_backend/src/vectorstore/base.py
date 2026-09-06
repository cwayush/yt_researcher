from abc import ABC, abstractmethod
from src.models.embedding import EmbeddedChunk
from src.models.vectorstore import VectorStoreResult


class VectorStore(ABC):

    @abstractmethod
    def add_chunks(self,
                   chunks: list[EmbeddedChunk]) -> VectorStoreResult:

        raise NotImplementedError


    @abstractmethod
    def search(self,
               vector: list[float],
               video_id: str,
               limit: int = 5):
        
        raise NotImplementedError