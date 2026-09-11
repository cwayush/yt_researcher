from src.models.transcript import PreparedTranscript, Sentence
from src.config.settings import get_settings
from src.utility.youtube_url import extract_video_id
from src.ingestion.base import TranscriptProvider
from src.ingestion.youtube import YoutubeTranscriptProvider
from src.processing.transcript import process_transcript
from src.processing.sentences import reconstruct_sentences
from src.api.exceptions import InvalidYouTubeURL, TranscriptNotAvailable


class TranscriptService:
    """
    Application service responsible for preparing YouTube transcripts.

    Pipeline:
        URL → video ID → transcript → processed transcript → sentences
    """

    def __init__(self, provider: TranscriptProvider | None = None) -> None:

        settings = get_settings()

        self._provider = provider or YoutubeTranscriptProvider()
        self._pause_threshold = settings.sentence_pause_threshold


    def extract_id(self, url: str) -> str:
        """
        Resolve a YouTube URL to its video ID.

        Raises:
            InvalidYouTubeURL: If the URL is not a recognised YouTube format.
        """

        video_id = extract_video_id(url)

        if not video_id:
            raise InvalidYouTubeURL(url)

        return video_id


    def prepare(self, url: str) -> tuple[str, list[Sentence]]:
        """
        Fetch and prepare a YouTube transcript.

        Returns:
            Tuple containing video ID and reconstructed sentences.
        """

        video_id = self.extract_id(url)

        return video_id, self.prepare_by_id(video_id).sentences


    def prepare_by_id(self, video_id: str) -> PreparedTranscript:
        """
        Fetch and prepare the transcript for an already-resolved video ID.

        Returns:
            Reconstructed sentences plus the caption language.
        """

        try:
            fetched = self._provider.fetch(video_id)

        except ValueError as exc:
            raise TranscriptNotAvailable(video_id,reason=str(exc)) from exc

        processed = process_transcript(fetched.segments)

        sentences = reconstruct_sentences(processed,
                                          pause_threshold=self._pause_threshold)

        return PreparedTranscript(sentences=sentences,
                                  language=fetched.language,
                                  language_code=fetched.language_code)
