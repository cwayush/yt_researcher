"""
Abstract base class for transcript providers.

Defines the interface that all transcript providers must implement.
This allows the application to swap providers (YouTube API, Whisper, etc.)
without changing any business logic.

Usage:
    class MyProvider(TranscriptProvider):
        def fetch(self, video_id: str) -> list[TranscriptSegment]:
            ...
"""

from abc import ABC, abstractmethod
from src.models.transcript import TranscriptSegment


class TranscriptProvider(ABC):
    """
    Abstract transcript provider interface.

    Any concrete implementation must be able to accept a video ID string
    and return a list of raw TranscriptSegment objects in chronological order.
    """

    @abstractmethod
    def fetch(self, video_id: str) -> list[TranscriptSegment]:
        """
        Fetch the raw transcript for the given video ID.

        Args:
            video_id: The YouTube video ID (e.g. "dQw4w9WgXcQ")

        Returns:
            A list of TranscriptSegment objects in chronological order.

        Raises:
            TranscriptNotAvailable: If the video has no accessible transcript.
            VideoNotFound: If the video ID does not exist.
        """
        ...
