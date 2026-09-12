import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";
import { SettingsState, VideoMeta } from "@/types";

// The only module that touches localStorage for history and settings. Screens
// and hooks read through it so a write here is visible to every consumer.

function readJson<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable or full, the app stays usable this session.
  }
}

export function getStoredHistory(): VideoMeta[] {
  const parsed = readJson<VideoMeta[]>(STORAGE_KEYS.HISTORY);
  return Array.isArray(parsed) ? parsed : [];
}

export function saveStoredHistory(videos: VideoMeta[]): VideoMeta[] {
  writeJson(STORAGE_KEYS.HISTORY, videos);
  return videos;
}

// Moves the video to the front of history, creating it if it is new.
export function addOrUpdateHistoryVideo(video: VideoMeta): VideoMeta[] {
  const current = getStoredHistory();
  const existing = current.find((v) => v.id === video.id);
  const merged: VideoMeta = { ...existing, ...video, lastResearched: "Just now" };

  return saveStoredHistory([merged, ...current.filter((v) => v.id !== video.id)]);
}

// Reads the stored count rather than trusting a caller's snapshot, which goes
// stale as soon as a second question is asked in the same session.
export function incrementQuestionCount(videoId: string): VideoMeta[] {
  const current = getStoredHistory();
  const existing = current.find((v) => v.id === videoId);
  if (!existing) return current;

  return addOrUpdateHistoryVideo({
    ...existing,
    questionCount: existing.questionCount + 1,
  });
}

export function deleteHistoryVideo(videoId: string): VideoMeta[] {
  return saveStoredHistory(getStoredHistory().filter((v) => v.id !== videoId));
}

export function clearHistory(): VideoMeta[] {
  return saveStoredHistory([]);
}

// Resolves a video for a /workspace/:videoId deep link. A video is only known
// to this browser once it has been indexed from here.
export function getVideoById(videoId: string): VideoMeta | null {
  return getStoredHistory().find((v) => v.id === videoId) ?? null;
}

export function getStoredSettings(): SettingsState {
  const parsed = readJson<Partial<SettingsState>>(STORAGE_KEYS.SETTINGS);
  return parsed ? { ...DEFAULT_SETTINGS, ...parsed } : DEFAULT_SETTINGS;
}
