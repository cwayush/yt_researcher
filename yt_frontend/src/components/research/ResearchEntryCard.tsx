import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { AnswerLoading } from "@/components/research/AnswerLoading";
import { AnswerText } from "@/components/research/AnswerText";
import { EvidenceCard } from "@/components/research/EvidenceCard";
import { NoEvidenceState } from "@/components/research/NoEvidenceState";
import { EVIDENCE_DISPLAY_LIMIT } from "@/lib/constants";
import { ResearchEntry } from "@/types";

interface ResearchEntryCardProps {
  entry: ResearchEntry;
  onRetry: (entryId: string) => void;
  onWatchFrom?: (seconds: number) => void;
  retryDisabled?: boolean;
}

export function ResearchEntryCard({
  entry,
  onRetry,
  onWatchFrom,
  retryDisabled,
}: ResearchEntryCardProps) {
  const shownEvidence = entry.evidence.slice(0, EVIDENCE_DISPLAY_LIMIT);

  return (
    <article>
      <EyebrowLabel className="mb-2">Question</EyebrowLabel>
      <p className="text-foreground mb-5 text-base font-medium">{entry.question}</p>

      {entry.isLoading && <AnswerLoading />}

      {!entry.isLoading && entry.error && (
        <Card role="alert">
          <p className="text-foreground-soft mb-4 text-sm leading-relaxed">{entry.error}</p>
          <Button
            variant="outline"
            size="sm"
            disabled={retryDisabled}
            onClick={() => onRetry(entry.id)}
          >
            Try again
          </Button>
        </Card>
      )}

      {!entry.isLoading && !entry.error && entry.noAnswer && <NoEvidenceState />}

      {!entry.isLoading && entry.answer && (
        <>
          <EyebrowLabel className="mb-3">Answer</EyebrowLabel>
          <AnswerText answer={entry.answer} />

          {shownEvidence.length > 0 && (
            <>
              <EyebrowLabel className="mb-3">Evidence</EyebrowLabel>
              <div className="flex flex-col gap-3">
                {shownEvidence.map((evidence, i) => (
                  <EvidenceCard
                    key={evidence.id}
                    evidence={evidence}
                    index={i}
                    onWatchFrom={onWatchFrom}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </article>
  );
}
