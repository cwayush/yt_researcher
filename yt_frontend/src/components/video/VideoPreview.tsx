import { Play } from "lucide-react";
import { hasPlayableSource } from "@/lib/utils";
import { VideoProps } from "@/types";

export function VideoPreview({ video }: VideoProps) {
  const playable = hasPlayableSource(video.url);

  const overlay = (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 transition-transform duration-150 group-hover:scale-105">
      <Play className="fill-foreground text-foreground size-4.5" />
    </span>
  );

  return (
    <div className="rounded-card bg-foreground relative aspect-video overflow-hidden">
      <img src={video.thumbnail} alt="" className="h-full w-full object-cover" />
      {playable ? (
        <a
          href={video.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group focus-visible:outline-primary-accent absolute inset-0 flex items-center justify-center bg-black/35 focus-visible:outline-2 focus-visible:-outline-offset-2"
          aria-label={`Play ${video.title} on YouTube`}
        >
          {overlay}
        </a>
      ) : (
        <span
          className="absolute inset-0 flex items-center justify-center bg-black/35"
          title="Demo video, no source to open"
        >
          {overlay}
        </span>
      )}
    </div>
  );
}
