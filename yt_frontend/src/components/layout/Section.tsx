import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const sectionVariants = cva("px-6", {
  variants: {
    tone: {
      default: "",
      surface: "bg-surface",
      forest: "bg-forest",
    },
    border: {
      none: "",
      y: "border-border border-y",
      top: "border-border border-t",
    },
    spacing: {
      default: "section-y",
      compact: "py-16",
    },
  },
  defaultVariants: { tone: "default", border: "none", spacing: "default" },
});

interface SectionProps extends VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
  width?: "content" | "narrow";
  className?: string;
  innerClassName?: string;
}

export function Section({
  children,
  tone,
  border,
  spacing,
  width = "content",
  className,
  innerClassName,
}: SectionProps) {
  return (
    <section className={cn(sectionVariants({ tone, border, spacing }), className)}>
      <div
        className={cn("mx-auto", width === "narrow" ? "max-w-2xl" : "max-w-4xl", innerClassName)}
      >
        {children}
      </div>
    </section>
  );
}
