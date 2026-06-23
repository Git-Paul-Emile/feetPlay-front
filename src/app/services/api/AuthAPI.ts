import { fetchWithApiFallback } from "../../utils/serviceConfig";
import type {
  AuthUser,
  ChangePasswordData,
  GoogleCompletionData,
  RegisterData,
  UpdateProfileData,
} from "../backend/types";

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(message: string, status: number, errors?: Record<string, string>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function normalizeUser(backendUser: AuthUser & { id?: string }): AuthUser {
  return {
    ...backendUser,
    uid: backendUser.uid || backendUser.id || "",
    createdAt: backendUser.createdAt ?? new Date().toISOString(),
    updatedAt: backendUser.updatedAt ?? new Date().toISOString(),
  };
}

function storeAccessToken(token: string) {
  window.localStorage.setItem("accessToken", token);
  window.localStorage.setItem("feetiplay_token", token);
}

async function parseResponse<T>(response: Response): Promise<T> {
  const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
  if (!response.ok) {
    throw new ApiError(body.message ?? "Erreur serveur", response.status, body.errors);
  }
  return body.data as T;
}

const AuthAPI = {
  async registerProfile(
    data: Omit<RegisterData, "email" | "password"> | GoogleCompletionData,
    idToken: string
  ): Promise<AuthUser> {
    const response = await fetchWithApiFallback("/auth/firebase/register", {
      method: "POST",
      body: JSON.stringify({
        idToken,
        name: data.name,
        phone: data.phone,
        role: data.role ?? "viewer",
      }),
    });
    const payload = await parseResponse<{ user: AuthUser & { id?: string }; accessToken: string }>(response);
    if (payload.accessToken) storeAccessToken(payload.accessToken);
    return normalizeUser(payload.user);
  },

  async loginProfile(idToken: string): Promise<AuthUser> {
    const response = await fetchWithApiFallback("/auth/firebase/login", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
    const payload = await parseResponse<{ user: AuthUser & { id?: string }; accessToken: string }>(response);
    if (payload.accessToken) storeAccessToken(payload.accessToken);
    return normalizeUser(payload.user);
  },

  async getMe(): Promise<AuthUser> {
    const response = await fetchWithApiFallback("/auth/me");
    const user = await parseResponse<AuthUser & { id?: string }>(response);
    return normalizeUser(user);
  },

  async updateProfile(data: UpdateProfileData): Promise<AuthUser> {
    const response = await fetchWithApiFallback("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    const user = await parseResponse<AuthUser & { id?: string }>(response);
    return normalizeUser(user);
  },

  async deleteAccount(password: string): Promise<void> {
    const response = await fetchWithApiFallback("/auth/account", {
      method: "DELETE",
      body: JSON.stringify({ password }),
    });
    await parseResponse<unknown>(response);
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    const response = await fetchWithApiFallback("/auth/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    await parseResponse<unknown>(response);
  },

  async ssoFeeti2(token: string): Promise<AuthUser> {
    const response = await fetchWithApiFallback("/auth/sso/feeti2", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
    const payload = await parseResponse<{ user: AuthUser & { id?: string }; accessToken: string }>(response);
    if (payload.accessToken) storeAccessToken(payload.accessToken);
    return normalizeUser(payload.user);
  },
};

export default AuthAPI;
export type {
  AuthUser,
  RegisterData,
  UpdateProfileData,
  ChangePasswordData,
  GoogleCompletionData,
  GoogleAuthStartResult,
} from "../backend/types";
