from src.models.chunks import ParentChunk
from src.models.context import BuiltContext
from src.models.retrieval import Evidence, RetrievalResponse
from src.generation.base import GenerationProvider

OVERVIEW_TOKEN_BUDGET = 6000


class GenerationService:

    def __init__(self, provider: GenerationProvider) -> None:
        self._provider = provider


    def generate(self, question: str, context: BuiltContext) -> RetrievalResponse:

        answer = self._provider.generate(question=question,
                                         context=context.text,
                                         mode="grounded")

        evidence = [Evidence(start=source.start,
                             end=source.end,
                             text=source.text,
                             relevance_score=source.relevance_score)

                             for source in context.sources]

        return RetrievalResponse(answer=answer, evidence=evidence)


    def generate_overview(self, parents: list[ParentChunk]) -> str:
        """
        Summarise a video from its parent chunks.
        Called once per indexing run, never per query.
        """

        selected: list[str] = []
        used_tokens = 0

        for parent in parents:

            if selected and used_tokens + parent.token_count > OVERVIEW_TOKEN_BUDGET:
                break

            selected.append(parent.text)
            used_tokens += parent.token_count

        return self._provider.generate(question="",
                                       context="\n\n".join(selected),
                                       mode="overview")


    def generate_out_of_scope(self,
                              question: str,
                              video_info: str = "") -> RetrievalResponse:

        answer = self._provider.generate(question=question,
                                         context="",
                                         mode="out_of_scope",
                                         video_info=video_info)

        return RetrievalResponse(answer=answer, evidence=[])