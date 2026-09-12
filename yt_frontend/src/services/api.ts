import {
  ApiErrorBody,
  ApiErrorKind,
  IndexRequest,
  IndexResponse,
  ResetRequest,
  ResetResponse,
  RetrievalRequest,
  RetrievalResponse,
} from "@/types/api";
import { getStoredSettings } from "@/services/storage";

export class ApiError extends Error {
  constructor(
    readonly kind: ApiErrorKind,
    readonly status?: number
  ) {
    super(`${kind}${status ? ` (${status})` : ""}`);
    this.name = "ApiError";
  }
}

// The backend names its domain errors; anything else is classified by status.
const ERROR_KINDS: Record<string, ApiErrorKind> = {
  invalid_youtube_url: "invalid_url",
  transcript_not_available: "no_transcript",
};

function classify(status: number, body: ApiErrorBody | null): ApiErrorKind {
  const named = body?.error ? ERROR_KINDS[body.error] : undefined;
  if (named) return named;
  if (status === 400 || status === 422) return "bad_request";
  return "server";
}

export class ApiClient {
  private get baseUrl(): string {
    return getStoredSettings().apiBaseUrl.replace(/\/+$/, "");
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    let res: Response;

    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch {
      throw new ApiError("network");
    }

    if (!res.ok) {
      const parsed = (await res.json().catch(() => null)) as ApiErrorBody | null;
      throw new ApiError(classify(res.status, parsed), res.status);
    }

    return res.json() as Promise<T>;
  }

  indexVideo(url: string): Promise<IndexResponse> {
    return this.post<IndexResponse>("/index", { url } satisfies IndexRequest);
  }

  queryVideo(videoId: string, question: string): Promise<RetrievalResponse> {
    return this.post<RetrievalResponse>("/query", {
      video_id: videoId,
      question,
    } satisfies RetrievalRequest);
  }

  // Development reset: clears every store the backend owns. Schema, migrations
  // and the Qdrant collection itself are left in place.
  resetApplicationData(): Promise<ResetResponse> {
    return this.post<ResetResponse>("/reset", { confirm: true } satisfies ResetRequest);
  }
}

export const apiClient = new ApiClient();
