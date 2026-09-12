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
  error?: string;
  retrievalDetails?: RetrievalDetails;
}

export interface ProcessingStep {
  id: string;
  label: string;
}

// Dev Mode inspector.
export interface RetrievalDetails {
  query: string;
  outcome: string;
  evidenceCount: string;
  topScore: string;
  roundTripMs: number;
}

export interface SettingsState {
  apiBaseUrl: string;
}

export type ThemePreference = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

export interface ThemeContextValue {
  theme: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
  cycleTheme: () => void;
}
