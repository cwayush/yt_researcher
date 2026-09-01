from src.chunking.base import Chunker
from src.chunking.tokenizer import Tokenizer
from src.models.chunks import ChildChunk, ParentChunk
from src.models.transcript import Sentence


class ChildChunker(Chunker[ChildChunk]):
    """
    Splits each parent into smaller sentence-aware retrieval chunks.

    Child chunks are the units that will later be embedded.
    """

    def __init__(
        self,
        tokenizer: Tokenizer,
        min_tokens: int = 300,
        max_tokens: int = 600,
        overlap_sentences: int = 1,
    ) -> None:

        if min_tokens <= 0:
            raise ValueError(
                "min_tokens must be greater than 0"
            )

        if max_tokens < min_tokens:
            raise ValueError(
                "max_tokens must be >= min_tokens"
            )

        if overlap_sentences < 0:
            raise ValueError(
                "overlap_sentences cannot be negative"
            )

        self._tokenizer = tokenizer
        self._min_tokens = min_tokens
        self._max_tokens = max_tokens
        self._overlap_sentences = overlap_sentences


    def _build_child(self,
                     parent:ParentChunk,
                     sentences: list[Sentence],
                     token_count: int,
                     index: int
                     ) -> ChildChunk:

        return ChildChunk(
                chunk_id=f"{parent.chunk_id}_c_{index:04d}",
                parent_id=parent.chunk_id,
                video_id=parent.video_id,
                text=" ".join(sentence.text for sentence in sentences),
                start=sentences[0].start,
                end=sentences[-1].end,
                index=index,
                sentence_indices=[sentence.index for sentence in sentences],
                token_count=token_count,
            )


    def chunk(
        self,
        parent: ParentChunk,
        sentences: list[Sentence],
    ) -> list[ChildChunk]:

        if not sentences:
            return []

        children: list[ChildChunk] = []

        current: list[Sentence] = []
        current_tokens = 0

        child_index = 0

        for sentence in sentences:

            sentence_tokens = self._tokenizer.count(sentence.text)

            projected_tokens = current_tokens + sentence_tokens

            if current and projected_tokens > self._max_tokens:

                children.append(
                    self._build_child(
                        parent=parent,
                        sentences=current,
                        token_count=current_tokens,
                        index=child_index,
                    )
                )

                child_index += 1

                # Sentence overlap.
                if self._overlap_sentences > 0:
                    current = current[-self._overlap_sentences]

                    current_tokens = sum(self._tokenizer.count(item.text) for item in current)

                else:
                    current = []
                    current_tokens = 0

            current.append(sentence)
            current_tokens += sentence_tokens

        if current:
            children.append(
                self._build_child(
                    parent=parent,
                    sentences=current,
                    token_count=current_tokens,
                    index=child_index
                )
            )

        return children

    

    
