from abc import ABC, abstractmethod


class GenerationProvider(ABC):

    @abstractmethod
    def generate(self, 
                 question: str, 
                 context: str, 
                 mode: str = "grounded", 
                 video_info: str = "") -> str:
        
        raise NotImplementedError