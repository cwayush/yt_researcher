from src.chunking.child import ChildChunker
from src.chunking.hierarchical import HierarchicalChunker
from src.chunking.parent import ParentChunker
from src.chunking.tokenizer import Tokenizer
from src.models.chunks import HierarchicalChunks
from src.models.transcript import Sentence

class ChunkingService:
    """
    Application serivce responsible for hierarchical transcript chunking.

    This service done not know anything about FastAPI, HTTP requests, database or embeddings.
    """

    def __init__(self,
                 chunker: HierarchicalChunker | None = None) -> None:

        if chunker is not None:
            self._chunker = chunker
            return

        tokenizer = Tokenizer()

        parent_chunker = ParentChunker(tokenizer=tokenizer,
                                       min_tokens=600,
                                       max_tokens=1200)

        child_chunker = ChildChunker(tokenizer=tokenizer,
                                     min_tokens=300,
                                     max_tokens=600,
                                     overlap_sentences=1)

        self._chunker = HierarchicalChunker(parent_chunker=parent_chunker,
                                            child_chunker=child_chunker)


    def create_chunks(self,
                      sentences: list[Sentence],
                      video_id: str) -> HierarchicalChunks:

        return self._chunker.chunk(sentences=sentences,
                                   video_id=video_id)
