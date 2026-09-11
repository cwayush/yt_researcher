from src.models.context import BuiltContext
from src.models.chunks import ParentChunk


class ContextBuilder:

    def build(self, parents: list[ParentChunk]) -> BuiltContext:

        if not parents:
            return BuiltContext(text='')

        unique_parents = { parent.chunk_id: parent  for parent in parents}

        ordered_parents = sorted(unique_parents.values(), key=lambda parent: parent.start)

        context_parts: list[str] = []

        for parent in ordered_parents:

            context_parts.append(f"[{parent.start:.2f}s - {parent.end:.2f}s]\n"
                                 f"{parent.text}")

        return BuiltContext(text="\n\n".join(context_parts))
