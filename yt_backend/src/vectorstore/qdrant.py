import uuid
from qdrant_client import QdrantClient, models
from src.models.embedding import EmbeddedChunk
from src.vectorstore.base import VectorStore
from src.models.vectorstore import VectorStoreResult
from src.models.retrieval import RetrievedChunk


class QdrantVectorStore(VectorStore):

    def __init__(self,
                 url: str,
                 collection_name: str,
                 vector_size: int,
                 api_key: str | None = None) -> None:

        self._collection_name = collection_name
        self._client = QdrantClient(url=url,api_key=api_key)

        self._ensure_collection(vector_size)


    def _ensure_collection(self, vector_size: int) -> None:

        if not self._client.collection_exists(self._collection_name):
            
            self._client.create_collection(
                collection_name=self._collection_name,
                vectors_config=models.VectorParams(
                    size=vector_size,
                    distance=models.Distance.COSINE,
                ),
            )

        self._client.create_payload_index(
            collection_name=self._collection_name,
            field_name="video_id",
            field_schema=models.PayloadSchemaType.KEYWORD,
        )


    def add_chunks(self,
                   chunks: list[EmbeddedChunk]) -> VectorStoreResult:    

        if not chunks:
            return VectorStoreResult(stored_count=0)

        points = []

        for chunk in chunks:

            point_id = str(uuid.uuid5(uuid.NAMESPACE_URL,chunk.chunk_id))

            points.append(models.PointStruct(
                        id=point_id,
                        vector=chunk.vector,
                        payload={
                            "chunk_id": chunk.chunk_id,
                            "parent_id": chunk.parent_id,
                            "video_id": chunk.video_id,
                            "text": chunk.text,
                            "start": chunk.start,
                            "end": chunk.end,
                            "sentence_indices": chunk.sentence_indices,
                            "token_count": chunk.token_count,
                        },
                    )
                )

        self._client.upsert(collection_name=self._collection_name,
                            points=points,
                            wait=True)

        return VectorStoreResult(stored_count=len(points))


    def search(self,
               vector: list[float],
               video_id: str,
               limit: int = 5):

        return self._client.query_points(
            collection_name=self._collection_name,
            query=vector,
            query_filter=models.Filter(
                must=[
                    models.FieldCondition(
                        key="video_id",
                        match=models.MatchValue(
                            value=video_id,
                        ),
                    )
                ]
            ),
            limit=limit,
            with_payload=True,
        )


    def get_chunks(self, video_id: str) -> list[RetrievedChunk]:

        results: list[RetrievedChunk] = []

        offset = None

        while True:
            points, offset = self._client.scroll(
                collection_name=self._collection_name,
                scroll_filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="video_id",
                            match=models.MatchValue(value=video_id)
                        )
                    ]
                ),
                limit=256,
                offset=offset,
                with_payload=True,
                with_vectors=False
            )

            for point in points:
                payload = point.payload or {}

                results.append(
                    RetrievedChunk(
                        chunk_id=payload["chunk_id"],
                        parent_id=payload["parent_id"],
                        video_id=payload["video_id"],
                        text=payload["text"],
                        score=0.0,
                        start=float(payload["start"]),
                        end=float(payload["end"]),
                        sentence_indices=payload.get(
                            "sentence_indices",
                            [],
                        ),
                        token_count=int(payload.get("token_count", 0)),
                        source="bm25",
                    )
                )

            if offset is None:
                break

        return results