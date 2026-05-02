import { fetchWithApiFallback, getPreferredApiBaseUrl } from "../../utils/serviceConfig";

export class BackendApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

export async function legacyApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetchWithApiFallback(endpoint, options);
  const body = await response.json().catch(() => ({ message: "Erreur serveur" }));

  if (!response.ok) {
    throw new BackendApiError(body.message ?? "Erreur serveur", response.status, body.errors);
  }

  return body.data as T;
}

export async function legacyApiRaw(endpoint: string, options?: RequestInit): Promise<Response> {
  return fetchWithApiFallback(endpoint, options);
}

export function getLegacyApiBaseUrl() {
  return getPreferredApiBaseUrl();
}
