const MAX_PORT_CANDIDATES = 3;
const API_STORAGE_KEY = 'feetiplay_api_base_url';
const FEETI2_STORAGE_KEY = 'feetiplay_feeti2_base_url';

function canUseBrowserStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '');
}

function getWindowHostname() {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    return window.location.hostname;
  }

  return 'localhost';
}

function buildCandidateUrls(baseUrl: string) {
  try {
    const parsed = new URL(baseUrl);
    const parsedPort = Number(parsed.port);

    if (!Number.isInteger(parsedPort) || parsedPort <= 0) {
      return [normalizeBaseUrl(baseUrl)];
    }

    return Array.from({ length: MAX_PORT_CANDIDATES }, (_, index) => {
      const candidate = new URL(parsed.toString());
      candidate.port = String(parsedPort + index);
      return normalizeBaseUrl(candidate.toString());
    });
  } catch {
    return [normalizeBaseUrl(baseUrl)];
  }
}

function getStoredBaseUrl(storageKey: string, candidates: string[]) {
  if (!canUseBrowserStorage()) {
    return null;
  }

  const stored = window.localStorage.getItem(storageKey);
  return stored && candidates.includes(stored) ? stored : null;
}

function rememberBaseUrl(storageKey: string, url: string) {
  if (!canUseBrowserStorage()) {
    return;
  }

  window.localStorage.setItem(storageKey, normalizeBaseUrl(url));
}

export function getApiBaseUrls() {
  const configured = (import.meta as any).env?.VITE_API_URL ?? `http://${getWindowHostname()}:8001/api`;
  return [...new Set(buildCandidateUrls(configured))];
}

export function getPreferredApiBaseUrl() {
  const candidates = getApiBaseUrls();
  return getStoredBaseUrl(API_STORAGE_KEY, candidates) ?? candidates[0];
}

export function getFeeti2BaseUrls() {
  const configured = (import.meta as any).env?.VITE_FEETI2_URL ?? `http://${getWindowHostname()}:3000`;
  return [...new Set(buildCandidateUrls(configured))];
}

export function getPreferredFeeti2BaseUrl() {
  const candidates = getFeeti2BaseUrls();
  return getStoredBaseUrl(FEETI2_STORAGE_KEY, candidates) ?? candidates[0];
}

export async function fetchWithApiFallback(endpoint: string, options?: RequestInit) {
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const preferredBaseUrl = getPreferredApiBaseUrl();
  const candidates = [
    preferredBaseUrl,
    ...getApiBaseUrls().filter((url) => url !== preferredBaseUrl),
  ];

  let lastError: unknown;

  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${normalizedEndpoint}`, options);
      rememberBaseUrl(API_STORAGE_KEY, baseUrl);
      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('API unreachable');
}
