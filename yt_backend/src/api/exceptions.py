"""
Custom exception types for the YouTube Researcher API.

These exceptions are raised by domain logic and translated into
appropriate HTTP responses by FastAPI exception handlers registered
in main.py.

Rule: Never let library-internal exceptions (e.g. YouTubeTranscriptApi errors)
propagate to the API layer. Always wrap them in one of these types.
"""


class InvalidYouTubeURL(Exception):
    """Raised when the provided URL cannot be parsed as a valid YouTube URL."""

    def __init__(self, url: str) -> None:
        self.url = url
        super().__init__(f"Invalid YouTube URL: '{url}'")


class TranscriptNotAvailable(Exception):
    """
    Raised when a transcript cannot be fetched for a given video.

    This covers: transcripts disabled, no transcript in any language,
    private/deleted videos, or age-restricted content.
    """

    def __init__(self, video_id: str, reason: str = "") -> None:
        self.video_id = video_id
        self.reason = reason
        message = f"Transcript not available for video '{video_id}'."
        if reason:
            message += f" Reason: {reason}"
        super().__init__(message)


class VideoNotFound(Exception):
    """Raised when the video ID does not correspond to an existing YouTube video."""

    def __init__(self, video_id: str) -> None:
        self.video_id = video_id
        super().__init__(f"Video not found: '{video_id}'")
