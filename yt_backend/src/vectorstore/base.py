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


    @abstractmethod
    def get_chunks(self, video_id: str):

        raise NotImplementedError


    @abstractmethod
    def delete_stale(self,
                     video_id: str,
                     keep_chunk_ids: list[str]) -> None:

        raise NotImplementedError


    @abstractmethod
    def delete_all(self) -> int:

        raise NotImplementedError