import { Button } from "@/components/ui/Button";

interface HistoryEmptyStateProps {
  onStart: () => void;
}

export function HistoryEmptyState({ onStart }: HistoryEmptyStateProps) {
  return (
    <div className="rounded-card border border-border px-6 py-16 text-center">
      <p className="font-display mb-3 text-h3 leading-tight text-foreground">Start with a video.</p>
      <p className="mx-auto mb-6 max-w-70 text-sm leading-relaxed text-foreground-soft">
        Paste a YouTube link and begin your research.
      </p>
      <Button variant="primary" onClick={onStart}>
        New Analysis
      </Button>
    </div>
  );
}
