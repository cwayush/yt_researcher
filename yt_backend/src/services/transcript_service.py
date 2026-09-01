"""
TranscriptService — application service for transcript operations.

This module contains all business logic for fetching and processing
YouTube transcripts. The API layer calls this service and never
directly touches ingestion or processing modules.

Architecture:
    API route → TranscriptService → ingestion / processing → models
"""

from src.api.exceptions import InvalidYouTubeURL, TranscriptNotAvailable
from src.ingestion.youtube import YoutubeTranscriptProvider
from src.ingestion.base import TranscriptProvider
from src.models.api import TranscriptResponse
from src.config.settings import get_settings
from src.models.transcript import Sentence
from src.processing.sentences import reconstruct_sentences
from src.processing.transcript import process_transcript
from src.utility.youtube_url import extract_video_id


class TranscriptService:
    """
    Orchestrates the transcript fetch-and-process pipeline.

    Dependencies are injected via the constructor so they can be
    swapped in tests without touching application code.

    Usage:
        service = TranscriptService()
        response = service.get_transcript("https://www.youtube.com/watch?v=...")
    """

    def __init__(self, provider: TranscriptProvider | None = None) -> None:
        settings = get_settings()
        self._provider = provider or YoutubeTranscriptProvider()
        self._pause_threshold = settings.sentence_pause_threshold

    def get_transcript(self, url: str) -> TranscriptResponse:
        """
        Fetch, process, and reconstruct the transcript for a YouTube URL.

        Pipeline:
            URL → video_id extraction
                → raw TranscriptSegments (ingestion)
                → ProcessedSegments (normalization)
                → Sentences (reconstruction)
                → TranscriptResponse

        Args:
            url: Any valid YouTube URL (youtube.com or youtu.be).

        Returns:
            TranscriptResponse with video_id and list of reconstructed Sentences.

        Raises:
            InvalidYouTubeURL: If the URL cannot be parsed.
            TranscriptNotAvailable: If the transcript cannot be fetched.
        """
        video_id = extract_video_id(url)
        if not video_id:
            raise InvalidYouTubeURL(url)

        try:
            raw_segments = self._provider.fetch(video_id)
        except ValueError as exc:
            raise TranscriptNotAvailable(video_id, reason=str(exc)) from exc

        processed = process_transcript(raw_segments)
        sentences: list[Sentence] = reconstruct_sentences(
            processed,
            pause_threshold=self._pause_threshold,
        )

        return TranscriptResponse.from_sentences(video_id=video_id, sentences=sentences)
