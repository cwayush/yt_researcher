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

// Only the two forms the backend's extract_video_id accepts: a watch URL or a
// youtu.be share link. Anything else is rejected here rather than after a
// round trip, since /index would answer 400 for it.
const YOUTUBE_URL_PATTERN =
  /^https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?(?:[^#]*&)?v=|youtu\.be\/)[\w-]{11}(?:[&?#/]|$)/;

const YOUTUBE_WHOLE_ID_PATTERN =
  /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?(?:.*&)?v=))([^&?/#]+)/;

export function isValidYouTubeUrl(url: string): boolean {
  return YOUTUBE_URL_PATTERN.test(url.trim());
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

// The watch URL, whatever form the user pasted. Short links and /shorts/ don't
// take a ?t= offset, so evidence links are always built from this shape.
export function canonicalYouTubeUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// hqdefault exists for every video; maxresdefault 404s on plenty of them.
export function youTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
