from langchain_groq import ChatGroq
from src.generation.base import GenerationProvider
from src.generation.prompts import GROUNDED_QA_PROMPT, OUT_OF_SCOPE_PROMPT


class GroqGenerationProvider(GenerationProvider):

    def __init__(self, api_key: str, model: str) -> None:

        self._client = ChatGroq(api_key=api_key,model=model)


    def generate(self, 
                 question: str, 
                 context: str,
                 mode: str = "grounded",
                 video_info: str = "") -> str:

        if mode == "out_of_scope":

            messages = OUT_OF_SCOPE_PROMPT.format_messages(
                question=question,
                video_info=video_info,
            )

        else:

            messages = GROUNDED_QA_PROMPT.format_messages(
                        question=question,
                        context=context,
                    )

        response = self._client.invoke(messages)

        return response.content or ""