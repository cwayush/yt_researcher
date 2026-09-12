// Wire contracts, mirrored from yt_backend's Pydantic models.
export interface IndexRequest {
  url: string;
}

export type IndexAction = "indexed" | "reused" | "rebuilt";

export interface BackendVideoMetadata {
  video_id: string;
  title: string | null;
  channel: string | null;
  duration: number | null;
  language: string | null;
  language_code: string | null;
  overview: string | null;
}

export interface IndexResponse {
  video_id: string;
  indexed: boolean;
  action: IndexAction;
  parent_count: number | null;
  child_count: number | null;
  metadata: BackendVideoMetadata | null;
  message: string;
}

export interface RetrievalRequest {
  video_id: string;
  question: string;
}

export interface BackendEvidence {
  chunk_id: string;
  start: number;
  end: number;
  text: string;
  relevance_score: number;
}

export interface RetrievalResponse {
  answer: string;
  evidence: BackendEvidence[];
}

// Domain errors carry a machine-readable `error`; request validation failures
// come back on the same status with FastAPI's own list-shaped `detail`.
export interface ApiErrorBody {
  error?: string;
  detail?: string | unknown[];
  video_id?: string;
}

// What went wrong, in terms the UI can pick copy from. Hooks branch on this
// rather than parsing messages, so no backend text ever reaches the screen.
export type ApiErrorKind = "network" | "invalid_url" | "no_transcript" | "bad_request" | "server";

export interface ResetRequest {
  confirm: true;
}

export interface ResetResponse {
  reset: boolean;
  deleted_parent_chunks: number;
  deleted_videos: number;
  deleted_metadata: number;
  deleted_vectors: number;
  cleared_bm25_cache: boolean;
  message: string;
}
