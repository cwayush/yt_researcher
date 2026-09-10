import {
  IndexRequest,
  IndexResponse,
  RetrievalRequest,
  RetrievalResponse,
  TranscriptResponse,
} from "@/types/api";
import { getStoredSettings } from "@/services/storage";

export class ApiClient {
  private get baseUrl(): string {
    return getStoredSettings().apiBaseUrl.replace(/\/+$/, "");
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => null);
      throw new Error(err?.detail || err?.error || `Request to ${path} failed (${res.status})`);
    }

    return res.json() as Promise<T>;
  }

  async checkHealth(): Promise<boolean> {
    try {
      const root = this.baseUrl.replace(/\/api\/v1$/, "");
      const res = await fetch(`${root}/health`);
      return res.ok;
    } catch {
      return false;
    }
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

  fetchTranscript(url: string): Promise<TranscriptResponse> {
    return this.post<TranscriptResponse>("/transcript", { url } satisfies IndexRequest);
  }
}

export const apiClient = new ApiClient();
