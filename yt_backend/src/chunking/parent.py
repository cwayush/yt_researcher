from src.chunking.base import Chunker
from src.chunking.tokenizer import Tokenizer
from src.models.chunks import ParentChunk
from src.models.transcript import Sentence

class ParentChunker(Chunker[ParentChunk]):
    """
    Creates large, sentence-aware parent chunks.

    Parent chunks provide broader context for the LLM.
    """

    def __init__(self,
                 tokenizer:Tokenizer,
                 max_tokens:int = 1200
        ) -> None:

        if max_tokens <= 0:
            raise ValueError("Max Tokens must be greater than 0")

        self._tokenizer = tokenizer
        self._max_tokens = max_tokens

    def _build_parent(
            self,
            sentences: list[Sentence],
            token_count: int,
            index: int,
            video_id: str,
        ) -> ParentChunk:

        return ParentChunk(
            chunk_id=f"{video_id}_p_{index:04d}", 
            video_id=video_id, 
            text=" ".join(sentence.text for sentence in sentences),
            start=sentences[0].start,
            end=sentences[-1].end,
            index=index,
            sentence_indices = [sentence.index for sentence in sentences],
            token_count=token_count
            )

    def chunk(
            self,
            sentences: list[Sentence],
            video_id: str
        ) -> list[ParentChunk]:

        if not sentences:
            return []

        parents: list[ParentChunk] = []

        current_sentences: list[Sentence] = []
        current_tokens = 0
        parent_index = 0

        for sentence in sentences:
            sentence_tokens = self._tokenizer.count(sentence.text)

            projected_tokens = (current_tokens + sentence_tokens)

            # If adding this sentence would exceed
            # the maximum, finalize the current parent
            if current_sentences and projected_tokens > self._max_tokens:
                parents.append(
                    self._build_parent(
                        current_sentences,
                        current_tokens,
                        parent_index,
                        video_id
                    )
                )

                parent_index += 1

                current_tokens = 0
                current_sentences = []

            current_sentences.append(sentence)
            current_tokens += sentence_tokens

        # Flush remaining sentences.
        if current_sentences:
            parents.append(
                self._build_parent(
                    current_sentences,
                    current_tokens,
                    parent_index,
                    video_id
                )
            )

        return parents