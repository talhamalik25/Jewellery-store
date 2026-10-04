import type { ApiErrorResponse } from "@/lib/types";

const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
const baseUrl = configuredBaseUrl.replace(/\/$/, "");

export class ApiError extends Error {
  status: number;
  details?: string[];

  constructor(message: string, status: number, payload?: ApiErrorResponse) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = payload?.details;
  }
}

function buildUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(buildUrl(path), {
    ...init,
    headers,
    // The backend authenticates with an HttpOnly cookie, not a bearer header.
    credentials: init.credentials ?? "include",
  });

  if (response.status === 204) return undefined as T;

  const responseText = await response.text();
  let payload: unknown = undefined;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = undefined;
    }
  }

  if (!response.ok) {
    const errorPayload = payload && typeof payload === "object"
      ? payload as ApiErrorResponse
      : undefined;
    throw new ApiError(
      errorPayload?.error || `Request failed with status ${response.status}.`,
      response.status,
      errorPayload,
    );
  }

  return payload as T;
}
