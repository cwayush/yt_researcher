from src.retrieval.dense.retriever import DenseRetriever
from src.retrieval.parent.expander import ParentExpander
from src.retrieval.context.builder import ContextBuilder

class RetrievalPipeline:

    def __init__(self,
                 dense_retriever: DenseRetriever,
                 parent_expander: ParentExpander,
                 context_builder: ContextBuilder):
        
        self._dense_retriever = dense_retriever
        self._parent_expander = parent_expander
        self._context_builder = context_builder

    def run(self,
            video_id: str,
            query_vector: list[float],
            limit: int = 5):

        children = self._dense_retriever.retrieve(video_id=video_id,
                                                  query_vector=query_vector,
                                                  limit=limit)

        parents = self._parent_expander.expand(children)

        context = self._context_builder.build(children=children,
                                              parents=parents)

        return context

