from langchain_groq import ChatGroq
from src.generation.base import GenerationProvider
from src.generation.prompts import GROUNDED_QA_PROMPT


class GroqGenerationProvider(GenerationProvider):

    def __init__(self, api_key: str, model: str) -> None:

        self._client = ChatGroq(api_key=api_key,model=model)

    def generate(self, question: str, context: str) -> str:

        messages = GROUNDED_QA_PROMPT.format_messages(
                    question=question,
                    context=context,
                )

        response = self._client.invoke(messages)

        return response.content or ""