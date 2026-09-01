"""
YouTube URL utility functions.

Extracts the video ID from standard YouTube URL formats.
"""

from urllib.parse import parse_qs, urlparse


def extract_video_id(url: str) -> str | None:
    """
    Extract the YouTube video ID from a URL string.

    Supports:
        - https://www.youtube.com/watch?v=VIDEO_ID
        - https://youtube.com/watch?v=VIDEO_ID
        - https://youtu.be/VIDEO_ID
        - https://youtu.be/VIDEO_ID?si=...  (share links with tracking params)

    Args:
        url: A YouTube URL string.

    Returns:
        The video ID string (e.g. "dQw4w9WgXcQ"), or None if the URL
        is not a recognised YouTube format.
    """
    parsed = urlparse(url)

    if parsed.hostname in {"youtube.com", "www.youtube.com"}:
        return parse_qs(parsed.query).get("v", [None])[0]

    if parsed.hostname == "youtu.be":
        return parsed.path.lstrip("/") or None

    return None
