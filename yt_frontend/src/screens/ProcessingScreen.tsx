import { useCallback } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useProcessingPipeline } from "@/hooks/useProcessingPipeline";
import { ROUTES, ProcessingLocationState } from "@/routes/paths";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { demoVideo } from "@/data/demo";

export function ProcessingScreen() {
  const { state } = useLocation() as { state: ProcessingLocationState | null };
  const { goWorkspace } = useAppNavigation();

  const targetVideoId = demoVideo.id;

  const handleComplete = useCallback(
    () => goWorkspace(targetVideoId),
    [goWorkspace, targetVideoId]
  );

  const hasPendingUrl = Boolean(state?.url);
  const { steps, isComplete } = useProcessingPipeline(handleComplete, hasPendingUrl);

  if (!hasPendingUrl) return <Navigate to={ROUTES.home} replace />;

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-6">
      <div className="w-full max-w-md">
        <EyebrowLabel className="mb-6 tracking-widest">{APP_NAME}</EyebrowLabel>

        <h1 className="font-display mb-3 text-foreground text-display">Preparing your video.</h1>

        <p className="mb-10 text-base leading-relaxed text-foreground-soft">
          We&apos;re processing the transcript and
          <br />
          preparing it for research.
        </p>

        <ol className="flex flex-col gap-3.5">
          {steps.map((step) => (
            <li key={step.id} className="flex items-center gap-4">
              <span
                className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors duration-300",
                  step.status === "completed" && "bg-success",
                  step.status === "active" && "bg-warning",
                  step.status === "pending" && "border-hairline border-border"
                )}
              >
                {step.status === "completed" && <Check className="text-background h-2.5 w-2.5" />}
                {step.status === "active" && (
                  <span className="animate-pulse-subtle bg-background h-2 w-2 rounded-full" />
                )}
              </span>

              <span
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  step.status === "pending" ? "text-foreground-muted" : "text-foreground"
                )}
              >
                {step.label}
              </span>
            </li>
          ))}
        </ol>

        {isComplete && (
          <p
            className="mt-8 flex items-center gap-2 rounded-card border border-success/15 bg-success/8 px-4 py-3 text-sm font-medium text-success"
            role="status"
          >
            <Check className="h-4 w-4 shrink-0" />
            Video ready, entering workspace
          </p>
        )}
      </div>
    </div>
  );
}
