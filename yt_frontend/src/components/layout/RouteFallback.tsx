import { PageContainer } from "@/components/layout/PageContainer";
import { Skeleton } from "@/components/ui/Skeleton";

const BAR_WIDTHS = ["45%", "70%", "60%"];

// Shown while a route's chunk loads. Quiet on purpose: on a fast connection it
// is on screen for a frame or two.
export function RouteFallback() {
  return (
    <PageContainer className="flex-1 py-16">
      <Skeleton className="mb-6 h-9 w-64" />
      <div className="flex max-w-measure flex-col gap-3">
        {BAR_WIDTHS.map((width, i) => (
          <Skeleton key={width} className="h-3" style={{ width, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </PageContainer>
  );
}
