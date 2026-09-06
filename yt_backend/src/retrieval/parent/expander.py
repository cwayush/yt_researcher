from src.models.retrieval import RetrievedChunk
from src.models.chunks import ParentChunk
from src.parentstore.base import ParentStore

class ParentExpander:

    def __init__(self, parent_store: ParentStore):
        self._parent_store = parent_store

    def expand(self, children: list[RetrievedChunk]) -> list[ParentChunk]:

        parent_ids = list({
            child.parent_id for child in children
        })

        if not parent_ids:
            return []

        return self._parent_store.get_by_ids(parent_ids)