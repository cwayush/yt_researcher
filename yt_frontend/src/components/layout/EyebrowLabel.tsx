import { cn } from "@/lib/utils";

interface EyebrowLabelProps {
  children: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "h2" | "h3";
}

// Small uppercase tracked label used above every content block.
export function EyebrowLabel({ children, className, as: Tag = "p" }: EyebrowLabelProps) {
  return (
    <Tag
      className={cn(
        "text-xs font-semibold tracking-widest uppercase text-foreground-muted",
        className
      )}
    >
      {children}
    </Tag>
  );
}
