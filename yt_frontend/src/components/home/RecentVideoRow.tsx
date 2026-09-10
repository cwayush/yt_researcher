import { VideoProps } from "@/types";

interface RecentVideoRowProps extends VideoProps {
  onOpen: () => void;
}

export function RecentVideoRow({ video, onOpen }: RecentVideoRowProps) {
  return (
    <button
      onClick={onOpen}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-card border border-border bg-transparent px-4 py-3.5 text-left transition-colors duration-150 hover:bg-background"
    >
      <img
        src={video.thumbnail}
        alt=""
        loading="lazy"
        className="h-9 w-14 shrink-0 rounded-control bg-surface-muted object-cover"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-foreground">{video.title}</p>
        <p className="mt-0.5 text-xs text-foreground-muted">
          {video.channel} · {video.duration} · {video.questionCount} questions ·{" "}
          {video.lastResearched}
        </p>
      </div>
      <span className="shrink-0 text-xs text-foreground-muted opacity-0 transition-opacity group-hover:opacity-100">
        Open →
      </span>
    </button>
  );
}
