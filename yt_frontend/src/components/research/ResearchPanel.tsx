import { RefObject } from "react";
import { QuestionComposer } from "@/components/research/QuestionComposer";
import { ResearchEntryCard } from "@/components/research/ResearchEntryCard";
import { RetrievalDetailsPanel } from "@/components/research/RetrievalDetailsPanel";
import { SuggestedQuestions } from "@/components/research/SuggestedQuestions";
import { ResearchEntry } from "@/types";

interface ResearchPanelProps {
  entries: ResearchEntry[];
  videoUrl: string;
  question: string;
  onQuestionChange: (value: string) => void;
  onSubmitQuestion: (question: string) => void;
  suggestedQuestions: readonly string[];
  showSuggestions: boolean;
  showDevView: boolean;
  endRef: RefObject<HTMLDivElement | null>;
}

export function ResearchPanel({
  entries,
  videoUrl,
  question,
  onQuestionChange,
  onSubmitQuestion,
  suggestedQuestions,
  showSuggestions,
  showDevView,
  endRef,
}: ResearchPanelProps) {
  const lastDetails = entries[entries.length - 1]?.retrievalDetails;

  return (
    <div className="flex min-w-0 flex-col lg:h-full lg:overflow-hidden">
      <div className="px-5 pt-6 pb-4 md:px-6 lg:flex-1 lg:overflow-y-auto">
        {showDevView && lastDetails && <RetrievalDetailsPanel details={lastDetails} />}

        <h2 className="font-display mb-1 text-2xl text-foreground">Research</h2>
        <p className="mb-6 text-sm text-foreground-muted">Ask anything about this video</p>

        {showSuggestions && <SuggestedQuestions questions={suggestedQuestions} />}

        <div className="flex flex-col gap-10">
          {entries.map((entry, i) => (
            <div key={entry.id}>
              {i > 0 && <div className="mb-10 h-px bg-surface-muted" />}
              <ResearchEntryCard entry={entry} videoUrl={videoUrl} />
            </div>
          ))}
        </div>

        <div ref={endRef} />
      </div>

      <div className="sticky bottom-0 z-30 shrink-0 bg-background lg:static">
        <QuestionComposer
          value={question}
          onChange={onQuestionChange}
          onSubmit={() => onSubmitQuestion(question)}
        />
      </div>
    </div>
  );
}
