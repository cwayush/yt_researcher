import { Check } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { PROCESSING_STEPS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ProcessingStagesProps {
  isReady: boolean;
}

// The indexing pipeline, shown as what the request is doing rather than as
// measured progress: /index reports nothing until it returns, so every stage
// stays neutral until the whole thing completes at once.
export function ProcessingStages({ isReady }: ProcessingStagesProps) {
  return (
    <div>
      <p role="status" className="sr-only">
        {isReady ? "Indexing complete. Opening your research workspace." : "Indexing in progress."}
      </p>

      {!isReady && <Skeleton className="mb-7 h-1 w-full rounded-full" />}

      <ol className={cn("flex flex-col gap-4", isReady && "mt-8")}>
        {PROCESSING_STEPS.map((step) => (
          <li key={step.id} className="flex items-center gap-4">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                isReady ? "bg-success" : "border-hairline border-border"
              )}
            >
              {isReady && <Check className="text-background h-2.5 w-2.5" />}
            </span>

            <span
              className={cn(
                "text-sm font-medium transition-colors duration-300",
                isReady ? "text-foreground" : "text-foreground-muted"
              )}
            >
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
