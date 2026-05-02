import { auth } from "../config/firebase";

const API_STORAGE_KEY = "feetiplay_api_base_url";

function canUseBrowserStorage() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, "");
}

function getWindowHostname() {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }
  return "localhost";
}

function buildCandidateUrls(baseUrl: string) {
  return [normalizeBaseUrl(baseUrl)];
}

function getStoredBaseUrl(storageKey: string, candidates: string[]) {
  if (!canUseBrowserStorage()) return null;
  const stored = window.localStorage.getItem(storageKey);
  return stored && candidates.includes(stored) ? stored : null;
}

function rememberBaseUrl(storageKey: string, url: string) {
  if (!canUseBrowserStorage()) return;
  window.localStorage.setItem(storageKey, normalizeBaseUrl(url));
}

export function getApiBaseUrls() {
  const configured =
    (import.meta as any).env?.VITE_API_URL ?? `http://${getWindowHostname()}:5002/feetiplay/europe-west1/feetiplayApi`;
  return [...new Set(buildCandidateUrls(configured))];
}

export function getPreferredApiBaseUrl() {
  const candidates = getApiBaseUrls();
  return getStoredBaseUrl(API_STORAGE_KEY, candidates) ?? candidates[0];
}

export function getFeeti2BaseUrls() {
  const configured =
    (import.meta as any).env?.VITE_FEETI2_URL ?? `http://${getWindowHostname()}:3000`;
  return [...new Set(buildCandidateUrls(configured))];
}

export function getPreferredFeeti2BaseUrl() {
  const candidates = getFeeti2BaseUrls();
  return getStoredBaseUrl("feetiplay_feeti2_base_url", candidates) ?? candidates[0];
}

/**
 * Récupère le Firebase ID Token du l'utilisateur courant (auto-rafraîchi).
 * Retourne null si aucun utilisateur n'est connecté.
 */
async function getFirebaseToken(): Promise<string | null> {
  if (auth.currentUser) {
    return auth.currentUser.getIdToken(false);
  }
  return null;
}

/**
 * Fetch avec URL API normalisee + injection automatique du Firebase ID Token.
 */
export async function fetchWithApiFallback(
  endpoint: string,
  options?: RequestInit & { useAdminToken?: boolean }
) {
  const rawEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const normalizedEndpoint = rawEndpoint.startsWith("/api/")
    ? rawEndpoint
    : `/api${rawEndpoint}`;
  const preferredBaseUrl = getPreferredApiBaseUrl();
  const candidates = [
    preferredBaseUrl,
    ...getApiBaseUrls().filter((url) => url !== preferredBaseUrl),
  ];

  // Récupération du token Firebase (unique source de vérité)
  const token = await getFirebaseToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  };

  let lastError: unknown;
  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${normalizedEndpoint}`, {
        ...options,
        headers,
      });
      rememberBaseUrl(API_STORAGE_KEY, baseUrl);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("API unreachable");
}
