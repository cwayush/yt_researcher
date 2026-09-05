from src.embeddings.base import EmbeddingProvider
from src.models.chunks import ChildChunk
from src.models.embeddings import EmbeddedChunk

class EmbeddingService:
    """
    Application service responsible for converting child chunks 
    into embedded chunks.
    """

    def __init__(self,
                 provider: EmbeddingProvider) -> None:

        self._provider = provider


    def embed_children(self,
                       children: list[ChildChunk]) -> list[EmbeddedChunk]:

        if not children:
            return []

        texts = [child.text for child in children]

        vectors = self._provider.embed_documents(texts)

        if len(vectors) != len(children):
            raise ValueError("Embedding count does not match child chunk count.")

        return [EmbeddedChunk(chunk_id=child.chunk_id,
                              parent_id=child.parent_id,
                              video_id=child.video_id,
                              text=child.text,
                              vector=vector,
                              start=child.start,
                              end=child.end,
                              sentence_indices=child.sentence_indices,
                              token_count=child.token_count)
                               
                        for child, vector in zip(children, vectors)]


    def embed_query(self, query: str) -> list[float]:

        return self._provider.embed_query(query)