import { cn } from "@/lib/utils";

interface QuestionButtonProps {
  question: string;
  hoverTone?: "cream" | "surface";
  className?: string;
}

export function QuestionButton({ question, hoverTone = "cream", className }: QuestionButtonProps) {
  return (
    <button
      className={cn(
        "group cursor-pointer rounded-card border border-border bg-transparent px-3 py-2.5 text-left text-sm transition-colors duration-150",
        hoverTone === "cream" ? "hover:bg-background" : "hover:bg-surface",
        className
      )}
    >
      <span className="text-foreground-soft">{question}</span>
    </button>
  );
}
