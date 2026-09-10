"""
Embedding inspection route - thin HTTP layer.

Runs a video through transcript → chunking → embedding and returns the raw
child vectors without storing them. Useful for verifying embedding output;
not part of the indexing or query flow.

Note: this calls the embedding provider for every child chunk and returns
full vectors, so responses are large and each call consumes API quota.
"""

from typing import Annotated

from fastapi import APIRouter, Depends

from src.chunking.service import ChunkingService
from src.container import (
    get_chunking_service,
    get_embedding_service,
    get_transcript_service,
)
from src.embeddings.service import EmbeddingService
from src.models.embedding import EmbeddedResponse
from src.models.index import IndexRequest
from src.services.transcript import TranscriptService


router = APIRouter(tags=["Inspection"])


@router.post("/embeddings",
             response_model=EmbeddedResponse,
             summary="Preview embeddings for a YouTube video")
def create_embeddings(request: IndexRequest,
                      transcript_service: Annotated[TranscriptService, Depends(get_transcript_service)],
                      chunking_service: Annotated[ChunkingService, Depends(get_chunking_service)],
                      embedding_service: Annotated[EmbeddingService, Depends(get_embedding_service)],
                      ) -> EmbeddedResponse:

    video_id, sentences = transcript_service.prepare(request.url)

    chunks = chunking_service.create_chunks(sentences=sentences, video_id=video_id)

    embedded_chunks = embedding_service.embed_children(chunks.children)

    return EmbeddedResponse(video_id=video_id, embeddings=embedded_chunks)
