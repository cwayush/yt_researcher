from src.models.context import BuiltContext
from src.models.retrieval import Evidence, RetrievalResponse
from src.generation.base import GenerationProvider


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


    def generate_out_of_scope(self,
                              question: str,
                              video_info: str = "") -> RetrievalResponse:

        answer = self._provider.generate(question=question,
                                         context="",
                                         mode="out_of_scope",
                                         video_info=video_info)

        return RetrievalResponse(answer=answer, evidence=[])