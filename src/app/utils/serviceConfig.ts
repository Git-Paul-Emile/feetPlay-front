import { auth, authStateReady } from "../config/firebase";

const API_STORAGE_KEY = "feetiplay_api_base_url";
const ACCESS_TOKEN_KEY = "accessToken";
const LEGACY_USER_TOKEN_KEY = "feetiplay_token";
const ADMIN_TOKEN_KEY = "feetiplay_admin_token";

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
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_API_URL ??
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_BACKEND_URL ??
    `http://${getWindowHostname()}:8001`;
  return [...new Set(buildCandidateUrls(configured))];
}

export function getPreferredApiBaseUrl() {
  const candidates = getApiBaseUrls();
  return getStoredBaseUrl(API_STORAGE_KEY, candidates) ?? candidates[0];
}

export function getFeeti2BaseUrls() {
  const configured =
    (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_FEETI2_URL ??
    `http://${getWindowHostname()}:3000`;
  return [...new Set(buildCandidateUrls(configured))];
}

export function getPreferredFeeti2BaseUrl() {
  const candidates = getFeeti2BaseUrls();
  return getStoredBaseUrl("feetiplay_feeti2_base_url", candidates) ?? candidates[0];
}

async function getFirebaseToken(): Promise<string | null> {
  if (auth.currentUser) {
    try {
      return await auth.currentUser.getIdToken(false);
    } catch {
      return null;
    }
  }
  return null;
}

function getStoredAccessToken(): string | null {
  if (!canUseBrowserStorage()) return null;
  return (
    window.localStorage.getItem(ACCESS_TOKEN_KEY) ||
    window.localStorage.getItem(LEGACY_USER_TOKEN_KEY)
  );
}

function getAdminToken(): string | null {
  if (!canUseBrowserStorage()) return null;
  return window.localStorage.getItem(ADMIN_TOKEN_KEY);
}

/**
 * Résout le token Bearer — aligné feeti2 :
 * 1. Firebase ID token (prioritaire)
 * 2. JWT local stocké après login/register
 * 3. Token admin si demandé explicitement
 */
async function resolveAuthToken(useAdminToken?: boolean): Promise<string | null> {
  await authStateReady();

  if (useAdminToken) {
    const adminToken = getAdminToken();
    if (adminToken) return adminToken;
  }

  const firebaseToken = await getFirebaseToken();
  if (firebaseToken) return firebaseToken;

  return getStoredAccessToken();
}

/**
 * Fetch avec URL API normalisée + injection automatique du token (Firebase en priorité).
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

  const { useAdminToken, headers: optionHeaders, ...restOptions } = options ?? {};
  const token = await resolveAuthToken(useAdminToken);

  const isFormData = restOptions.body instanceof FormData;
  const headers: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(optionHeaders ?? {}),
  };

  let lastError: unknown;
  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${normalizedEndpoint}`, {
        ...restOptions,
        headers,
        credentials: "include",
      });
      rememberBaseUrl(API_STORAGE_KEY, baseUrl);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error("API unreachable");
}
