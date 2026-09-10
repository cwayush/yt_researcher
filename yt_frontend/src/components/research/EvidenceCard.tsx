import { Play } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";
import { hasPlayableSource, youTubeTimestampUrl } from "@/lib/utils";
import { EvidenceChunk } from "@/types";

interface EvidenceCardProps {
  evidence: EvidenceChunk;
  index: number;
  videoUrl: string;
}

export function EvidenceCard({ evidence, index, videoUrl }: EvidenceCardProps) {
  const playable = hasPlayableSource(videoUrl);
  const Tag = playable ? "a" : "span";

  return (
    <Card padding="sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <EyebrowLabel as="span">Evidence {String(index + 1).padStart(2, "0")}</EyebrowLabel>
          <Badge variant={evidence.relevance === "High" ? "success" : "warning"} size="sm">
            {evidence.relevance}
          </Badge>
        </div>
        <span className="font-mono-ts shrink-0 text-xs text-primary-accent">
          {evidence.startTimestamp}–{evidence.endTimestamp}
        </span>
      </div>

      <blockquote className="mb-3 border-l-2 border-border pl-3 text-sm leading-relaxed text-foreground-soft italic">
        &ldquo;{evidence.text}&rdquo;
      </blockquote>

      <Tag
        {...(playable
          ? {
              href: youTubeTimestampUrl(videoUrl, evidence.startSeconds),
              target: "_blank",
              rel: "noopener noreferrer",
            }
          : { title: "Demo video, no source to open" })}
        className="text-foreground-muted inline-flex items-center gap-1.5 rounded-sm text-xs font-medium no-underline transition-colors duration-150 data-[playable=true]:hover:text-foreground"
        data-playable={playable}
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-surface-muted">
          <Play className="h-2.5 w-2.5 fill-current" />
        </span>
        Watch from {evidence.startTimestamp}
      </Tag>
    </Card>
  );
}
