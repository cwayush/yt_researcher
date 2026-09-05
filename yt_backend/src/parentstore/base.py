from abc import ABC, abstractmethod
from src.models.chunks import ParentChunk


class ParentStore(ABC):

    @abstractmethod
    def add_parents(self, parents: list[ParentChunk],) -> None:

        raise NotImplementedError


    @abstractmethod
    def get_by_ids(self, ids: list[str]) -> list[ParentChunk]:

        raise NotImplementedError