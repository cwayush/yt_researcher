import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, workspacePath } from "@/routes/paths";

// Every screen wires its navigation through this hook so the intents stay
// identical wherever they are triggered from.
export function useAppNavigation() {
  const navigate = useNavigate();

  const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);
  const goHistory = useCallback(() => navigate(ROUTES.history), [navigate]);

  const goWorkspace = useCallback(
    (videoId: string, options?: { replace?: boolean }) =>
      navigate(workspacePath(videoId), { replace: options?.replace }),
    [navigate]
  );

  // Leaves the current video for a fresh one. Home remounts and its URL
  // field takes focus, so the user can paste straight away.
  const startNewAnalysis = useCallback(() => navigate(ROUTES.home), [navigate]);

  const startAnalysis = useCallback(
    (url: string) => {
      navigate(ROUTES.processing, { state: { url } });
    },
    [navigate]
  );

  return { goHome, goHistory, goWorkspace, startNewAnalysis, startAnalysis };
}
