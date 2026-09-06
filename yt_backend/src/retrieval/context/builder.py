from src.models.context import BuiltContext, ContextSource
from src.models.chunks import ParentChunk
from src.models.retrieval import RetrievedChunk


class ContextBuilder:

    def build(self,
              children: list[RetrievedChunk],
              parents: list[ParentChunk]) -> BuiltContext:

        if not parents:
            return BuiltContext(text='', sources=[])

        parent_scores: dict[str, float] = {}

        for child in children:
            current_score = parent_scores.get(child.parent_id)

            if current_score is None or child.score > current_score:
                parent_scores[child.parent_id] = child.score

        unique_parents = { parent.chunk_id: parent  for parent in parents}

        ordered_parents = sorted(unique_parents.values(), key=lambda parent: parent.start)

        context_parts: list[str] = []
        sources: list[ContextSource] = []

        for parent in ordered_parents:

            context_parts.append(f"[{parent.start:.2f}s - {parent.end:.2f}s]\n"
                                 f"{parent.text}")

            sources.append(ContextSource(parent_id=parent.chunk_id,
                                         video_id=parent.video_id,
                                         text=parent.text,
                                         start=parent.start,
                                         end=parent.end,
                                         relevance_score=parent_scores.get(parent.chunk_id, 0.0)
                                         ))

        return BuiltContext(text="\n\n".join(context_parts),
                            sources=sources)