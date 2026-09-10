export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1",
  useBackendApi: import.meta.env.VITE_USE_BACKEND_API === "true",
} as const;
