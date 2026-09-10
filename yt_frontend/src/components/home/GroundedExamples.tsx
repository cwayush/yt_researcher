import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { NoEvidenceState } from "@/components/research/NoEvidenceState";
import { GROUNDED_EXAMPLES } from "@/data/content";

const { supported, insufficient } = GROUNDED_EXAMPLES;

export function GroundedExamples() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card tone="success" padding="lg">
        <Badge variant="success" size="lg" className="mb-4">
          {supported.badge}
        </Badge>
        <p className="text-foreground mb-3 text-sm font-medium">{supported.question}</p>
        <p className="text-foreground-soft mb-4 text-sm leading-relaxed">{supported.answer}</p>
        <div className="rounded-card border-success/20 bg-success/8 border p-3 text-xs">
          <div className="mb-1 flex justify-between">
            <span className="text-success">{supported.evidenceLabel}</span>
            <span className="font-mono-ts text-success">{supported.timestamp}</span>
          </div>
          <p className="text-foreground-soft">&ldquo;{supported.quote}&rdquo;</p>
        </div>
      </Card>

      <Card padding="lg">
        <Badge variant="warning" size="lg" className="mb-4">
          {insufficient.badge}
        </Badge>
        <p className="text-foreground mb-4 text-sm font-medium">{insufficient.question}</p>
        <NoEvidenceState />
      </Card>
    </div>
  );
}
