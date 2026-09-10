import { Card } from "@/components/ui/Card";
import { NO_EVIDENCE_COPY } from "@/data/content";

// Shown when retrieval finds nothing solid enough to answer from.
export function NoEvidenceState() {
  return (
    <Card>
      <p className="font-display text-foreground mb-2 text-lg">{NO_EVIDENCE_COPY.title}</p>
      <p className="text-foreground-soft text-sm leading-relaxed">{NO_EVIDENCE_COPY.body}</p>
    </Card>
  );
}
