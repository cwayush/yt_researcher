from src.models.retrieval import RetrievalResponse
from src.embeddings.service import EmbeddingService
from src.retrieval.pipeline import RetrievalPipeline
from src.services.generation import GenerationService


class RetrievalService:
    """
    Application service that answers a question about one indexed video.

    Embeds the question, runs the hybrid retrieval pipeline, and hands the
    resulting context to the generation service. When the pipeline reports
    low confidence there is no grounded context to answer from, so the
    question is answered as out of scope instead.
    """

    def __init__(self,
                 embedding_service: EmbeddingService,
                 retrieval_pipeline: RetrievalPipeline,
                 generation_service: GenerationService) -> None:

        self._embedding_service = embedding_service
        self._retrieval_pipeline = retrieval_pipeline
        self._generation_service = generation_service


    def query(self, video_id: str, question: str) -> RetrievalResponse:

        # 1. Convert the question into a query embedding
        query_vector = self._embedding_service.embed_query(question)

        # 2. Retrieve grounded context for the question
        result = self._retrieval_pipeline.run(video_id=video_id,
                                              query=question,
                                              query_vector=query_vector)

        # 3. Generate the answer from that context, or decline if there is none
        if not result.confident or result.context is None:
            return self._generation_service.generate_out_of_scope(question=question,
                                                                  video_info="")

        return self._generation_service.generate(question=question,
                                                 context=result.context)
