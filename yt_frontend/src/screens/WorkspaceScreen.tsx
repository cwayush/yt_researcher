import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PageContainer } from "@/components/layout/PageContainer";
import { VideoPreview } from "@/components/video/VideoPreview";
import { VideoMetaPanel } from "@/components/video/VideoMetaPanel";
import { ResearchPanel } from "@/components/research/ResearchPanel";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useVideoResearch } from "@/hooks/useVideoResearch";
import { getVideoById } from "@/services/storage";
import { ROUTES } from "@/routes/paths";
import { WORKSPACE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { VideoProps } from "@/types";

export function WorkspaceScreen() {
  const { videoId = "" } = useParams();
  const video = useMemo(() => getVideoById(videoId), [videoId]);

  if (!video) return <Navigate to={ROUTES.home} replace />;

  // Remounts on video change, so research state never leaks between videos.
  return <Workspace key={video.id} video={video} />;
}

function Workspace({ video }: VideoProps) {
  const { startNewAnalysis } = useAppNavigation();
  const {
    question,
    setQuestion,
    entries,
    showSuggestions,
    showDevView,
    setShowDevView,
    researchEndRef,
    submitQuestion,
    suggestedQuestions,
  } = useVideoResearch(video);

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
        <div className="rounded-card border-border flex flex-1 flex-col overflow-hidden border lg:grid lg:min-h-0 lg:grid-cols-[42%_minmax(0,1fr)]">
          <section className="border-border border-b p-5 lg:overflow-y-auto lg:border-r lg:border-b-0">
            <div className="mx-auto max-w-panel lg:max-w-none">
              <VideoPreview video={video} />
              <div className="pt-4">
                <VideoMetaPanel video={video} />
              </div>
            </div>
          </section>

          <section className="flex min-w-0 flex-1 flex-col lg:min-h-0 lg:overflow-hidden">
            <ResearchPanel
              entries={entries}
              videoUrl={video.url}
              question={question}
              onQuestionChange={setQuestion}
              onSubmitQuestion={submitQuestion}
              suggestedQuestions={suggestedQuestions}
              showSuggestions={showSuggestions}
              showDevView={showDevView}
              endRef={researchEndRef}
            />
          </section>
        </div>
      </PageContainer>
    </div>
  );
}
