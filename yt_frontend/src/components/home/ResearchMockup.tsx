import { Play } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EyebrowLabel } from "@/components/layout/EyebrowLabel";

// Static preview of the research panel for the landing page.
export function ResearchMockup() {
  return (
    <Card tone="sunken" className="rounded-panel">
      <div className="mb-5 flex items-center gap-3 rounded-card border-hairline border-primary-accent bg-surface px-4 py-3">
        <span className="flex-1 text-sm text-foreground-muted">
          What are the main limitations of RAG?
        </span>
        <span className="rounded-control bg-foreground text-background px-3 py-1.5 text-xs font-semibold">
          Ask
        </span>
      </div>

      <EyebrowLabel className="mb-2">Answer</EyebrowLabel>
      <p className="text-foreground mb-5 text-sm leading-relaxed">
        RAG retrieves what is semantically similar to the query, not necessarily what is logically
        required to answer it. Multi-hop reasoning, where the answer depends on chaining multiple
        pieces of evidence, remains difficult.
      </p>

      <EyebrowLabel className="mb-3">Evidence</EyebrowLabel>
      <Card padding="sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-widest text-foreground-muted uppercase">
            Evidence 01
          </span>
          <span className="font-mono-ts text-xs text-primary-accent">31:05–31:44</span>
        </div>
        <p className="mb-3 border-l-2 border-border pl-2.5 text-xs leading-relaxed text-foreground-soft italic">
          &ldquo;A common limitation is that RAG retrieves what&apos;s similar to the query, not
          what&apos;s logically necessary to answer it.&rdquo;
        </p>
        <span className="flex items-center gap-1.5 text-xs font-medium text-foreground-muted">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-muted">
            <Play className="h-2.5 w-2.5 fill-current" />
          </span>
          Jump to 31:05
        </span>
      </Card>
    </Card>
  );
}
