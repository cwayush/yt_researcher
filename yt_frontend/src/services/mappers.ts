// The single translation point between backend wire contracts and the frontend
// domain models. Nothing above this layer sees a snake_case field.

import {
  canonicalYouTubeUrl,
  formatSeconds,
  mapScoreToRelevance,
  youTubeThumbnailUrl,
} from "@/lib/utils";
import { EvidenceChunk, VideoMeta } from "@/types";
import { BackendEvidence, IndexResponse } from "@/types/api";

const UNKNOWN_TITLE = "Untitled video";
const UNKNOWN_CHANNEL = "Unknown channel";

// Metadata lookup is best-effort on the backend, so every field can be null.
export function toVideoMeta(res: IndexResponse, existing?: VideoMeta): VideoMeta {
  const meta = res.metadata;
  const durationSeconds = meta?.duration ?? 0;

  return {
    id: res.video_id,
    url: canonicalYouTubeUrl(res.video_id),
    title: meta?.title ?? existing?.title ?? UNKNOWN_TITLE,
    channel: meta?.channel ?? existing?.channel ?? UNKNOWN_CHANNEL,
    summary: meta?.overview ?? existing?.summary ?? "",
    duration: durationSeconds ? formatSeconds(durationSeconds) : (existing?.duration ?? ""),
    durationSeconds: durationSeconds || (existing?.durationSeconds ?? 0),
    language: meta?.language ?? meta?.language_code ?? existing?.language ?? "",
    thumbnail: youTubeThumbnailUrl(res.video_id),
    questionCount: existing?.questionCount ?? 0,
    lastResearched: existing?.lastResearched ?? "Just now",
    isIndexed: res.indexed,
  };
}

// Reranker order is the backend's ranking; it is preserved as-is.
export function toEvidenceChunks(evidence: BackendEvidence[]): EvidenceChunk[] {
  return evidence.map((item) => ({
    id: item.chunk_id,
    startTimestamp: formatSeconds(item.start),
    endTimestamp: formatSeconds(item.end),
    startSeconds: item.start,
    endSeconds: item.end,
    text: item.text,
    relevance: mapScoreToRelevance(item.relevance_score),
    relevanceScore: item.relevance_score,
  }));
}
