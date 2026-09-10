import { RETRIEVAL_DETAIL_LABELS } from "@/lib/constants";
import { RetrievalDetails } from "@/types";

interface RetrievalDetailsPanelProps {
  details: RetrievalDetails;
}

export function RetrievalDetailsPanel({ details }: RetrievalDetailsPanelProps) {
  const rows = Object.entries(RETRIEVAL_DETAIL_LABELS).map(([key, label]) => [
    label,
    details[key as keyof typeof RETRIEVAL_DETAIL_LABELS],
  ]);

  return (
    <div className="rounded-card border-terminal-border bg-terminal mb-6 border p-4 font-mono text-xs">
      <p className="text-terminal-foreground mb-3 text-xs font-semibold">
        Retrieval details, last query
      </p>
      <div className="flex flex-col gap-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-wrap gap-3">
            <span className="text-terminal-muted min-w-44">{label}</span>
            <span className="text-terminal-foreground break-all">{value}</span>
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <span className="text-terminal-muted min-w-44">Execution time</span>
          <span className="text-terminal-foreground">{details.executionTimeMs} ms</span>
        </div>
      </div>
    </div>
  );
}
