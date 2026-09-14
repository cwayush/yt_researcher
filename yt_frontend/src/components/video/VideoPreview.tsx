import { useState } from "react";
import { Play } from "lucide-react";
import { VideoProps } from "@/types";

interface VideoPreviewProps extends VideoProps {
  onPlay?: () => void;
}

export function VideoPreview({ video, onPlay }: VideoPreviewProps) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false);

  const overlay = (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 transition-transform duration-150 group-hover:scale-105">
      <Play className="fill-black text-black size-4.5" />
    </span>
  );

  return (
    <div className="rounded-card bg-foreground relative aspect-video overflow-hidden">
      {!thumbnailFailed && (
        <img
          src={video.thumbnail}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setThumbnailFailed(true)}
        />
      )}

      {onPlay ? (
        <button
          type="button"
          onClick={onPlay}
          aria-label={`Play ${video.title}`}
          className="group focus-visible:outline-primary-accent absolute inset-0 flex cursor-pointer items-center justify-center border-none bg-black/35 focus-visible:outline-2 focus-visible:-outline-offset-2"
        >
          {overlay}
        </button>
      ) : (
        <span className="absolute inset-0 flex items-center justify-center bg-black/35">
          {overlay}
        </span>
      )}
    </div>
  );
}
