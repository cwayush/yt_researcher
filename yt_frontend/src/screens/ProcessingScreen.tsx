import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Check } from "lucide-react";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { ProcessingErrorState } from "@/components/processing/ProcessingErrorState";
import { ProcessingStages } from "@/components/processing/ProcessingStages";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useVideoIndexing } from "@/hooks/useVideoIndexing";
import { ROUTES, ProcessingLocationState } from "@/routes/paths";
import { APP_NAME, INDEX_ACTION_COPY, PROCESSING_COMPLETE_MS } from "@/lib/constants";

export function ProcessingScreen() {
  const { state } = useLocation() as { state: ProcessingLocationState | null };
  const pendingUrl = state?.url ?? null;

  const { goHome, goWorkspace } = useAppNavigation();
  const { phase, video, action, error, retry } = useVideoIndexing(pendingUrl);

  const readyVideoId = phase === "ready" ? (video?.id ?? null) : null;

  useEffect(() => {
    if (!readyVideoId) return;

    const timer = setTimeout(
      () => goWorkspace(readyVideoId, { replace: true }),
      PROCESSING_COMPLETE_MS
    );

    return () => clearTimeout(timer);
  }, [readyVideoId, goWorkspace]);

  if (!pendingUrl) return <Navigate to={ROUTES.home} replace />;

  return (
    <div className="bg-background grid min-h-screen place-items-center px-5 py-10 sm:px-6">
      <div className="rounded-panel border-border bg-surface max-w-page w-full border p-6 sm:p-10 md:p-12">
        {phase === "error" ? (
          <div className="max-w-measure">
            <ProcessingErrorState message={error ?? ""} onRetry={retry} onGoHome={goHome} />
          </div>
        ) : (
          <>
            <div className="md:divide-border grid gap-10 md:grid-cols-2 md:gap-0 md:divide-x">
              <div className="md:pr-12 lg:pr-16">
                <EyebrowLabel className="mb-6">{APP_NAME}</EyebrowLabel>

                <h1 className="font-display text-foreground text-display mb-4">
                  Preparing your research workspace.
                </h1>

                <p className="text-foreground-soft mb-2 text-base leading-relaxed">
                  We&apos;re reading the transcript and building the searchable index.
                </p>
                <p className="text-foreground-muted text-sm leading-relaxed">
                  This can take a minute for a longer video.
                </p>
              </div>

              <div className="md:pl-12 lg:pl-16">
                <ProcessingStages isReady={phase === "ready"} />
              </div>
            </div>

            {phase === "ready" && action && (
              <p className="rounded-card border-success/15 bg-success/8 text-success mt-10 flex items-center gap-2 border px-4 py-3 text-sm font-medium">
                <Check className="h-4 w-4 shrink-0" />
                {INDEX_ACTION_COPY[action]}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
