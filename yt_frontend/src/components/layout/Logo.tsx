import { BRAND } from "@/config/site";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export interface LogoProps {
  className?: string;
}

// Brand mark plus wordmark. The mark is public/logo.svg, the same file the
// browser uses as the favicon.
export function Logo({ className }: LogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <img src={BRAND.logo} alt="" aria-hidden="true" className="h-7 w-7 shrink-0" />
      <span className="font-display text-foreground text-base">{APP_NAME}</span>
    </span>
  );
}
