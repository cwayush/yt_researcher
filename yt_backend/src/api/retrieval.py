"""
Retrieval API route - thin HTTP layer.

Accepts a question about an already-indexed video and returns a grounded
answer with the transcript evidence it was drawn from.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from src.container import get_retrieval_service
from src.models.retrieval import RetrievalRequest, RetrievalResponse
from src.services.retrieval import RetrievalService


router = APIRouter(tags=["Retrieval Query"])


@router.post("/query",
             response_model=RetrievalResponse,
             summary="Ask a question about an indexed YouTube video")
def query_video(request: RetrievalRequest,
                service: Annotated[RetrievalService, Depends(get_retrieval_service)]) -> RetrievalResponse:

    return service.query(video_id=request.video_id,
                         question=request.question)
