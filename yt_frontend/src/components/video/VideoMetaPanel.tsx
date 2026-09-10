import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { hasPlayableSource } from "@/lib/utils";
import { VideoProps } from "@/types";

export function VideoMetaPanel({ video }: VideoProps) {
  const playable = hasPlayableSource(video.url);

  return (
    <div>
      <h2 className="mb-1.5 text-base leading-snug font-semibold text-foreground">{video.title}</h2>
      <p className="mb-3 text-xs text-foreground-muted">
        {video.channel} · <span className="font-mono-ts">{video.duration}</span> · {video.language}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {video.isIndexed && (
          <Badge variant="success">
            <Check className="h-3 w-3" />
            Indexed
          </Badge>
        )}
        {playable ? (
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-muted hover:text-foreground focus-visible:outline-primary-accent flex items-center gap-1 rounded-sm text-xs no-underline transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Open in YouTube
            <ExternalLink className="h-3 w-3" />
          </a>
        ) : (
          <Badge variant="muted" size="sm">
            Demo content
          </Badge>
        )}
      </div>

      <div className="mt-6 border-t border-border pt-5">
        <EyebrowLabel className="mb-2">Overview</EyebrowLabel>
        <p className="text-sm leading-relaxed text-foreground-soft">{video.summary}</p>
      </div>
    </div>
  );
}
