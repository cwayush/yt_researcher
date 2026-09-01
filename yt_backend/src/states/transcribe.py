"""
DEPRECATED: This module is kept for backward compatibility only.

All models have been moved to src/models/.

    TranscriptSegment  → src.models.transcript
    ProcessedSegment   → src.models.transcript
    Sentence           → src.models.transcript
    TranscriptResponse → src.models.api
    TranscribeState    → src.models.state

Do NOT add new models here. Import from src.models instead.
"""

# Re-export everything so existing imports continue to work during transition
from src.models.api import TranscriptResponse  # noqa: F401
from src.models.state import TranscribeState  # noqa: F401
from src.models.transcript import (  # noqa: F401
    ProcessedSegment,
    Sentence,
    TranscriptSegment,
)
