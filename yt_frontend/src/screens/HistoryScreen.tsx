import { useMemo, useState } from "react";
import { RotateCcw, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { PageContainer } from "@/components/layout/PageContainer";
import { HistoryCard } from "@/components/history/HistoryCard";
import { HistoryEmptyState } from "@/components/history/HistoryEmptyState";
import { ResetDataDrawer } from "@/components/history/ResetDataDrawer";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useDataReset } from "@/hooks/useDataReset";
import { useHistory } from "@/hooks/useHistory";
import { RESET_COPY } from "@/lib/constants";

export function HistoryScreen() {
  const { goHome, goWorkspace } = useAppNavigation();
  const { history, remove } = useHistory();
  const { reset, isResetting, error, clearError } = useDataReset();

  const [query, setQuery] = useState("");
  const [resetOpen, setResetOpen] = useState(false);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return history;
    return history.filter(
      (video) =>
        video.title.toLowerCase().includes(term) || video.channel.toLowerCase().includes(term)
    );
  }, [history, query]);

  const isEmpty = history.length === 0;

  function openReset() {
    clearError();
    setResetOpen(true);
  }

  function cancelReset() {
    if (isResetting) return;
    setResetOpen(false);
  }

  async function confirmReset() {
    const ok = await reset();
    if (ok) setResetOpen(false);
  }

  return (
    <PageContainer className="flex-1 py-16">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-foreground mb-2 text-display">Your research</h1>
          <p className="text-foreground-soft mb-2 text-base">
            Return to videos you&apos;ve already explored.
          </p>
          <p className="text-foreground-muted text-sm">
            {history.length} {history.length === 1 ? "video" : "videos"} analysed
          </p>
        </div>

        <Button
          variant="outline"
          onClick={openReset}
          disabled={isEmpty}
          title={isEmpty ? RESET_COPY.emptyHint : undefined}
          className="text-danger hover:text-danger border-danger/25 hover:bg-danger/8"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          {RESET_COPY.action}
        </Button>
      </div>

      {isEmpty ? (
        <HistoryEmptyState onStart={goHome} />
      ) : (
        <>
          <div className="mb-8 max-w-input">
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onClear={() => setQuery("")}
              icon={<Search className="h-4 w-4" />}
              placeholder="Search by title or channel..."
              aria-label="Search your research history"
            />
          </div>

          <EyebrowLabel as="h2" className="mb-4">
            {query.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Recent"}
          </EyebrowLabel>

          {results.length === 0 ? (
            <p className="text-foreground-muted border-border rounded-card border border-dashed px-6 py-12 text-center text-sm">
              No videos match &ldquo;{query.trim()}&rdquo;.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {results.map((video) => (
                <HistoryCard
                  key={video.id}
                  video={video}
                  onOpen={() => goWorkspace(video.id)}
                  onDelete={() => remove(video.id)}
                />
              ))}
            </div>
          )}
        </>
      )}

      <ResetDataDrawer
        open={resetOpen}
        isResetting={isResetting}
        error={error}
        onCancel={cancelReset}
        onConfirm={confirmReset}
      />
    </PageContainer>
  );
}
