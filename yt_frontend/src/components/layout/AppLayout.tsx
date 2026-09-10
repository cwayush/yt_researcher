import { useMemo } from "react";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { useAppNavigation } from "@/hooks/useAppNavigation";
import { getVideoById } from "@/services/storage";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/lib/utils";

// One sticky navbar for every routed screen. The workspace opts into
// panel scrolling on large viewports; everything else scrolls normally.
export function AppLayout() {
  const location = useLocation();
  const { goHome } = useAppNavigation();
  const workspaceMatch = useMatch(ROUTES.workspace);

  const videoId = workspaceMatch?.params.videoId;
  const videoTitle = useMemo(() => (videoId ? getVideoById(videoId)?.title : undefined), [videoId]);

  const isWorkspace = Boolean(workspaceMatch);

  return (
    <div
      className={cn(
        "bg-background flex min-h-screen flex-col",
        isWorkspace && "lg:h-screen lg:min-h-0 lg:overflow-hidden"
      )}
    >
      <Navbar videoTitle={videoTitle} onBack={isWorkspace ? goHome : undefined} />
      <div
        key={location.pathname}
        className={cn(
          "animate-fade-rise flex flex-1 flex-col",
          isWorkspace && "lg:min-h-0 lg:overflow-hidden"
        )}
      >
        <Outlet />
      </div>
    </div>
  );
}
