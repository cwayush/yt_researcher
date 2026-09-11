"""
Video title and channel from YouTube's public oEmbed endpoint.

oEmbed needs no API key and no quota, but it only exposes title, author and
thumbnail — not duration or description. Every failure returns None: metadata
is presentation detail, and losing it must never prevent a video from being
indexed.
"""

import httpx
from src.models.index_state import OEmbedMetadata

OEMBED_URL = "https://www.youtube.com/oembed"

TIMEOUT_SECONDS = 5.0


class YoutubeOEmbedProvider:
    """Fetches video metadata that the transcript API does not carry."""

    def fetch(self, video_id: str) -> OEmbedMetadata | None:
        """
        Look up title and channel for a video.

        Returns:
            OEmbedMetadata, or None if the lookup failed for any reason.
        """

        try:
            response = httpx.get(
                OEMBED_URL,
                params={
                    "url": f"https://www.youtube.com/watch?v={video_id}",
                    "format": "json",
                },
                timeout=TIMEOUT_SECONDS,
            )

            response.raise_for_status()

            payload = response.json()

        except (httpx.HTTPError, ValueError):
            return None

        return OEmbedMetadata(title=payload.get("title"),
                              channel=payload.get("author_name"))
