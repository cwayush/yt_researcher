from src.retrieval.dense.retriever import DenseRetriever
from src.retrieval.keyword.bm25 import KeywordRetriever
from src.retrieval.fusion.rrf import RRFFusion
from src.retrieval.deduplication.deduplicator import ExactDeduplicator
from src.retrieval.parent.expander import ParentExpander
from src.retrieval.context.builder import ContextBuilder
from src.retrieval.reranking.base import Reranker 
from src.retrieval.confidence.base import ConfidenceChecker
from src.models.retrieval import RetrievalResult

class RetrievalPipeline:

    def __init__(self,
                 dense_retriever: DenseRetriever,
                 keyword_retriever: KeywordRetriever,
                 rrf_fusion: RRFFusion,
                 deduplicator: ExactDeduplicator,
                 reranker: Reranker,
                 confidence_checker: ConfidenceChecker,
                 parent_expander: ParentExpander,
                 context_builder: ContextBuilder):
        
        self._dense_retriever = dense_retriever
        self._keyword_retriever = keyword_retriever
        self._rrf_fusion = rrf_fusion
        self._deduplicator = deduplicator
        self._reranker = reranker
        self._confidence_checker = confidence_checker
        self._parent_expander = parent_expander
        self._context_builder = context_builder

    def run(self,
            video_id: str,
            query: str,
            query_vector: list[float],
            limit: int = 5) -> RetrievalResult:

        dense_results = self._dense_retriever.retrieve(video_id=video_id,
                                                  query_vector=query_vector,
                                                  limit=limit)

        keyword_results = self._keyword_retriever.retrieve(video_id=video_id,
                                                           query=query,
                                                           limit=limit)

        fused_results = self._rrf_fusion.fuse([dense_results, keyword_results], limit=limit)

        deduplicated_results = self._deduplicator.deduplicate(fused_results)

        reranked_results = self._reranker.rerank(query=query,
                                                 results=deduplicated_results,
                                                 limit=limit)

        is_confident = self._confidence_checker.check(query=query,
                                                      results=reranked_results,)

        if not is_confident:
            return RetrievalResult(context=None, confident=False)
    
        parents = self._parent_expander.expand(reranked_results)

        context = self._context_builder.build(children=reranked_results,
                                              parents=parents)
        
        # print("\n=== DENSE RESULTS ===")
        # for result in dense_results:
        #     print(
        #         f"chunk={result.chunk_id} "
        #         f"score={result.score:.4f} "
        #     )

        # print("\n=== BM25 RESULTS ===")
        # for result in keyword_results:
        #     print(
        #         f"chunk={result.chunk_id} "
        #         f"score={result.score:.4f} "
        #     )

        # print("\n=== RRF RESULTS ===")
        # for rank, result in enumerate(fused_results, start=1):
        #     print(
        #         f"{rank}. "
        #         f"chunk={result.chunk_id} "
        #         f"rrf_score={result.score:.6f}"
        #     )

        # print("\n=== RRF RESULTS ===")

        # for rank, result in enumerate(fused_results, start=1):
        #     print(
        #         f"\nRank {rank}"
        #         f"\n  Chunk ID : {result.chunk_id}"
        #         f"\n  Parent ID: {result.parent_id}"
        #         f"\n  RRF Score: {result.score:.6f}"
        #         f"\n  Time     : {result.start:.2f}s → {result.end:.2f}s"
        #         f"\n  Source   : {result.source}"
        #         f"\n  Text     : {result.text[:200]}..."
        #     )

        return RetrievalResult(context=context, confident=True)

