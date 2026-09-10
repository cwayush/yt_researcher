import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-md border text-xs font-medium whitespace-nowrap select-none",
  {
    variants: {
      variant: {
        success: "bg-success/8 text-success border-success/20",
        warning: "bg-warning/8 text-warning-ink border-warning/20",
        neutral: "bg-surface-muted text-foreground-soft border-transparent",
        muted: "text-foreground-muted border-transparent bg-transparent",
      },
      size: {
        sm: "px-1.5 py-0.5",
        md: "px-2 py-0.5",
        lg: "px-2 py-1 font-semibold",
      },
    },
    defaultVariants: { variant: "neutral", size: "md" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant, size, className }))} {...props} />;
}
