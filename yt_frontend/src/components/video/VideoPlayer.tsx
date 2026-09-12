import { formatSeconds } from "@/lib/utils";

interface VideoPlayerProps {
  videoId: string;
  title: string;
  startSeconds: number;
}

// YouTube's embed player, started at the evidence timestamp. Seeking to a new
// position is done by remounting with a different `key` rather than pulling in
// the IFrame Player API, which this only-jump-to-a-point use case doesn't need.
export function VideoPlayer({ videoId, title, startSeconds }: VideoPlayerProps) {
  const start = Math.max(0, Math.floor(startSeconds));

  const params = new URLSearchParams({
    start: String(start),
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
  });

  return (
    <div className="rounded-card bg-foreground relative aspect-video overflow-hidden">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${params}`}
        title={`${title}, playing from ${formatSeconds(start)}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  );
}
