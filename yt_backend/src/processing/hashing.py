"""
Deterministic fingerprinting of a prepared transcript.

The hash is taken over the reconstructed sentence text — the exact input the
chunker consumes — so a matching hash guarantees the existing chunks and
embeddings still represent the video.

Timestamps are deliberately excluded: auto-generated captions carry sub-second
jitter between fetches with no change in content, which would otherwise force
pointless re-embedding.

Functions are pure — no side effects, no I/O.
"""

import hashlib

from src.models.transcript import Sentence


def transcript_hash(sentences: list[Sentence]) -> str:
    """
    Compute a SHA-256 fingerprint of the reconstructed transcript.

    Args:
        sentences: Reconstructed sentences, in order.

    Returns:
        Hex-encoded SHA-256 digest of the joined sentence text.
    """
    joined = "\n".join(sentence.text for sentence in sentences)

    return hashlib.sha256(joined.encode("utf-8")).hexdigest()
