// Auth API Service pour FeetiPlay — connecté au backend réel

import { fetchWithApiFallback } from '../../utils/serviceConfig';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'viewer' | 'premium' | 'streamer' | 'admin' | 'super_admin';
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'vip';
  createdAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: 'viewer' | 'streamer';
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string | null;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  user: AuthUser;
  accessToken: string;
}

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;
  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

const STORAGE_KEY = 'feetiplay_token';
const USER_KEY    = 'feetiplay_user';

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(STORAGE_KEY);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  };
  const res = await fetchWithApiFallback(endpoint, { ...options, headers });
  const body = await res.json().catch(() => ({ message: 'Erreur serveur' }));
  if (!res.ok) throw new ApiError(body.message ?? 'Erreur serveur', res.status, body.errors);
  return body.data as T;
}

const AuthAPI = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const data = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(STORAGE_KEY, data.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const result = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    localStorage.setItem(STORAGE_KEY, result.accessToken);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    return result;
  },

  async logout(): Promise<void> {
    await apiFetch('/auth/logout', { method: 'POST' }).catch(() => {});
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  },

  async getMe(): Promise<AuthUser> {
    const user = await apiFetch<AuthUser>('/auth/me');
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    const user = await apiFetch<AuthUser>('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    await apiFetch('/auth/password', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteAccount(password: string): Promise<void> {
    await apiFetch('/auth/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEY);
  },
};

export default AuthAPI;
