from abc import ABC, abstractmethod
from typing import Generic, TypeVar

T = TypeVar("T")

class Chunker(ABC, Generic[T]):
    """
    Base interface for chunking strategies.

    Concrete chunkers implement the chunk() method.
    """

    @abstractmethod
    def chunk(self, *args, **kwargs) -> list[T]:
        """
        Convert input data into chunks.
        """
        raise NotImplementedError