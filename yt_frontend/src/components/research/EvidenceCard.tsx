import { Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { cn } from "@/lib/utils";
import { EvidenceChunk, Relevance } from "@/types";

// Three bands of the backend's 0-1 reranker score need three distinct looks.
const RELEVANCE_VARIANTS: Record<Relevance, "success" | "warning" | "muted"> = {
  High: "success",
  Medium: "warning",
  Low: "muted",
};

interface EvidenceCardProps {
  evidence: EvidenceChunk;
  index: number;
  onWatchFrom?: (seconds: number) => void;
}

export function EvidenceCard({ evidence, index, onWatchFrom }: EvidenceCardProps) {
  const label = (
    <>
      <span className="bg-surface-muted flex h-5 w-5 shrink-0 items-center justify-center rounded-full">
        <Play className="h-2.5 w-2.5 fill-current" />
      </span>
      Watch from {evidence.startTimestamp}
    </>
  );

  const labelClass =
    "text-foreground-muted inline-flex items-center gap-1.5 rounded-sm text-xs font-medium";

  return (
    <Card padding="sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <EyebrowLabel as="span">Evidence {String(index + 1).padStart(2, "0")}</EyebrowLabel>
          <Badge variant={RELEVANCE_VARIANTS[evidence.relevance]} size="sm">
            {evidence.relevance}
          </Badge>
        </div>
        <span className="font-mono-ts text-primary-accent shrink-0 text-xs">
          {evidence.startTimestamp}–{evidence.endTimestamp}
        </span>
      </div>

      <blockquote className="border-border text-foreground-soft mb-3 line-clamp-3 border-l-2 pl-3 text-sm leading-relaxed italic">
        &ldquo;{evidence.text}&rdquo;
      </blockquote>

      {onWatchFrom ? (
        <button
          type="button"
          onClick={() => onWatchFrom(evidence.startSeconds)}
          className={cn(
            labelClass,
            "hover:text-foreground focus-visible:outline-primary-accent cursor-pointer border-none bg-transparent p-0 transition-colors duration-150 focus-visible:outline-2"
          )}
        >
          {label}
        </button>
      ) : (
        <span className={labelClass} title="No source video to play">
          {label}
        </span>
      )}
    </Card>
  );
}
