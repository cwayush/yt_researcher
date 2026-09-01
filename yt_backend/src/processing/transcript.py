"""
Transcript processing: normalization and segment filtering.

Takes raw TranscriptSegments from the ingestion layer and produces
clean ProcessedSegments ready for sentence reconstruction.

Functions are pure — no side effects, no I/O.
"""

import re

from src.models.transcript import ProcessedSegment, TranscriptSegment


def normalize_text(text: str) -> str:
    """
    Clean basic transcript formatting artifacts.

    - Strips leading/trailing whitespace
    - Collapses multiple spaces or newlines into a single space

    Args:
        text: Raw segment text.

    Returns:
        Normalized text string.
    """
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def process_transcript(segments: list[TranscriptSegment]) -> list[ProcessedSegment]:
    """
    Normalize and filter a list of raw transcript segments.

    Each segment is cleaned via normalize_text(). Segments that are
    empty after normalization are dropped. Each surviving segment receives
    an index reflecting its position in the original input list.

    Args:
        segments: Raw TranscriptSegment list from an ingestion provider.

    Returns:
        list[ProcessedSegment]: Cleaned segments with explicit end timestamps.
    """
    processed: list[ProcessedSegment] = []

    for index, segment in enumerate(segments):
        text = normalize_text(segment.text)

        # Drop completely empty segments (e.g. music notes "[Music]" after strip)
        if not text:
            continue

        processed.append(
            ProcessedSegment(
                text=text,
                start=segment.start,
                end=segment.end,
                index=index,
            )
        )

    return processed