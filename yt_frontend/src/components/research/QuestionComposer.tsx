import { KeyboardEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Field, controlClass } from "@/components/ui/Field";
import { MIN_QUESTION_LENGTH } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface QuestionComposerProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

const MAX_HEIGHT_PX = 120;

// Auto-growing question box; Enter submits, Shift+Enter inserts a newline.
// Only submitting is blocked while a question is in flight, so the thread above
// stays readable and the next question can already be typed.
export function QuestionComposer({
  value,
  onChange,
  onSubmit,
  isSubmitting,
}: QuestionComposerProps) {
  const canSubmit = value.trim().length >= MIN_QUESTION_LENGTH && !isSubmitting;

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  }

  return (
    <div className="border-t border-border px-5 py-4 md:px-6">
      <Field className="items-end border">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={(e) => {
            const el = e.currentTarget;
            el.style.height = "auto";
            el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT_PX)}px`;
          }}
          placeholder="Ask anything about this video..."
          aria-label="Ask a question about this video"
          rows={1}
          className={cn(controlClass, "resize-none font-sans text-sm leading-normal")}
          style={{ maxHeight: MAX_HEIGHT_PX, overflowY: "auto" }}
        />
        <Button
          onClick={onSubmit}
          disabled={!canSubmit}
          variant="solid"
          size="sm"
          className="shrink-0 font-semibold"
        >
          {isSubmitting ? "Asking" : "Ask"}
        </Button>
      </Field>
      <p className="mt-2 text-center text-xs text-foreground-muted">
        Press Enter to ask · Shift+Enter for newline
      </p>
    </div>
  );
}
