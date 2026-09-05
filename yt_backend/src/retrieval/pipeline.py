class RetrievalPipeline:

    def __init__(self,
                 query_processor,
                 dense_retriever,
                 keyword_retriever,
                 fusion,
                 deduplicator,
                 reranker,
                 confidence_checker,
                 parent_expander):
        
        self._query_processor = query_processor
        self._dense_retriever = dense_retriever
        self._keyword_retriever = keyword_retriever
        self._fusion = fusion
        self._deduplicator = deduplicator
        self._reranker = reranker
        self._confidence_checker = confidence_checker
        self._parent_expander = parent_expander