"""
Chunking inspection route — thin HTTP layer.

Exposes the parent/child chunks the indexing pipeline would produce for a
video, without storing anything. Useful for tuning chunk sizes; not part of
the indexing or query flow.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from src.chunking.service import ChunkingService
from src.container import get_chunking_service, get_transcript_service
from src.models.chunks import ChunkResponse
from src.models.index import IndexRequest
from src.services.transcript import TranscriptService


router = APIRouter(tags=["Inspection"])


@router.post("/chunks",
             response_model=ChunkResponse,
             summary="Preview hierarchical transcript chunks")
def get_chunks(request: IndexRequest,
               transcript_service: Annotated[TranscriptService, Depends(get_transcript_service)],
               chunking_service: Annotated[ChunkingService, Depends(get_chunking_service)]) -> ChunkResponse:

    video_id, sentences = transcript_service.prepare(request.url)

    chunks = chunking_service.create_chunks(sentences=sentences, video_id=video_id)

    return ChunkResponse(video_id=video_id,
                         parent_count=len(chunks.parents),
                         child_count=len(chunks.children),
                         parents=chunks.parents,
                         children=chunks.children)
