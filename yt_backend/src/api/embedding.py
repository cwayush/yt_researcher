from fastapi import APIRouter
from src.models.index import IndexRequest
from src.models.embedding import EmbeddedResponse
from src.services.transcript import TranscriptService
from src.chunking.service import ChunkingService
from src.container import create_embedding_service


router = APIRouter(tags=["Embeddings"])


_transcript_service = TranscriptService()
_chunking_service = ChunkingService()
_embedding_service = create_embedding_service()


@router.post("/embeddings",
             response_model=EmbeddedResponse,
             summary="Generate embeddings for a YouTube video")
def create_embeddings(request: IndexRequest) -> EmbeddedResponse:

    video_id, sentences = _transcript_service.prepare(request.url)

    chunks = _chunking_service.create_chunks(sentences=sentences,
                                             video_id=video_id)

    embedded_chunks = _embedding_service.embed_children(chunks.children)

    return EmbeddedResponse(video_id=video_id, embeddings=embedded_chunks)