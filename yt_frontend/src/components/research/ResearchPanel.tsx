import { RefObject } from "react";
import { QuestionComposer } from "@/components/research/QuestionComposer";
import { ResearchEntryCard } from "@/components/research/ResearchEntryCard";
import { ResearchEmptyState } from "@/components/research/ResearchEmptyState";
import { RetrievalDetailsPanel } from "@/components/research/RetrievalDetailsPanel";
import { ResearchEntry } from "@/types";

interface ResearchPanelProps {
  entries: ResearchEntry[];
  question: string;
  onQuestionChange: (value: string) => void;
  onSubmitQuestion: (question: string) => void;
  onRetryEntry: (entryId: string) => void;
  onWatchFrom?: (seconds: number) => void;
  isSubmitting: boolean;
  showEmptyState: boolean;
  showDevView: boolean;
  endRef: RefObject<HTMLDivElement | null>;
}

export function ResearchPanel({
  entries,
  question,
  onQuestionChange,
  onSubmitQuestion,
  onRetryEntry,
  onWatchFrom,
  isSubmitting,
  showEmptyState,
  showDevView,
  endRef,
}: ResearchPanelProps) {
  const lastDetails = entries[entries.length - 1]?.retrievalDetails;

  return (
    <div className="flex min-w-0 flex-col lg:h-full lg:overflow-hidden">
      <div className="px-5 pt-6 pb-4 md:px-6 lg:flex-1 lg:overflow-y-auto">
        {showDevView && lastDetails && <RetrievalDetailsPanel details={lastDetails} />}

        <h2 className="font-display text-foreground mb-1 text-2xl">Research</h2>
        <p className="text-foreground-muted mb-6 text-sm">Ask anything about this video</p>

        {showEmptyState && <ResearchEmptyState />}

        <div className="flex flex-col gap-10">
          {entries.map((entry, i) => (
            <div key={entry.id}>
              {i > 0 && <div className="bg-surface-muted mb-10 h-px" />}
              <ResearchEntryCard
                entry={entry}
                onRetry={onRetryEntry}
                onWatchFrom={onWatchFrom}
                retryDisabled={isSubmitting}
              />
            </div>
          ))}
        </div>

        <div ref={endRef} />
      </div>

      <div className="bg-background sticky bottom-0 z-30 shrink-0 lg:static">
        <QuestionComposer
          value={question}
          onChange={onQuestionChange}
          onSubmit={() => onSubmitQuestion(question)}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
