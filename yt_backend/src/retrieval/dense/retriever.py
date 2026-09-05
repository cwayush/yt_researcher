class DenseRetriever:

    def __init__(self, vector_store):
        self._vector_store = vector_store

    def retrieve(self, query_vector: list[float], limit: int = 10):

        return self._vector_store.search(vector=query_vector,
                                         limit=limit)