from src.retrieval.dense.retriever import DenseRetriever
from src.retrieval.keyword.base import KeywordRetriever
from src.retrieval.fusion.base import ResultFusion
from src.retrieval.deduplication.base import Deduplicator
from src.retrieval.parent.expander import ParentExpander
from src.retrieval.context.builder import ContextBuilder
from src.retrieval.reranking.base import Reranker
from src.retrieval.confidence.base import ConfidenceChecker
from src.models.retrieval import RetrievalResult


class RetrievalPipeline:
    """
    Hybrid retrieval pipeline.

    Stages:
        dense + keyword search → RRF fusion → deduplication → reranking
        → confidence gate → parent expansion → context building

    Two limits control the funnel. `candidate_limit` is how many chunks each
    retriever contributes before fusion - it must be comfortably larger than
    the final count, or the reranker has nothing to choose between.
    `final_limit` is how many reranked chunks survive into the context.

    The confidence gate short-circuits the pipeline: when the reranker finds
    no sufficiently relevant chunk, no context is built and the caller is
    expected to answer out of scope.
    """

    def __init__(self,
                 dense_retriever: DenseRetriever,
                 keyword_retriever: KeywordRetriever,
                 rrf_fusion: ResultFusion,
                 deduplicator: Deduplicator,
                 reranker: Reranker,
                 confidence_checker: ConfidenceChecker,
                 parent_expander: ParentExpander,
                 context_builder: ContextBuilder,
                 candidate_limit: int,
                 final_limit: int):

        self._dense_retriever = dense_retriever
        self._keyword_retriever = keyword_retriever
        self._rrf_fusion = rrf_fusion
        self._deduplicator = deduplicator
        self._reranker = reranker
        self._confidence_checker = confidence_checker
        self._parent_expander = parent_expander
        self._context_builder = context_builder
        self._candidate_limit = candidate_limit
        self._final_limit = final_limit

    def run(self,
            video_id: str,
            query: str,
            query_vector: list[float]) -> RetrievalResult:

        dense_results = self._dense_retriever.retrieve(video_id=video_id,
                                                       query_vector=query_vector,
                                                       limit=self._candidate_limit)

        keyword_results = self._keyword_retriever.retrieve(video_id=video_id,
                                                           query=query,
                                                           limit=self._candidate_limit)

        fused_results = self._rrf_fusion.fuse([dense_results, keyword_results],
                                              limit=self._candidate_limit)

        deduplicated_results = self._deduplicator.deduplicate(fused_results)

        reranked_results = self._reranker.rerank(query=query,
                                                 results=deduplicated_results,
                                                 limit=self._final_limit)

        is_confident = self._confidence_checker.check(query=query,
                                                      results=reranked_results,)

        if not is_confident:
            return RetrievalResult(context=None, confident=False)

        parents = self._parent_expander.expand(reranked_results)

        context = self._context_builder.build(children=reranked_results,
                                              parents=parents)

        return RetrievalResult(context=context, confident=True)
