from fastapi import APIRouter
from src.container import create_retrieval_service
from src.models.retrieval import RetrievalRequest, RetrievalResponse


router = APIRouter(tags=["Retrieval Query"])

_service = create_retrieval_service()


@router.post("/query",
             response_model=RetrievalResponse,
             summary="Ask a question about indexed YouTube videos")
def retriever(request: RetrievalRequest):

    return _service.query(video_id=request.video_id,
                          question=request.question)