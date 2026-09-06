from langchain_google_genai import ChatGoogleGenerativeAI
from src.generation.base import GenerationProvider
from src.generation.prompts import GROUNDED_QA_PROMPT

class GeminiGenerationProvider(GenerationProvider):

    def __init__(self, api_key: str, model: str) -> None:

        self._client = ChatGoogleGenerativeAI(api_key=api_key,model=model)


    def generate(self, question: str, context: str) -> str:

        messages = GROUNDED_QA_PROMPT.format_messages(
            question=question,
            context=context,
        )

        response = self._client.invoke(messages)

        return response.content or ""