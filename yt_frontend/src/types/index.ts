export type Relevance = "High" | "Medium" | "Low";

export interface EvidenceChunk {
  id: string;
  startTimestamp: string;
  endTimestamp: string;
  startSeconds: number;
  endSeconds?: number;
  text: string;
  relevance: Relevance;
  relevanceScore?: number;
}

export interface QAPair {
  id: string;
  question: string;
  answer: string;
  evidence: EvidenceChunk[];
}

export interface VideoMeta {
  id: string;
  url: string;
  title: string;
  channel: string;
  summary: string;
  duration: string;
  durationSeconds: number;
  language: string;
  thumbnail: string;
  publishedAt: string;
  questionCount: number;
  lastResearched: string;
  isIndexed: boolean;
}

// Shared by the components that render a single video.
export interface VideoProps {
  video: VideoMeta;
}

// One question-and-answer exchange in the research panel.
export interface ResearchEntry extends Omit<QAPair, "answer"> {
  answer: string | null;
  isLoading: boolean;
  noAnswer: boolean;
  retrievalDetails?: RetrievalDetails;
}

export interface ProcessingStep {
  id: string;
  label: string;
}

export type ProcessingStatus = "pending" | "active" | "completed";

export interface ProcessingStepState extends ProcessingStep {
  status: ProcessingStatus;
}

// Backing data for the workspace "Dev Mode" inspector.
export interface RetrievalDetails {
  query: string;
  candidates: string;
  denseRetrieval: string;
  keywordRetrieval: string;
  rrfMerged: string;
  reranked: string;
  selectedEvidence: string;
  confidence: string;
  executionTimeMs: number;
}

export interface SettingsState {
  apiBaseUrl: string;
  useBackendApi: boolean;
  topK: number;
  retrievalMode: "dense" | "hybrid";
}

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  cycleTheme: () => void;
}
