import { THEME_STORAGE_KEY } from "@/config/site";
import { env } from "@/lib/env";
import { ProcessingStep, RetrievalDetails, SettingsState } from "@/types";

export const APP_NAME = "Video Research";
export const APP_TAGLINE = "Understand videos. Faster.";

export const STORAGE_KEYS = {
  HISTORY: "yt_researcher_history_v2",
  SETTINGS: "yt_researcher_settings_v1",
  THEME: THEME_STORAGE_KEY,
} as const;

export const DEFAULT_SETTINGS: SettingsState = {
  apiBaseUrl: env.apiBaseUrl,
  useBackendApi: env.useBackendApi,
  topK: 5,
  retrievalMode: "hybrid",
};

export const PROCESSING_STEPS: ProcessingStep[] = [
  { id: "validate", label: "Validating video" },
  { id: "transcript", label: "Retrieving transcript" },
  { id: "process", label: "Processing transcript" },
  { id: "chunks", label: "Building chunks" },
  { id: "embeddings", label: "Generating embeddings" },
  { id: "index", label: "Building retrieval index" },
  { id: "ready", label: "Ready" },
];

// Milliseconds each processing step is shown before advancing.
export const PROCESSING_STEP_MS = 520;

// Pause after the final step before entering the workspace.
export const PROCESSING_COMPLETE_MS = 700;

// Simulated retrieval latency for a mock question.
export const MOCK_ANSWER_DELAY_MS = 800;

export const FOOTER_LINKS: { label: string; to?: string }[] = [
  { label: "Settings" },
  { label: "About" },
  { label: "Privacy" },
  { label: "Terms" },
];

export const WORKSPACE_LABELS = {
  newAnalysis: "New Analysis",
  devMode: "Dev Mode",
} as const;

export const RETRIEVAL_DETAIL_LABELS: Record<
  keyof Omit<RetrievalDetails, "executionTimeMs">,
  string
> = {
  query: "Query",
  candidates: "Candidates",
  denseRetrieval: "Dense retrieval",
  keywordRetrieval: "Keyword retrieval (BM25)",
  rrfMerged: "RRF merged",
  reranked: "Reranked",
  selectedEvidence: "Selected evidence",
  confidence: "Confidence",
};
