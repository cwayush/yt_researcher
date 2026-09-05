from src.models.transcript import Sentence
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


    def prepare(self, url: str) -> tuple[str, list[Sentence]]:
        """
        Fetch and prepare a YouTube transcript.

        Returns:
            Tuple containing video ID and reconstructed sentences.
        """

        video_id = extract_video_id(url)

        if not video_id:
            raise InvalidYouTubeURL(url)

        try:
            raw_segments = self._provider.fetch(video_id)

        except ValueError as exc:
            raise TranscriptNotAvailable(video_id,reason=str(exc)) from exc

        processed = process_transcript(raw_segments)

        sentences = reconstruct_sentences(processed,
                                          pause_threshold=self._pause_threshold)

        return video_id, sentences