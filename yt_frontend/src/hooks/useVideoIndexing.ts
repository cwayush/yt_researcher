import { useCallback, useEffect, useRef, useState } from "react";
import { INDEX_ERROR_COPY } from "@/lib/constants";
import { ApiError, apiClient } from "@/services/api";
import { toVideoMeta } from "@/services/mappers";
import { getVideoById } from "@/services/storage";
import { historyStore } from "@/hooks/useHistory";
import { VideoMeta } from "@/types";
import { IndexAction } from "@/types/api";

type IndexingPhase = "indexing" | "ready" | "error";

interface IndexingState {
  phase: IndexingPhase;
  video: VideoMeta | null;
  action: IndexAction | null;
  error: string | null;
}

const INDEXING: IndexingState = { phase: "indexing", video: null, action: null, error: null };

// Runs one /index request for a pasted URL and records the result in history.
// Indexing a long video takes a while, so the request is fired once per URL and
// never repeated on a re-render; `retry` is the only way to run it again.
export function useVideoIndexing(url: string | null) {
  const [state, setState] = useState<IndexingState>(INDEXING);
  const [attempt, setAttempt] = useState(0);

  const requested = useRef<string | null>(null);

  useEffect(() => {
    if (!url) return;

    const key = `${attempt}:${url}`;
    if (requested.current === key) return;
    requested.current = key;

    setState(INDEXING);

    const isCurrent = () => requested.current === key;

    apiClient
      .indexVideo(url)
      .then((res) => {
        if (!isCurrent()) return;

        // Carry forward what this browser already knows about the video, so a
        // reused index keeps its local question count.
        const video = toVideoMeta(res, getVideoById(res.video_id) ?? undefined);
        historyStore.add(video);

        setState({ phase: "ready", video, action: res.action, error: null });
      })
      .catch((err: unknown) => {
        if (!isCurrent()) return;

        const kind = err instanceof ApiError ? err.kind : "server";
        setState({ phase: "error", video: null, action: null, error: INDEX_ERROR_COPY[kind] });
      });
  }, [url, attempt]);

  const retry = useCallback(() => setAttempt((count) => count + 1), []);

  return { ...state, retry };
}
