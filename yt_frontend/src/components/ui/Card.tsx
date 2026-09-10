import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva("rounded-card border", {
  variants: {
    tone: {
      default: "border-border bg-surface",
      sunken: "border-border bg-background",
      success: "border-success/20 bg-success/8",
      plain: "",
    },
    padding: {
      none: "p-0",
      sm: "p-4",
      md: "p-5",
      lg: "p-6",
    },
    interactive: {
      true: "transition-[border-color,background-color] duration-150 hover:border-border-strong",
      false: "",
    },
  },
  defaultVariants: { tone: "default", padding: "md", interactive: false },
});

export interface CardProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "color">, VariantProps<typeof cardVariants> {}

export function Card({ className, tone, padding, interactive, ...props }: CardProps) {
  return <div className={cn(cardVariants({ tone, padding, interactive, className }))} {...props} />;
}
