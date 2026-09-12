import { Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { hasPlayableSource } from "@/lib/utils";
import { VideoProps } from "@/types";

export function VideoMetaPanel({ video }: VideoProps) {
  const playable = hasPlayableSource(video.url);

  // Metadata lookup is best-effort on the backend, so skip whatever is missing
  // rather than printing separators around blanks.
  const facts = [video.channel, video.duration, video.language].filter(Boolean);

  return (
    <div>
      <h2 className="text-foreground mb-1.5 text-base leading-snug font-semibold">{video.title}</h2>
      {facts.length > 0 && (
        <p className="text-foreground-muted mb-3 text-xs">
          {facts.map((fact, i) => (
            <span key={fact}>
              {i > 0 && " · "}
              <span className={fact === video.duration ? "font-mono-ts" : undefined}>{fact}</span>
            </span>
          ))}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        {video.isIndexed && (
          <Badge variant="success">
            <Check className="h-3 w-3" />
            Indexed
          </Badge>
        )}
        {playable && (
          <a
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground-muted hover:text-foreground focus-visible:outline-primary-accent flex items-center gap-1 rounded-sm text-xs no-underline transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            Open in YouTube
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      {video.summary && (
        <div className="border-border mt-6 border-t pt-5">
          <EyebrowLabel className="mb-2">Overview</EyebrowLabel>
          <p className="text-foreground-soft text-sm leading-relaxed">{video.summary}</p>
        </div>
      )}
    </div>
  );
}
