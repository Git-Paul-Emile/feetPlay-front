import { signOut } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { legacyApiFetch } from "../legacyApi";
import {
  signInWithGooglePopup,
} from "../helpers";
import type {
  AuthProvider,
  AuthStateListener,
  AuthUser,
  ChangePasswordData,
  RegisterData,
  UpdateProfileData,
} from "../types";

const PENDING_GOOGLE_TOKEN_KEY = "feetiplay_google_pending_token";
const USER_TOKEN_KEY = "feetiplay_token";
const GOOGLE_COMPLETION_FLAG_KEY = "feetiplay_google_requires_completion";

type AuthApiPayload = {
  user: AuthUser;
  accessToken: string;
};

function storeAccessToken(token: string) {
  window.localStorage.setItem(USER_TOKEN_KEY, token);
}

function clearAccessToken() {
  window.localStorage.removeItem(USER_TOKEN_KEY);
}

function hasAccessToken() {
  return Boolean(window.localStorage.getItem(USER_TOKEN_KEY));
}

async function getMe() {
  const user = await legacyApiFetch<any>("/auth/me");
  return normalizeUser(user);
}

function normalizeUser(backendUser: any): AuthUser {
  if (!backendUser) return backendUser;
  return {
    ...backendUser,
    uid: backendUser.uid || backendUser.id,
  };
}

export const expressAuthProvider: AuthProvider = {
  mode: "express",

  subscribe(listener: AuthStateListener) {
    let active = true;
    void (async () => {
      try {
        if (hasAccessToken()) {
          try {
            await listener(await getMe());
            return;
          } catch {
            clearAccessToken();
          }
        }
        await listener(null);
      } catch {
        if (!active) return;
        if (hasAccessToken()) {
          try {
            await listener(await getMe());
            return;
          } catch {
            clearAccessToken();
          }
        }
        await listener(null);
      }
    })();
    return () => {
      active = false;
    };
  },

  async login(email: string, password: string) {
    const payload = await legacyApiFetch<AuthApiPayload>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    storeAccessToken(payload.accessToken);
    return normalizeUser(payload.user);
  },

  async register(data: RegisterData) {
    const payload = await legacyApiFetch<AuthApiPayload>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: data.name, email: data.email, password: data.password, phone: data.phone, role: data.role }),
    });
    storeAccessToken(payload.accessToken);
    return normalizeUser(payload.user);
  },

  async startGoogleAuth() {
    clearAccessToken();
    const result = await signInWithGooglePopup();
    if (result.isNewUser) {
      window.sessionStorage.setItem(PENDING_GOOGLE_TOKEN_KEY, result.idToken);
      window.sessionStorage.setItem(GOOGLE_COMPLETION_FLAG_KEY, "1");
      return {
        requiresCompletion: true,
        prefill: {
          name: result.user.displayName ?? undefined,
          email: result.user.email ?? undefined,
          avatar: result.user.photoURL ?? null,
        },
      };
    }

    const logged = await legacyApiFetch<AuthApiPayload>("/auth/firebase/login", {
      method: "POST",
      body: JSON.stringify({ idToken: result.idToken }),
    });
    storeAccessToken(logged.accessToken);
    return { requiresCompletion: false, user: normalizeUser(logged.user) };
  },

  async completeGoogleRegistration(data) {
    const idToken = window.sessionStorage.getItem(PENDING_GOOGLE_TOKEN_KEY);
    if (!idToken) {
      throw new Error("Session Google expirée. Relancez l'inscription Google.");
    }
    const created = await legacyApiFetch<AuthApiPayload>("/auth/firebase/register", {
      method: "POST",
      body: JSON.stringify({ idToken, ...data }),
    });
    storeAccessToken(created.accessToken);
    window.sessionStorage.removeItem(GOOGLE_COMPLETION_FLAG_KEY);
    window.sessionStorage.removeItem(PENDING_GOOGLE_TOKEN_KEY);
    return normalizeUser(created.user);
  },

  async logout() {
    await legacyApiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    await signOut(auth).catch(() => undefined);
    clearAccessToken();
  },

  async updateProfile(data: UpdateProfileData) {
    const user = await legacyApiFetch<any>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return normalizeUser(user);
  },

  async changePassword(data: ChangePasswordData) {
    await legacyApiFetch("/auth/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAccount(password: string) {
    await legacyApiFetch("/auth/account", { method: "DELETE" });
    await signOut(auth).catch(() => undefined);
    clearAccessToken();
  },

  async getCurrentProfile() {
    if (!hasAccessToken()) {
      clearAccessToken();
      return null;
    }

    try {
      return await getMe();
    } catch {
      clearAccessToken();
      return null;
    }
  },
};
