from fastapi import APIRouter
from src.models.chunks import ChunkResponse
from src.models.index import IndexRequest
from src.services.transcript import TranscriptService
from src.chunking.service import ChunkingService


router = APIRouter(tags=["Chunkings"])

_transcript_service = TranscriptService()
_chunking_service = ChunkingService()


@router.post("/chunks",
             response_model=ChunkResponse,
             summary="Create hierarchical transcript chunks")
def get_chunks(request: IndexRequest):

    video_id, sentences = _transcript_service.prepare(request.url)

    chunks = _chunking_service.create_chunks(sentences=sentences, video_id=video_id)

    return ChunkResponse(video_id=video_id,
                         parent_count=len(chunks.parents),
                         child_count=len(chunks.children),
                         parents=chunks.parents,
                         children=chunks.children)