export interface IndexRequest {
  url: string;
}

export interface IndexResponse {
  video_id: string;
  indexed: boolean;
  parent_count: number;
  child_count: number;
  message: string;
}

export interface RetrievalRequest {
  video_id: string;
  question: string;
}

export interface BackendEvidence {
  start: number;
  end: number;
  text: string;
  relevance_score: number;
}

export interface RetrievalResponse {
  answer: string;
  evidence: BackendEvidence[];
}

export interface BackendSentence {
  text: string;
  start: number;
  end: number;
  index: number;
  source_segments: number[];
}

export interface TranscriptResponse {
  video_id: string;
  sentences: BackendSentence[];
  sentence_count: number;
}

export interface ApiError {
  error: string;
  detail: string;
  video_id?: string;
}
