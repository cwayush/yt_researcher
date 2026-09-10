import { useCallback, useSyncExternalStore } from "react";
import {
  addOrUpdateHistoryVideo,
  clearHistory,
  deleteHistoryVideo,
  getStoredHistory,
} from "@/services/storage";
import { VideoMeta } from "@/types";

// Shared store over the localStorage history, so every mounted screen sees the same snapshot.
const listeners = new Set<() => void>();
let snapshot: VideoMeta[] | null = null;

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): VideoMeta[] {
  if (snapshot === null) snapshot = getStoredHistory();
  return snapshot;
}

// Publishes a new history array to every subscriber.
function commit(next: VideoMeta[]): void {
  snapshot = next;
  listeners.forEach((listener) => listener());
}

export const historyStore = {
  add(video: VideoMeta) {
    commit(addOrUpdateHistoryVideo(video));
  },
  remove(videoId: string) {
    commit(deleteHistoryVideo(videoId));
  },
  clear() {
    commit(clearHistory());
  },
  // Re-reads storage, e.g. after another tab wrote to it.
  refresh() {
    commit(getStoredHistory());
  },
};

export function useHistory() {
  const history = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const add = useCallback((video: VideoMeta) => historyStore.add(video), []);
  const remove = useCallback((videoId: string) => historyStore.remove(videoId), []);
  const clear = useCallback(() => historyStore.clear(), []);
  const refresh = useCallback(() => historyStore.refresh(), []);

  return { history, add, remove, clear, refresh };
}
