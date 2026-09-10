"""
Indexing API route - thin HTTP layer.

Responsibilities:
    1. Parse and validate the incoming indexing request.
    2. Delegate the indexing workflow to IndexingService.
    3. Return the indexing result.
    4. Let application exception handlers translate domain errors.

The route contains no business or indexing logic.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from src.container import get_indexing_service
from src.models.index import IndexRequest, IndexResponse
from src.services.indexing import IndexingService


router = APIRouter(tags=["Indexing"])


@router.post("/index",
             response_model=IndexResponse,
             summary="Index a YouTube video")
def index_video(request: IndexRequest,
                service: Annotated[IndexingService, Depends(get_indexing_service)]) -> IndexResponse:

    return service.index(request.url)
