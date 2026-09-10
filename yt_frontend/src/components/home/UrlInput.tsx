import { useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Field, controlClass } from "@/components/ui/Field";
import { YouTubeGlyph } from "@/components/home/YouTubeGlyph";
import { cn, isValidYouTubeUrl } from "@/lib/utils";

type UrlState = "empty" | "valid" | "invalid" | "submitting";

interface UrlInputProps {
  onAnalyze: (url: string) => void;
  // Hero sizing: larger padding, radius and type.
  large?: boolean;
  autoFocus?: boolean;
}

const TONE_BY_STATE = {
  empty: "default",
  valid: "valid",
  invalid: "invalid",
  submitting: "active",
} as const;

export function UrlInput({ onAnalyze, large = false, autoFocus }: UrlInputProps) {
  const [url, setUrl] = useState("");
  const [state, setState] = useState<UrlState>("empty");

  function handleChange(value: string) {
    setUrl(value);
    if (!value.trim()) setState("empty");
    else setState(isValidYouTubeUrl(value) ? "valid" : "invalid");
  }

  function handleSubmit() {
    if (state !== "valid") return;
    setState("submitting");
    onAnalyze(url);
  }

  const submitting = state === "submitting";

  return (
    <div className="w-full">
      <Field className="border" tone={TONE_BY_STATE[state]} size="md">
        <YouTubeGlyph />

        <input
          type="url"
          value={url}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={submitting}
          placeholder="Paste YouTube URL..."
          autoFocus={autoFocus}
          aria-label="YouTube video URL"
          aria-invalid={state === "invalid"}
          className={cn(controlClass, large ? "text-base" : "text-body-sm")}
        />

        {url && !submitting && (
          <button
            type="button"
            onClick={() => handleChange("")}
            className="text-foreground-muted hover:text-foreground focus-visible:outline-primary-accent shrink-0 cursor-pointer rounded-sm border-none bg-transparent p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
            aria-label="Clear URL"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <Button
          onClick={handleSubmit}
          disabled={state !== "valid" && !submitting}
          variant={submitting ? "primary" : "solid"}
          size={"md"}
          className="shrink-0 font-semibold"
        >
          {submitting ? "Analyzing..." : <>Analyze</>}
        </Button>
      </Field>

      {state === "invalid" && (
        <p className="text-danger mt-2 flex items-center gap-1.5 pl-1 text-sm" role="alert">
          That doesn&apos;t look like a valid YouTube URL.
        </p>
      )}
      {state === "valid" && (
        <p className="text-success mt-2 flex items-center gap-1.5 pl-1 text-sm">
          <Check className="h-3.5 w-3.5 shrink-0" />
          YouTube URL detected
        </p>
      )}
    </div>
  );
}
