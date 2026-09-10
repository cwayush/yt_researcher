import { DEFAULT_SETTINGS, STORAGE_KEYS } from "@/lib/constants";
import { historyVideos } from "@/data/demo";
import { SettingsState, VideoMeta } from "@/types";

// Only read path for history. Screens must not import the demo array
// directly or writes made here become invisible to the UI.

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

// Layers a stored record over its bundled counterpart so an older
// shape still renders completely.
function hydrate(stored: VideoMeta): VideoMeta {
  const bundled = historyVideos.find((v) => v.id === stored.id);
  return bundled ? { ...bundled, ...stored } : stored;
}

export function getStoredHistory(): VideoMeta[] {
  const parsed = readJson<VideoMeta[]>(STORAGE_KEYS.HISTORY);
  if (!Array.isArray(parsed)) {
    saveStoredHistory(historyVideos);
    return historyVideos;
  }
  return parsed.map(hydrate);
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

export function deleteHistoryVideo(videoId: string): VideoMeta[] {
  return saveStoredHistory(getStoredHistory().filter((v) => v.id !== videoId));
}

export function clearHistory(): VideoMeta[] {
  return saveStoredHistory([]);
}

// Resolves a video for a /workspace/:videoId deep link. Stored history
// first, then the bundled demos so a fresh browser still opens.
export function getVideoById(videoId: string): VideoMeta | null {
  return (
    getStoredHistory().find((v) => v.id === videoId) ??
    historyVideos.find((v) => v.id === videoId) ??
    null
  );
}

export function getStoredSettings(): SettingsState {
  const parsed = readJson<Partial<SettingsState>>(STORAGE_KEYS.SETTINGS);
  return parsed ? { ...DEFAULT_SETTINGS, ...parsed } : DEFAULT_SETTINGS;
}
