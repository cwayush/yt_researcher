import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { AnswerLoading } from "@/components/research/AnswerLoading";
import { EvidenceCard } from "@/components/research/EvidenceCard";
import { NoEvidenceState } from "@/components/research/NoEvidenceState";
import { ResearchEntry } from "@/types";

interface ResearchEntryCardProps {
  entry: ResearchEntry;
  videoUrl: string;
}

export function ResearchEntryCard({ entry, videoUrl }: ResearchEntryCardProps) {
  return (
    <article>
      <EyebrowLabel className="mb-2">Question</EyebrowLabel>
      <p className="mb-5 text-base font-medium text-foreground">{entry.question}</p>

      {entry.isLoading && <AnswerLoading />}

      {!entry.isLoading && entry.noAnswer && <NoEvidenceState />}

      {!entry.isLoading && entry.answer && (
        <>
          <EyebrowLabel className="mb-3">Answer</EyebrowLabel>
          <div className="text-foreground mb-6 text-sm leading-relaxed whitespace-pre-line">
            {entry.answer}
          </div>

          {entry.evidence.length > 0 && (
            <>
              <EyebrowLabel className="mb-3">Evidence</EyebrowLabel>
              <div className="flex flex-col gap-3">
                {entry.evidence.map((evidence, i) => (
                  <EvidenceCard
                    key={evidence.id}
                    evidence={evidence}
                    index={i}
                    videoUrl={videoUrl}
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
