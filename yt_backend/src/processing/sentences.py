"""
Sentence reconstruction from processed transcript segments.

Combines sequences of ProcessedSegments into logically complete Sentence
objects using two boundary signals:

1. Punctuation boundary — segment text ends with . ! ? (optionally followed
   by closing quotes or brackets)
2. Timestamp pause — the gap between the current segment's end and the next
   segment's start exceeds the pause_threshold (default 2.0 seconds)

Either condition triggers the end of the current sentence.

Functions are pure — no side effects, no I/O.
"""

import re
from src.models.transcript import ProcessedSegment, Sentence

# Matches segment text that ends a sentence: . ! ? optionally followed by "'")]}
SENTENCE_END = re.compile(r'[.!?]["\')]*$')


def reconstruct_sentences(
    segments: list[ProcessedSegment],
    pause_threshold: float = 2.0,
) -> list[Sentence]:
    """
    Reconstruct logical sentences from a list of processed transcript segments.

    Algorithm:
        For each segment, append its text to the current sentence buffer.
        After each segment, check two boundary conditions:
          1. Punctuation boundary (regex match on segment text)
          2. Pause boundary (time gap to next segment >= pause_threshold)
        If either fires, flush the buffer as a new Sentence and reset.
        After the loop, flush any remaining buffered text as a final sentence.

    Args:
        segments:        Cleaned ProcessedSegment list, in chronological order.
        pause_threshold: Minimum gap in seconds between segment end and the
                         next segment start to force a sentence boundary.
                         Default is 2.0 seconds.

    Returns:
        list[Sentence]: Reconstructed sentences in order, each with:
            - combined text of all constituent segments
            - start time of the first constituent segment
            - end time of the last constituent segment
            - source_segments: list of ProcessedSegment indices used
    """
    sentences: list[Sentence] = []

    current_text: list[str] = []
    current_start: float | None = None
    current_end: float | None = None
    current_segment_indices: list[int] = []
    sentence_index = 0

    for i, segment in enumerate(segments):

        # Initialise start timestamp on the first segment of a new sentence
        if current_start is None:
            current_start = segment.start

        current_text.append(segment.text)
        current_end = segment.end
        current_segment_indices.append(segment.index)

        combined_text = " ".join(current_text).strip()

        # Boundary condition 1: punctuation
        punctuation_boundary = bool(SENTENCE_END.search(segment.text.strip()))

        # Boundary condition 2: timestamp pause 
        pause_boundary = False
        if i + 1 < len(segments):
            next_segment = segments[i + 1]
            gap = next_segment.start - segment.end
            if gap >= pause_threshold:
                pause_boundary = True

        #  Flush sentence if either boundary fires 
        if punctuation_boundary or pause_boundary:
            sentences.append(
                Sentence(
                    text=combined_text,
                    start=current_start,
                    end=current_end,
                    index=sentence_index,
                    source_segments=current_segment_indices.copy(),
                )
            )
            sentence_index += 1
            current_text = []
            current_start = None
            current_end = None
            current_segment_indices = []

    #  Flush any remaining buffered text 
    if current_text:
        sentences.append(
            Sentence(
                text=" ".join(current_text).strip(),
                start=current_start,
                end=current_end,
                index=sentence_index,
                source_segments=current_segment_indices,
            )
        )

    return sentences