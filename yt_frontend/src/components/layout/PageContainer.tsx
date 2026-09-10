import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Matches the navbar geometry so page content lines up with the logo at any
// width: --container-shell is the page measure plus the navbar gutter, and
// px-9 is that gutter plus the navbar's own padding. Deliberately one
// element, since an extra wrapper breaks the workspace flex height chain.
export function PageContainer({ children, className }: PageContainerProps) {
  return <div className={cn("mx-auto w-full max-w-shell px-9", className)}>{children}</div>;
}
