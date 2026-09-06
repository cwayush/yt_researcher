from abc import ABC, abstractmethod


class GenerationProvider(ABC):

    @abstractmethod
    def generate(self, question: str, context: str) -> str:
        raise NotImplementedError