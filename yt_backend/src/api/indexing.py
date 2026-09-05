"""
Indexing API route — thin HTTP layer.

Responsibilities:
    1. Parse and validate the incoming indexing request.
    2. Delegate the indexing workflow to IndexingService.
    3. Return the indexing result.
    4. Let application exception handlers translate domain errors.

The route contains no business or indexing logic.
"""


from fastapi import APIRouter
from src.container import create_indexing_service
from src.models.index import IndexRequest, IndexResponse


router = APIRouter(tags=["Indexing"])

_service = create_indexing_service()


@router.post("/index",
             response_model=IndexResponse,
             summary="Index a YouTube video")
def index_video(request: IndexRequest):

    return _service.index(request.url)