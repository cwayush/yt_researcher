"""src/utility package."""

from src.utility.youtube_url import extract_video_id

# Keep backward-compatible alias so old imports from src.utility.index still work
# during the transition period. Remove once all references are updated.
__all__ = ["extract_video_id"]
