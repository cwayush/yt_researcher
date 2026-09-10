import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { PageContainer } from "@/components/layout/PageContainer";
import { HistoryCard } from "@/components/history/HistoryCard";
import { HistoryEmptyState } from "@/components/history/HistoryEmptyState";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { useHistory } from "@/hooks/useHistory";

export function HistoryScreen() {
  const { goHome, goWorkspace } = useAppNavigation();
  const { history, remove } = useHistory();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return history;
    return history.filter(
      (video) =>
        video.title.toLowerCase().includes(term) || video.channel.toLowerCase().includes(term)
    );
  }, [history, query]);

  const isEmpty = history.length === 0;

  return (
    <PageContainer className="flex-1 py-16">
      <h1 className="font-display text-foreground mb-2 text-display">Your research</h1>
      <p className="text-foreground-soft mb-2 text-base">
        Return to videos you&apos;ve already explored.
      </p>
      <p className="text-foreground-muted mb-8 text-sm">
        {history.length} {history.length === 1 ? "video" : "videos"} analysed
      </p>

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
    </PageContainer>
  );
}
