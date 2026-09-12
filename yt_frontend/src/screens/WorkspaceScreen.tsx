import { useCallback, useMemo, useRef, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Maximize2, Minimize2, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { VideoPlayer } from "@/components/video/VideoPlayer";
import { VideoPreview } from "@/components/video/VideoPreview";
import { VideoMetaPanel } from "@/components/video/VideoMetaPanel";
import { ResearchPanel } from "@/components/research/ResearchPanel";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useVideoResearch } from "@/hooks/useVideoResearch";
import { getVideoById } from "@/services/storage";
import { ROUTES } from "@/routes/paths";
import { WORKSPACE_LABELS } from "@/lib/constants";
import { cn, hasPlayableSource } from "@/lib/utils";
import { VideoProps } from "@/types";

export function WorkspaceScreen() {
  const { videoId = "" } = useParams();
  const video = useMemo(() => getVideoById(videoId), [videoId]);

  if (!video) return <Navigate to={ROUTES.home} replace />;

  // Remounts on video change, so research state never leaks between videos.
  return <Workspace key={video.id} video={video} />;
}

interface Playback {
  seconds: number;
  cue: number;
}

function Workspace({ video }: VideoProps) {
  const { startNewAnalysis } = useAppNavigation();
  const {
    question,
    setQuestion,
    entries,
    isSubmitting,
    showEmptyState,
    showDevView,
    setShowDevView,
    researchEndRef,
    submitQuestion,
    retryEntry,
  } = useVideoResearch(video);

  const playable = hasPlayableSource(video.url);
  const [playback, setPlayback] = useState<Playback | null>(null);
  const [isTheater, setIsTheater] = useState(false);

  const playerRef = useRef<HTMLElement | null>(null);

  const playFrom = useCallback(
    (seconds: number) => {
      if (!playable) return;
      setPlayback((current) => ({ seconds, cue: (current?.cue ?? 0) + 1 }));

      playerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    },
    [playable]
  );

  return (
    <div className="flex flex-1 flex-col pt-1 lg:min-h-0 lg:overflow-hidden">
      <header className="shrink-0">
        <PageContainer className="flex justify-end gap-2 pb-2">
          <Button variant="outline" size="sm" onClick={startNewAnalysis}>
            <Plus className="h-3.5 w-3.5" />
            {WORKSPACE_LABELS.newAnalysis}
          </Button>
          <Button
            variant="outline"
            size="sm"
            aria-pressed={showDevView}
            onClick={() => setShowDevView((open) => !open)}
            className={cn(showDevView && "border-success/20 bg-success/8 text-success")}
          >
            {WORKSPACE_LABELS.devMode}
          </Button>
        </PageContainer>
      </header>

      <PageContainer className="flex flex-1 flex-col pb-4 lg:min-h-0 lg:overflow-hidden">
        <div
          className={cn(
            "rounded-card border-border flex flex-1 flex-col overflow-hidden border lg:grid lg:min-h-0",
            isTheater ? "lg:grid-cols-[64%_minmax(0,1fr)]" : "lg:grid-cols-[42%_minmax(0,1fr)]"
          )}
        >
          <section
            ref={playerRef}
            className="border-border border-b p-5 lg:overflow-y-auto lg:border-r lg:border-b-0"
          >
            <div className={cn("mx-auto lg:max-w-none", isTheater ? "max-w-none" : "max-w-panel")}>
              {playback ? (
                <VideoPlayer
                  key={playback.cue}
                  videoId={video.id}
                  title={video.title}
                  startSeconds={playback.seconds}
                />
              ) : (
                <VideoPreview video={video} onPlay={playable ? () => playFrom(0) : undefined} />
              )}

              {playable && (
                <div className="flex justify-end pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-pressed={isTheater}
                    onClick={() => setIsTheater((open) => !open)}
                  >
                    {isTheater ? (
                      <Minimize2 className="h-3.5 w-3.5" />
                    ) : (
                      <Maximize2 className="h-3.5 w-3.5" />
                    )}
                    {isTheater ? WORKSPACE_LABELS.theaterOff : WORKSPACE_LABELS.theaterOn}
                  </Button>
                </div>
              )}

              <div className="pt-4">
                <VideoMetaPanel video={video} />
              </div>
            </div>
          </section>

          <section className="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
            <ResearchPanel
              entries={entries}
              question={question}
              onQuestionChange={setQuestion}
              onSubmitQuestion={submitQuestion}
              onRetryEntry={retryEntry}
              onWatchFrom={playable ? playFrom : undefined}
              isSubmitting={isSubmitting}
              showEmptyState={showEmptyState}
              showDevView={showDevView}
              endRef={researchEndRef}
            />
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
