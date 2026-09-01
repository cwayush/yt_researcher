"""
YouTube transcript provider.

Fetches raw transcripts from YouTube using the youtube-transcript-api library
and converts them into the application's TranscriptSegment domain model.
"""

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import (
    NoTranscriptFound,
    TranscriptsDisabled,
    VideoUnavailable,
)

from src.ingestion.base import TranscriptProvider
from src.models.transcript import TranscriptSegment


class YoutubeTranscriptProvider(TranscriptProvider):
    """
    Concrete TranscriptProvider backed by youtube-transcript-api.

    Fetches the default (auto-generated or manually uploaded) transcript
    for the given video ID. Raises domain-friendly errors rather than
    exposing library internals to callers.
    """

    def fetch(self, video_id: str) -> list[TranscriptSegment]:
        """
        Fetch YouTube transcript and convert to TranscriptSegment list.

        Args:
            video_id: The YouTube video ID string.

        Returns:
            list[TranscriptSegment]: Segments in chronological order.

        Raises:
            ValueError: If the video has no transcript or is unavailable.
                        (Callers convert this to the appropriate HTTP error.)
        """
        try:
            api = YouTubeTranscriptApi()
            fetched = api.fetch(video_id)
        except TranscriptsDisabled:
            raise ValueError(f"Transcripts are disabled for video '{video_id}'.")
        except NoTranscriptFound:
            raise ValueError(f"No transcript found for video '{video_id}'.")
        except VideoUnavailable:
            raise ValueError(f"Video '{video_id}' is unavailable.")

        return [
            TranscriptSegment(
                text=snippet.text,
                start=snippet.start,
                duration=snippet.duration,
            )
            for snippet in fetched
        ]