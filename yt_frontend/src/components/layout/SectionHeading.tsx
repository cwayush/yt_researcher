import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  description?: string;
  descriptionWidth?: string;
  className?: string;
}

export function SectionHeading({
  title,
  description,
  descriptionWidth = "max-w-measure",
  className,
}: SectionHeadingProps) {
  return (
    <div className={className}>
      <h2 className="font-display mb-4 text-foreground text-display">{title}</h2>
      {description && (
        <p className={cn("text-body-lg leading-relaxed text-foreground-soft", descriptionWidth)}>
          {description}
        </p>
      )}
    </div>
  );
}
