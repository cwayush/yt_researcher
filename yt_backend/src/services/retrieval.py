from src.models.retrieval import RetrievalResponse
from src.embeddings.service import EmbeddingService
from src.retrieval.pipeline import RetrievalPipeline
from src.services.generation import GenerationService


class RetrievalService:

    def __init__(self, 
                 embedding_service: EmbeddingService,
                 retrieval_pipeline: RetrievalPipeline,
                 generation_service: GenerationService) -> None:

        self._embedding_service = embedding_service
        self._retrieval_pipeline = retrieval_pipeline
        self._generation_service = generation_service


    def query(self, video_id: str, question: str, limit: int = 5) -> RetrievalResponse:

        # 1. Convert question into embedding
        query_vector = self._embedding_service.embed_query(question)

        # 2. Call the retrievalpipline and get context before llm process
        context  = self._retrieval_pipeline.run(video_id=video_id,
                                                query=question,
                                                query_vector=query_vector,
                                                limit=limit)

        # 3. Process that context with llm model for refining
        if not context.confident:

            return self._generation_service.generate_out_of_scope(
                question=question,
                video_info="")

        if context.context is None:
            return self._generation_service.generate_out_of_scope(
                question=question,
                video_info="",
            )
        
        return self._generation_service.generate(
            question=question, 
            context=context.context)
