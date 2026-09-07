from src.retrieval.dense.retriever import DenseRetriever
from src.retrieval.keyword.bm25 import KeywordRetriever
from src.retrieval.parent.expander import ParentExpander
from src.retrieval.context.builder import ContextBuilder

class RetrievalPipeline:

    def __init__(self,
                 dense_retriever: DenseRetriever,
                 keyword_retriever: KeywordRetriever,
                 parent_expander: ParentExpander,
                 context_builder: ContextBuilder):
        
        self._dense_retriever = dense_retriever
        self._keyword_retriever = keyword_retriever
        self._parent_expander = parent_expander
        self._context_builder = context_builder

    def run(self,
            video_id: str,
            query: str,
            query_vector: list[float],
            limit: int = 5):

        dense_results = self._dense_retriever.retrieve(video_id=video_id,
                                                  query_vector=query_vector,
                                                  limit=limit)

        keyword_results = self._keyword_retriever.retrieve(video_id=video_id,
                                                           query=query,
                                                           limit=limit)

        parents = self._parent_expander.expand(dense_results)

        context = self._context_builder.build(children=dense_results,
                                              parents=parents)
        
        print("\n=== DENSE RESULTS ===")
        for result in dense_results:
            print(
                f"chunk={result.chunk_id} "
                f"score={result.score:.4f} "
            )

        print("\n=== BM25 RESULTS ===")
        for result in keyword_results:
            print(
                f"chunk={result.chunk_id} "
                f"score={result.score:.4f} "
            )

        return context

