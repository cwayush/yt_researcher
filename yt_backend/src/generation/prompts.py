from langchain_core.prompts import ChatPromptTemplate


GROUNDED_QA_PROMPT = ChatPromptTemplate.from_messages(
    [(
            "system",
            """You are answering a question using only the provided
                YouTube transcript context.

                If the answer cannot be found in the context,
                say that the information is not available in the
                provided transcript.

                Do not invent facts."""
                ),
        (
            "human",
            """
            Question: {question}

            Transcript context: {context}

            Answer:
            """
        )])