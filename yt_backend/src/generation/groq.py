from langchain_groq import ChatGroq
from src.generation.base import GenerationProvider


class GroqGenerationProvider(GenerationProvider):

    def __init__(self, api_key: str, model: str) -> None:

        self._client = ChatGroq(api_key=api_key,model=model)

    def generate(self, question: str, context: str) -> str:

        prompt = f"""
                    You are answering a question using only the provided
                    YouTube transcript context.

                    If the answer cannot be found in the context,
                    say that the information is not available in the
                    provided transcript.

                    Do not invent facts.

                    Question:
                    {question}

                    Transcript context:
                    {context}

                    Answer:
                """

        response = self._client.invoke(prompt)

        return response.content or ""