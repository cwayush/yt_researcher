from google import genai
from google.genai import types
from src.embeddings.base import EmbeddingProvider

class GoogleEmbeddingProvider(EmbeddingProvider):
    """
    Google gemini embedding implementation.

    This class is responsible only for communicating with Google embedding API.
    """

    def __init__(self,
                 api_key: str,
                 model: str = 'gemini-embedding-001',
                 output_dimensionality: int = 768) -> None:

        self._client = genai.Client(api_key=api_key)
        self._model = model
        self._output_dimensionality = output_dimensionality


    def embed_document(self, text: str) -> list[float]:

        result = self._client.models.embed_content(model = self._model,
                                                   contents = text,
                                                   config = types.EmbedContentConfig(
                                                       task_type= "RETRIEVAL_DOCUMENT",
                                                       output_dimensionality=self._output_dimensionality
                                                   ))

        return result.embeddings[0].values


    def embed_documents(self,
                        texts: list[str]) -> list[list[float]]:

        if not texts:
            return []

        result = self._client.models.embed_content(model=self._model,
                                                   contents=texts,
                                                   config=types.EmbedContentConfig(
                                                        task_type="RETRIEVAL_DOCUMENT",
                                                        output_dimensionality=self._output_dimensionality,
                                                    ))

        return [embedding.values for embedding in result.embeddings]


    def embed_query(self, text: str) -> list[float]:

        result = self._client.models.embed_content(model=self._model,
                                                   contents=text,
                                                   config=types.EmbedContentConfig(
                                                        task_type="RETRIEVAL_QUERY",
                                                        output_dimensionality=self._output_dimensionality,
                                                    ))

        return result.embeddings[0].values