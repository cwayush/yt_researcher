"""
Reset API route - thin HTTP layer.

Development-only. Parses the confirmation and delegates to ResetService;
no deletion logic lives here.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from src.container import get_reset_service
from src.models.reset import ResetRequest, ResetResponse
from src.services.reset import ResetService


router = APIRouter(tags=["Reset"])


@router.post("/reset",
             response_model=ResetResponse,
             summary="Reset all indexed application data",
             description=("Clears the PostgreSQL indexing tables, every point in the Qdrant collection and the in-memory BM25 cache."))
def reset_data(request: ResetRequest,
               service: Annotated[ResetService, Depends(get_reset_service)]) -> ResetResponse:

    return service.reset()
