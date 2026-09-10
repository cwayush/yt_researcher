import { useCallback, useEffect, useRef, useState } from "react";
import { demoQAPairs, suggestedQuestions } from "@/data/demo";
import { MOCK_ANSWER_DELAY_MS } from "@/lib/constants";
import { formatSeconds, mapScoreToRelevance } from "@/lib/utils";
import { apiClient } from "@/services/api";
import { getStoredSettings } from "@/services/storage";
import { historyStore } from "@/hooks/useHistory";
import { EvidenceChunk, QAPair, ResearchEntry, RetrievalDetails, VideoMeta } from "@/types";

// Loosely matches a typed question against the pre-baked demo answers.
function findDemoAnswer(question: string): QAPair | undefined {
  const q = question.toLowerCase().trim();
  return demoQAPairs.find(
    (pair) =>
      pair.question.toLowerCase() === q ||
      pair.question.toLowerCase().includes(q.slice(0, 15)) ||
      q.includes(pair.question.toLowerCase().slice(0, 15))
  );
}

function buildRetrievalDetails(
  query: string,
  evidenceCount: number,
  declined: boolean,
  executionTimeMs: number
): RetrievalDetails {
  return {
    query: `"${query}"`,
    candidates: `${declined ? 12 : 24} chunks`,
    denseRetrieval: "Top 10",
    keywordRetrieval: "Top 10",
    rrfMerged: `${declined ? 6 : 18} unique chunks`,
    reranked: "Top 5",
    selectedEvidence: `${evidenceCount} chunks`,
    confidence: declined ? "Low, declined to answer" : "High",
    executionTimeMs,
  };
}

export function useVideoResearch(video: VideoMeta) {
  const [question, setQuestion] = useState("");
  const [entries, setEntries] = useState<ResearchEntry[]>([]);
  const [showDevView, setShowDevView] = useState(false);

  const researchEndRef = useRef<HTMLDivElement | null>(null);

  const submitQuestion = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      setQuestion("");
      const entryId = `entry-${Date.now()}`;

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

      const resolve = (patch: Partial<ResearchEntry>) => {
        setEntries((prev) =>
          prev.map((e) => (e.id === entryId ? { ...e, isLoading: false, ...patch } : e))
        );
        historyStore.add({ ...video, questionCount: video.questionCount + 1 });
      };

      const settings = getStoredSettings();
      const startedAt = performance.now();

      if (settings.useBackendApi) {
        try {
          const res = await apiClient.queryVideo(video.id, trimmed);
          const evidence: EvidenceChunk[] = res.evidence.map((ev, i) => ({
            id: `ev-${entryId}-${i}`,
            startTimestamp: formatSeconds(ev.start),
            endTimestamp: formatSeconds(ev.end),
            startSeconds: ev.start,
            endSeconds: ev.end,
            text: ev.text,
            relevance: mapScoreToRelevance(ev.relevance_score),
            relevanceScore: ev.relevance_score,
          }));

          const declined = !res.answer || evidence.length === 0;
          resolve({
            answer: declined ? null : res.answer,
            evidence: declined ? [] : evidence,
            noAnswer: declined,
            retrievalDetails: buildRetrievalDetails(
              trimmed,
              evidence.length,
              declined,
              Math.round(performance.now() - startedAt)
            ),
          });

          return;
        } catch {
          // Backend unavailable, fall through to the bundled demo answers.
        }
      }

      await new Promise((r) => setTimeout(r, MOCK_ANSWER_DELAY_MS));

      const match = findDemoAnswer(trimmed);
      resolve({
        answer: match?.answer ?? null,
        evidence: match?.evidence ?? [],
        noAnswer: !match,
        retrievalDetails: buildRetrievalDetails(
          trimmed,
          match?.evidence.length ?? 0,
          !match,
          Math.round(performance.now() - startedAt)
        ),
      });
    },
    [video]
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
    showSuggestions: entries.length === 0,
    showDevView,
    setShowDevView,
    researchEndRef,
    submitQuestion,
    suggestedQuestions,
  };
}
