import { Skeleton } from "@/components/ui/Skeleton";

const BAR_WIDTHS = ["100%", "80%", "90%"];

export function AnswerLoading() {
  return (
    <div>
      <p className="text-foreground-muted mb-4 text-sm italic">Researching this video...</p>
      <div className="flex flex-col gap-2" role="status" aria-label="Generating answer">
        {BAR_WIDTHS.map((width, i) => (
          <Skeleton key={width} className="h-3" style={{ width, animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
    </div>
  );
}
