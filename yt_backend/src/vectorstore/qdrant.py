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

        for field_name in ("video_id", "chunk_id"):
            self._client.create_payload_index(
                collection_name=self._collection_name,
                field_name=field_name,
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


    def delete_stale(self,
                     video_id: str,
                     keep_chunk_ids: list[str]) -> None:
        """
        Drop vectors left over from a previous version of this video.
        """

        if not keep_chunk_ids:
            return

        self._client.delete(
            collection_name=self._collection_name,
            points_selector=models.FilterSelector(
                filter=models.Filter(
                    must=[
                        models.FieldCondition(
                            key="video_id",
                            match=models.MatchValue(value=video_id),
                        )
                    ],
                    must_not=[
                        models.FieldCondition(
                            key="chunk_id",
                            match=models.MatchAny(any=keep_chunk_ids),
                        )
                    ],
                )
            ),
            wait=True,
        )


    def delete_all(self) -> int:
        """
        Drop every point from the application's collection.

        Returns:
            How many points were present before the delete.
        """

        deleted = self._client.count(collection_name=self._collection_name,
                                     exact=True).count

        if deleted:
            self._client.delete(
                collection_name=self._collection_name,
                points_selector=models.FilterSelector(filter=models.Filter()),
                wait=True,
            )

        return deleted


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