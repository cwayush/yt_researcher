import { useCallback, useEffect, useRef, useState } from "react";
import { MIN_QUESTION_LENGTH, QUERY_ERROR_COPY } from "@/lib/constants";
import { ApiError, apiClient } from "@/services/api";
import { toEvidenceChunks } from "@/services/mappers";
import { historyStore } from "@/hooks/useHistory";
import { ResearchEntry, RetrievalDetails, VideoMeta } from "@/types";

// Everything here is measured in this browser. The backend reports no retrieval
// internals, so nothing beyond these values is claimed.
function buildRetrievalDetails(
  query: string,
  evidence: ResearchEntry["evidence"],
  hasAnswer: boolean,
  roundTripMs: number
): RetrievalDetails {
  const topScore = evidence[0]?.relevanceScore;

  const outcome = !hasAnswer
    ? "No answer returned"
    : evidence.length > 0
      ? "Answered from retrieved evidence"
      : "Answered out of scope (confidence gate declined, no evidence)";

  return {
    query: `"${query}"`,
    outcome,
    evidenceCount: `${evidence.length} chunk${evidence.length === 1 ? "" : "s"}`,
    topScore: topScore === undefined ? "—" : topScore.toFixed(3),
    roundTripMs,
  };
}

export function useVideoResearch(video: VideoMeta) {
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDevView, setShowDevView] = useState(false);

  const researchEndRef = useRef<HTMLDivElement | null>(null);

  const runQuery = useCallback(
    async (entryId: string, text: string) => {
      setIsSubmitting(true);
      const startedAt = performance.now();

      const resolve = (patch: Partial<ResearchEntry>) =>
        setEntries((prev) =>
          prev.map((entry) =>
            entry.id === entryId
              ? { ...entry, isLoading: false, error: undefined, ...patch }
              : entry
          )
        );

      try {
        const res = await apiClient.queryVideo(video.id, text);
        const evidence = toEvidenceChunks(res.evidence);

        const hasAnswer = Boolean(res.answer);

        resolve({
          answer: hasAnswer ? res.answer : null,
          evidence,
          noAnswer: !hasAnswer,
          retrievalDetails: buildRetrievalDetails(
            text,
            evidence,
            hasAnswer,
            Math.round(performance.now() - startedAt)
          ),
        });

        historyStore.recordQuestion(video.id);
      } catch (err: unknown) {
        const kind = err instanceof ApiError ? err.kind : "server";
        resolve({ answer: null, evidence: [], noAnswer: false, error: QUERY_ERROR_COPY[kind] });
      } finally {
        setIsSubmitting(false);
      }
    },
    [video.id]
  );

  const submitQuestion = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (trimmed.length < MIN_QUESTION_LENGTH || isSubmitting) return;

      const entryId = `entry-${Date.now()}`;
      setQuestion("");

      setEntries((prev) => [
        ...prev,
        {
          id: entryId,
          question: trimmed,
          answer: null,
          evidence: [],
          isLoading: true,
          noAnswer: false,
        },
      ]);

      void runQuery(entryId, trimmed);
    },
    [isSubmitting, runQuery]
  );

  const retryEntry = useCallback(
    (entryId: string) => {
      if (isSubmitting) return;

      const entry = entries.find((item) => item.id === entryId);
      if (!entry) return;

      setEntries((prev) =>
        prev.map((item) =>
          item.id === entryId ? { ...item, isLoading: true, error: undefined } : item
        )
      );

      void runQuery(entryId, entry.question);
    },
    [entries, isSubmitting, runQuery]
  );

  // Keep the newest exchange in view as the thread grows.
  useEffect(() => {
    if (entries.length > 0) {
      researchEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [entries]);

  return {
    question,
    setQuestion,
    entries,
    isSubmitting,
    showEmptyState: entries.length === 0,
    showDevView,
    setShowDevView,
    researchEndRef,
    submitQuestion,
    retryEntry,
  };
}
