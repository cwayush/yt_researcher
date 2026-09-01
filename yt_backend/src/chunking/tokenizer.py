import tiktoken

class Tokenizer:
    """
    Token counting utility.

    Keeps tokenizer-specific logic out of the chunking algorithms.
    """

    def __init__(self, encoding_name: str = "cl100k_base") -> None:
        self._encoding = tiktoken.get_encoding(encoding_name)

    def count(self, text: str) -> int:
        """
        Return the number of tokens in text.
        """
        return len(self._encoding.encode(text))