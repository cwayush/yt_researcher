import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES, workspacePath } from "@/routes/paths";
import { extractVideoId } from "@/lib/utils";

// Every screen wires its navigation through this hook so the intents stay
// identical wherever they are triggered from.
export function useAppNavigation() {
  const navigate = useNavigate();

  const goHome = useCallback(() => navigate(ROUTES.home), [navigate]);
  const goHistory = useCallback(() => navigate(ROUTES.history), [navigate]);

  const goWorkspace = useCallback(
    (videoId: string) => navigate(workspacePath(videoId)),
    [navigate]
  );

  // Leaves the current video for a fresh one. Home remounts and its URL
  // field takes focus, so the user can paste straight away.
  const startNewAnalysis = useCallback(() => navigate(ROUTES.home), [navigate]);

  const startAnalysis = useCallback(
    (url: string) => {
      navigate(ROUTES.processing, {
        state: { url, videoId: extractVideoId(url) ?? "" },
      });
    },
    [navigate]
  );

  return { goHome, goHistory, goWorkspace, startNewAnalysis, startAnalysis };
}
