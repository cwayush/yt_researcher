import { Component, ReactNode } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/routes/paths";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// Catches a render-time crash anywhere in the routed tree so a single bad
// screen doesn't leave the user staring at a blank page.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <PageContainer className="flex-1 py-24">
        <h1 className="font-display text-foreground text-display mb-3">Something went wrong.</h1>
        <p className="text-foreground-soft mb-8 max-w-measure text-base leading-relaxed">
          We couldn&apos;t open this page. Returning home usually clears it.
        </p>
        <Button onClick={() => window.location.assign(ROUTES.home)}>Back to home</Button>
      </PageContainer>
    );
  }
}
