import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { VideoProps } from "@/types";

interface HistoryCardProps extends VideoProps {
  onOpen: () => void;
  onDelete: () => void;
}

export function HistoryCard({ video, onOpen, onDelete }: HistoryCardProps) {
  return (
    <div className="group relative flex items-start gap-5 rounded-card border border-border bg-transparent transition-colors duration-150 hover:bg-surface">
      <button
        onClick={onOpen}
        className="flex min-w-0 flex-1 cursor-pointer items-start gap-4 border-none bg-transparent p-5 pr-12 text-left sm:gap-5"
      >
        <img
          src={video.thumbnail}
          alt=""
          loading="lazy"
          className="h-12 w-20 shrink-0 rounded-card bg-surface-muted object-cover sm:h-14 sm:w-24"
        />
        <div className="min-w-0 flex-1 pt-0.5">
          <p className="mb-1 truncate text-base font-semibold text-foreground">{video.title}</p>
          <p className="mb-3 text-sm text-foreground-soft">{video.channel}</p>
          <div className="flex flex-wrap items-center gap-3">
            {video.duration && <Badge className="font-mono-ts">{video.duration}</Badge>}
            <span className="text-foreground-muted text-xs">
              {video.questionCount} {video.questionCount === 1 ? "question" : "questions"}
            </span>
            <span className="text-foreground-muted text-xs">{video.lastResearched}</span>
          </div>
        </div>
      </button>

      <button
        onClick={onDelete}
        className="absolute top-4 right-4 cursor-pointer rounded-control border-none bg-transparent p-2 text-foreground-muted opacity-0 transition-all hover:bg-surface-muted hover:text-danger focus-visible:opacity-100 group-hover:opacity-100"
        aria-label={`Delete analysis of ${video.title}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
