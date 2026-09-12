import { cn } from "@/lib/utils";

interface QuestionButtonProps {
  question: string;
  className?: string;
}

// Illustrative prompt chip on the landing page.
export function QuestionButton({ question, className }: QuestionButtonProps) {
  return (
    <div
      className={cn(
        "rounded-card border-border border bg-transparent px-3 py-2.5 text-left text-sm",
        className
      )}
    >
      <span className="text-foreground-soft">{question}</span>
    </div>
  );
}
