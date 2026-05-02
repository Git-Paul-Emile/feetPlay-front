import type { BackendProviderMode } from "./types";

const STORAGE_KEY = "feetiplay_backend_provider";

function isMode(value: string | null | undefined): value is BackendProviderMode {
  return value === "express" || value === "firebase";
}

export function getBackendProviderMode(): BackendProviderMode {
  if (typeof window !== "undefined") {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isMode(stored)) {
      return stored;
    }
  }

  const envMode = (import.meta as ImportMeta & { env?: Record<string, string> }).env?.VITE_BACKEND_PROVIDER;
  return isMode(envMode) ? envMode : "express";
}

export function setBackendProviderMode(mode: BackendProviderMode) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, mode);
  }
}
