// Base API Service pour FeetiPlay
// Gestion centralisée des appels HTTP avec cache, retry et error handling

import { fetchWithApiFallback, getPreferredApiBaseUrl } from '../../utils/serviceConfig';

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  code?: string;
}

export interface APIConfig {
  timeout?: number;
  retries?: number;
  cache?: boolean;
  cacheDuration?: number;
}

class BaseAPIService {
  protected get baseUrl(): string {
    return getPreferredApiBaseUrl();
  }

  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private pendingRequests: Map<string, Promise<unknown>> = new Map();

  private config: APIConfig = {
    timeout: 30000,
    retries: 3,
    cache: true,
    cacheDuration: 5 * 60 * 1000, // 5 minutes
  };

  constructor(config?: Partial<APIConfig>) {
    if (config) this.config = { ...this.config, ...config };
  }

  // ── HTTP fetch ──────────────────────────────────────────────────────────────
  // Token injection is handled exclusively by fetchWithApiFallback (Firebase ID token).

  protected async fetchApi<T>(
    endpoint: string,
    options?: RequestInit & { useAdminToken?: boolean }
  ): Promise<T> {
    const { useAdminToken: _useAdminToken, ...fetchOptions } = options ?? {};

    const response = await fetchWithApiFallback(endpoint, fetchOptions);

    if (!response.ok) {
      const body = await response.json().catch(() => ({ message: 'Erreur serveur' }));
      const error = Object.assign(new Error(body.message ?? 'Erreur serveur'), {
        status: response.status,
        errors: body.errors,
        code: response.status === 401 ? 'unauthenticated'
            : response.status === 403 ? 'permission-denied'
            : response.status === 404 ? 'not-found'
            : 'server-error',
      });
      throw error;
    }

    const result = await response.json();
    return result.data as T;
  }

  // ── Cache ──────────────────────────────────────────────────────────────────

  private getCachedData<T>(key: string): T | null {
    if (!this.config.cache) return null;
    const cached = this.cache.get(key);
    if (!cached) return null;
    const isExpired = Date.now() - cached.timestamp > (this.config.cacheDuration ?? 0);
    if (isExpired) { this.cache.delete(key); return null; }
    return cached.data as T;
  }

  private setCachedData<T>(key: string, data: T): void {
    if (!this.config.cache) return;
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  public invalidateCache(pattern?: string): void {
    if (!pattern) { this.cache.clear(); return; }
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) this.cache.delete(key);
    }
  }

  // ── Déduplication ─────────────────────────────────────────────────────────

  private async deduplicateRequest<T>(key: string, request: () => Promise<T>): Promise<T> {
    if (this.pendingRequests.has(key)) {
      return this.pendingRequests.get(key) as Promise<T>;
    }
    const promise = request().finally(() => this.pendingRequests.delete(key));
    this.pendingRequests.set(key, promise);
    return promise;
  }

  // ── Retry avec backoff exponentiel ────────────────────────────────────────

  private async withRetry<T>(fn: () => Promise<T>, retries = this.config.retries ?? 3): Promise<T> {
    let lastError: unknown;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error: unknown) {
        lastError = error;
        const e = error as { code?: string };
        if (e.code === 'permission-denied' || e.code === 'unauthenticated') throw error;
        if (i < retries - 1) {
          await new Promise(r => setTimeout(r, Math.min(1000 * Math.pow(2, i), 10000)));
        }
      }
    }
    throw lastError;
  }

  // ── Timeout ───────────────────────────────────────────────────────────────

  private withTimeout<T>(promise: Promise<T>, ms = this.config.timeout ?? 30000): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), ms)
      ),
    ]);
  }

  // ── Méthode principale ────────────────────────────────────────────────────

  protected async request<T>(
    key: string,
    requestFn: () => Promise<T>,
    options?: { cache?: boolean; retry?: boolean; timeout?: number; deduplicate?: boolean }
  ): Promise<APIResponse<T>> {
    const opts = {
      cache: options?.cache ?? this.config.cache,
      retry: options?.retry ?? true,
      timeout: options?.timeout ?? this.config.timeout,
      deduplicate: options?.deduplicate ?? true,
    };

    try {
      if (opts.cache) {
        const cached = this.getCachedData<T>(key);
        if (cached) return { success: true, data: cached };
      }

      const executeFn = async () => {
        const promise = opts.timeout
          ? this.withTimeout(requestFn(), opts.timeout)
          : requestFn();
        return opts.retry ? this.withRetry(() => promise) : promise;
      };

      const data = opts.deduplicate
        ? await this.deduplicateRequest(key, executeFn)
        : await executeFn();

      if (opts.cache) this.setCachedData(key, data);
      return { success: true, data: data as T };
    } catch (error: unknown) {
      console.error(`API Error [${key}]:`, error);
      return {
        success: false,
        error: this.getErrorMessage(error),
        code: (error as { code?: string }).code ?? 'unknown_error',
      };
    }
  }

  // ── Messages d'erreur ─────────────────────────────────────────────────────

  private getErrorMessage(error: unknown): string {
    const e = error as { code?: string; message?: string };
    if (e.code) {
      const messages: Record<string, string> = {
        'permission-denied': "Vous n'avez pas les permissions nécessaires",
        'unauthenticated': 'Veuillez vous connecter pour continuer',
        'not-found': 'Ressource introuvable',
        'already-exists': 'Cette ressource existe déjà',
        'unavailable': 'Service temporairement indisponible',
      };
      return messages[e.code] ?? e.message ?? 'Une erreur est survenue';
    }
    if (e.message === 'Request timeout') return 'La requête a pris trop de temps. Veuillez réessayer.';
    if (e.message?.includes('network') || e.message?.includes('fetch'))
      return 'Erreur de connexion. Vérifiez votre connexion internet.';
    return e.message ?? 'Une erreur inattendue est survenue';
  }

  // ── Utilitaires ───────────────────────────────────────────────────────────

  public clearCache(): void { this.cache.clear(); }
  public getCacheSize(): number { return this.cache.size; }
  public getPendingRequestsCount(): number { return this.pendingRequests.size; }
}

export default BaseAPIService;
