from src.chunking.child import ChildChunker
from src.chunking.parent import ParentChunker
from src.models.chunks import HierarchicalChunks
from src.models.transcript import Sentence

class HierarchicalChunker:
    """
    Creates parent and child chunks while preserving
    sentence and timestamp lineage.
    """

    def __init__(self,
                 parent_chunker:ParentChunker,
                 child_chunker:ChildChunker) -> None:

        self._parent_chunker = parent_chunker
        self._child_chunker = child_chunker

    def chunk(self,
              sentences: list[Sentence],
              video_id: str) -> HierarchicalChunks:

        if not sentences:
            return HierarchicalChunks()

        parents = self._parent_chunker.chunk(sentences=sentences,video_id=video_id)

        all_childern = []

        for parent in parents:
            parent_sentences = [
                sentence 
                for sentence in sentences 
                if sentence.index in parent.sentence_indices]

            childern = self._child_chunker.chunk(
                parent=parent,
                sentences=parent_sentences
            )

            all_childern.extend(childern)

        return HierarchicalChunks(
            parents=parents,
            children=all_childern
        )