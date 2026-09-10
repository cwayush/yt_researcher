import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const fieldVariants = cva(
  "bg-surface border-hairline flex items-center gap-3 transition-[border-color,box-shadow] duration-200",
  {
    variants: {
      tone: {
        default: "border-border focus-within:border-primary-accent",
        valid: "border-success ring-success/15 ring-3",
        invalid: "border-danger",
        active: "border-primary-accent",
      },
      size: {
        md: "rounded-card px-3.5 py-2.75",
        lg: "rounded-panel px-4 py-3.5",
      },
    },
    defaultVariants: { tone: "default", size: "md" },
  }
);

export type FieldTone = VariantProps<typeof fieldVariants>["tone"];
export type FieldSize = VariantProps<typeof fieldVariants>["size"];

export const controlClass =
  "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-foreground-muted disabled:opacity-70";

export interface FieldProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof fieldVariants> {}

export function Field({ className, tone, size, ...props }: FieldProps) {
  return <div className={cn(fieldVariants({ tone, size, className }))} {...props} />;
}
