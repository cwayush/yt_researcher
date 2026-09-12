import { RETRIEVAL_DETAIL_LABELS, RETRIEVAL_PIPELINE_SUMMARY } from "@/lib/constants";
import { RetrievalDetails } from "@/types";

interface RetrievalDetailsPanelProps {
  details: RetrievalDetails;
}

// Developer view. Every row is measured in this browser from the query
// response; the backend exposes no retrieval internals, so none are shown.
export function RetrievalDetailsPanel({ details }: RetrievalDetailsPanelProps) {
  const rows = Object.entries(RETRIEVAL_DETAIL_LABELS).map(([key, label]) => [
    label,
    details[key as keyof typeof RETRIEVAL_DETAIL_LABELS],
  ]);

  return (
    <div className="rounded-card border-terminal-border bg-terminal mb-6 border p-4 font-mono text-xs">
      <p className="text-terminal-foreground mb-1 text-xs font-semibold">
        Query details, last question
      </p>
      <p className="text-terminal-muted mb-3 text-xs">Measured in this browser</p>

      <div className="flex flex-col gap-1.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex flex-wrap gap-3">
            <span className="text-terminal-muted min-w-44">{label}</span>
            <span className="text-terminal-foreground break-all">{value}</span>
          </div>
        ))}
        <div className="flex flex-wrap gap-3">
          <span className="text-terminal-muted min-w-44">Round trip</span>
          <span className="text-terminal-foreground">{details.roundTripMs} ms</span>
        </div>
      </div>

      <p className="border-terminal-border text-terminal-muted mt-3 border-t pt-3 break-words">
        {RETRIEVAL_PIPELINE_SUMMARY}
      </p>
    </div>
  );
}
