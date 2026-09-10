import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Relevance } from "@/types";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// 522 -> "08:42", 3725 -> "01:02:05"
export function formatSeconds(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "00:00";
  const total = Math.floor(seconds);
  const hrs = Math.floor(total / 3600);
  const mins = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  const mm = String(mins).padStart(2, "0");
  const ss = String(secs).padStart(2, "0");
  return hrs > 0 ? `${String(hrs).padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
}

// Answers are stored as blank-line separated paragraphs.
export function firstParagraph(text: string): string {
  return text.split("\n\n")[0];
}

const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}/;

const YOUTUBE_ID_PATTERN =
  /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;

const YOUTUBE_WHOLE_ID_PATTERN =
  /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?(?:.*&)?v=))([^&?/#]+)/;

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_URL_PATTERN.test(url.trim());
}

export function extractVideoId(url: string): string | null {
  const match = url.trim().match(YOUTUBE_ID_PATTERN);
  return match ? match[1] : null;
}

export function hasPlayableSource(url: string): boolean {
  const match = url.trim().match(YOUTUBE_WHOLE_ID_PATTERN);
  return match ? match[1].length === 11 : false;
}

export function mapScoreToRelevance(score: number): Relevance {
  if (score >= 0.75) return "High";
  if (score >= 0.5) return "Medium";
  return "Low";
}

export function youTubeTimestampUrl(url: string, seconds: number): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}t=${Math.max(0, Math.floor(seconds))}s`;
}
