import React from "react";
import { X } from "lucide-react";
import { Field, controlClass, type FieldSize, type FieldTone } from "@/components/ui/Field";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  onClear?: () => void;
  tone?: FieldTone;
  fieldSize?: FieldSize;
  containerClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, containerClassName, icon, onClear, tone, fieldSize, value, ...props }, ref) => (
    <Field tone={tone} size={fieldSize} className={containerClassName}>
      {icon && <span className="text-foreground-muted shrink-0">{icon}</span>}
      <input
        ref={ref}
        value={value}
        className={cn(controlClass, "text-sm", className)}
        {...props}
      />
      {onClear && value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear"
          className="text-foreground-muted hover:text-foreground focus-visible:outline-primary-accent shrink-0 cursor-pointer rounded-sm border-none bg-transparent p-0.5 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
        >
          <X className="h-4 w-4" />
        </button>
      ) : null}
    </Field>
  )
);

Input.displayName = "Input";
