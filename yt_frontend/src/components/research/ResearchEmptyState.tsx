import { Card } from "@/components/ui/Card";

// Shown before the first question. Deliberately offers no canned prompts: a
// useful question has to be about this video's actual content.
export function ResearchEmptyState() {
  return (
    <Card tone="sunken">
      <p className="text-foreground-soft text-sm leading-relaxed">
        Ask about anything covered in the video. Every answer comes back with the transcript
        passages it was drawn from, so you can check it against the source.
      </p>
    </Card>
  );
}
