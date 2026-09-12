import { THEME_STORAGE_KEY } from "@/config/site";
import { env } from "@/lib/env";
import { ROUTES } from "@/routes/paths";
import { ProcessingStep, RetrievalDetails, SettingsState } from "@/types";
import { ApiErrorKind } from "@/types/api";

export const APP_NAME = "Video Research";
export const APP_TAGLINE = "Understand videos. Faster.";

export const STORAGE_KEYS = {
  HISTORY: "yt_researcher_history_v2",
  SETTINGS: "yt_researcher_settings_v1",
  THEME: THEME_STORAGE_KEY,
} as const;

export const DEFAULT_SETTINGS: SettingsState = {
  apiBaseUrl: env.apiBaseUrl,
};

export const PROCESSING_STEPS: ProcessingStep[] = [
  { id: "validate", label: "Checking video" },
  { id: "transcript", label: "Fetching transcript" },
  { id: "process", label: "Processing transcript" },
  { id: "chunks", label: "Building searchable chunks" },
  { id: "embeddings", label: "Generating embeddings" },
  { id: "index", label: "Saving searchable index" },
  { id: "ready", label: "Ready" },
];

// Pause on the confirmation before entering the workspace.
export const PROCESSING_COMPLETE_MS = 700;

// Shown once the index is ready, chosen by the backend's `action`. All three
// lead to the same workspace; only the wording differs.
export const INDEX_ACTION_COPY = {
  indexed: "Your research workspace is ready.",
  reused: "This video is already indexed and ready to research.",
  rebuilt: "The video changed, so its research index was updated.",
} as const;

// Evidence cards rendered per answer. The backend returns its own final
// reranked set; this only limits how much of it the workspace shows.
export const EVIDENCE_DISPLAY_LIMIT = 3;

// Matches RetrievalRequest.question's min_length on the backend, so a too-short
// question is caught here instead of round-tripping to a 422.
export const MIN_QUESTION_LENGTH = 5;

export const FOOTER_LINKS: { label: string; to?: string }[] = [
  { label: "How It Works", to: ROUTES.howItWorks },
  { label: "Settings" },
];

export const WORKSPACE_LABELS = {
  newAnalysis: "New Analysis",
  devMode: "Dev Mode",
  theaterOn: "Theater view",
  theaterOff: "Compact view",
} as const;

export const RESET_COPY = {
  action: "Reset research data",
  title: "Reset your research data?",
  body: "This will remove your indexed videos, saved research history, and cached search data. Your app settings and theme will stay intact.",
  confirm: "Reset everything",
  confirming: "Resetting",
  cancel: "Cancel",
  emptyHint: "Nothing to reset yet.",
} as const;

export const RETRIEVAL_DETAIL_LABELS: Record<keyof Omit<RetrievalDetails, "roundTripMs">, string> =
  {
    query: "Query",
    outcome: "Outcome",
    evidenceCount: "Evidence returned",
    topScore: "Top relevance score",
  };

// The configured backend pipeline, stated as configuration rather than as
// something this client measured.
export const RETRIEVAL_PIPELINE_SUMMARY =
  "Backend pipeline: dense + BM25 → RRF → dedup → cross-encoder rerank → confidence gate";

const UNREACHABLE = "Couldn't reach the research service. Check your connection and try again.";

// What the user reads when a request fails, per failure kind and per surface.
export const INDEX_ERROR_COPY: Record<ApiErrorKind, string> = {
  network: UNREACHABLE,
  invalid_url: "That link doesn't look like a valid YouTube video.",
  no_transcript: "This video has no transcript we can read, so it can't be researched.",
  bad_request: "That link couldn't be used. Check it and try again.",
  server: "We couldn't prepare this video right now. Please try again.",
};

export const QUERY_ERROR_COPY: Record<ApiErrorKind, string> = {
  network: UNREACHABLE,
  invalid_url: "We couldn't look that up for this video.",
  no_transcript: "This video's transcript is no longer available.",
  bad_request: "Try rephrasing that question, it was a little too short.",
  server: "I couldn't research that question right now. Please try again.",
};

// A failed reset leaves everything in place, which is the reassuring part.
export const RESET_ERROR_COPY: Record<ApiErrorKind, string> = {
  network: "Couldn't reach the research service, so nothing was reset.",
  invalid_url: "Reset couldn't be completed. Your existing data is still available.",
  no_transcript: "Reset couldn't be completed. Your existing data is still available.",
  bad_request: "Reset couldn't be completed. Your existing data is still available.",
  server: "Reset couldn't be completed. Your existing data is still available.",
};
