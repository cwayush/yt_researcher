import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex cursor-pointer items-center justify-center gap-1.5 font-medium select-none",
    "transition-[background-color,border-color,color,opacity,transform] duration-150",
    "focus-visible:outline-primary-accent focus-visible:outline-2 focus-visible:outline-offset-2",
    "disabled:pointer-events-none disabled:cursor-default disabled:opacity-45",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground border-primary-border border hover:bg-primary-hover active:scale-98",
        solid: "bg-foreground text-background hover:bg-foreground/90 active:scale-98",
        outline:
          "border-border text-foreground-soft hover:bg-surface-muted hover:text-foreground border bg-transparent",
        ghost: "text-foreground-soft hover:bg-surface-muted hover:text-foreground bg-transparent",
        muted: "bg-surface-muted text-foreground-muted",
        link: "text-foreground-muted hover:text-foreground bg-transparent underline underline-offset-3",
      },
      size: {
        sm: "rounded-control px-3 py-1.5 text-xs",
        md: "rounded-control px-3.5 py-1.5 text-sm",
        lg: "rounded-card px-5 py-2.5 text-sm font-semibold",
        bare: "p-0 text-sm",
        icon: "rounded-control h-8 w-8 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
);

Button.displayName = "Button";
