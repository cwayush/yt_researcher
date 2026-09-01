"""src/ingestion package."""

from src.ingestion.base import TranscriptProvider
from src.ingestion.youtube import YoutubeTranscriptProvider

__all__ = ["TranscriptProvider", "YoutubeTranscriptProvider"]
