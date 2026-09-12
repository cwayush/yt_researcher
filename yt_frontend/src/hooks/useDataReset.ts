import { useCallback, useState } from "react";
import { RESET_ERROR_COPY } from "@/lib/constants";
import { ApiError, apiClient } from "@/services/api";
import { historyStore } from "@/hooks/useHistory";

// Clears the backend's indexed data, then the local history that described it.
export function useDataReset() {
  const [isResetting, setIsResetting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(async (): Promise<boolean> => {
    setIsResetting(true);
    setError(null);

    try {
      await apiClient.resetApplicationData();
      historyStore.clear();
      return true;
    } catch (err: unknown) {
      const kind = err instanceof ApiError ? err.kind : "server";
      setError(RESET_ERROR_COPY[kind]);
      return false;
    } finally {
      setIsResetting(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { reset, isResetting, error, clearError };
}
