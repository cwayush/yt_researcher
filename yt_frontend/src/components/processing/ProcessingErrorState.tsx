import { Button } from "@/components/ui/Button";

interface ProcessingErrorStateProps {
  message: string;
  onRetry: () => void;
  onGoHome: () => void;
}

export function ProcessingErrorState({ message, onRetry, onGoHome }: ProcessingErrorStateProps) {
  return (
    <div role="alert">
      <h1 className="font-display text-foreground text-display mb-3">
        We couldn&apos;t open that.
      </h1>
      <p className="text-foreground-soft mb-8 text-base leading-relaxed">{message}</p>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onRetry}>Try again</Button>
        <Button variant="outline" onClick={onGoHome}>
          Back to home
        </Button>
      </div>
    </div>
  );
}
