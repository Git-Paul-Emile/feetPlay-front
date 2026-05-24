import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile as updateFirebaseProfile,
  signOut,
  EmailAuthProvider,
  reauthenticateWithCredential,
  deleteUser as deleteFirebaseUser,
} from "firebase/auth";
import { auth } from "../../../config/firebase";
import { legacyApiFetch, BackendApiError } from "../legacyApi";
import { signInWithGooglePopup } from "../helpers";
import { firebaseClientErrorToUserMessage } from "../../../utils/firebaseUserFacingError";
import type {
  AuthProvider,
  AuthStateListener,
  AuthUser,
  ChangePasswordData,
  RegisterData,
  UpdateProfileData,
} from "../types";

const PENDING_GOOGLE_TOKEN_KEY = "feetiplay_google_pending_token";
const GOOGLE_COMPLETION_FLAG_KEY = "feetiplay_google_requires_completion";
const USER_TOKEN_KEY = "feetiplay_token";

// Empêche onAuthStateChanged d'essayer d'échanger le token pendant login/register
let _authInFlight = false;

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

function normalizeUser(backendUser: any): AuthUser {
  if (!backendUser) return backendUser;
  return {
    ...backendUser,
    uid: backendUser.uid || backendUser.id,
  };
}

async function fetchProfile(): Promise<AuthUser | null> {
  try {
    const user = await legacyApiFetch<any>("/auth/me");
    return normalizeUser(user);
  } catch {
    return null;
  }
}

async function exchangeFirebaseToken(idToken: string): Promise<AuthApiPayload | null> {
  try {
    return await legacyApiFetch<AuthApiPayload>("/auth/firebase/login", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  } catch {
    return null;
  }
}

function rethrowUserFacing(e: unknown): never {
  throw new Error(firebaseClientErrorToUserMessage(e));
}

export const expressAuthProvider: AuthProvider = {
  mode: "express",

  // Utilise onAuthStateChanged de Firebase comme feeti2 — subscription fiable
  subscribe(listener: AuthStateListener) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        clearAccessToken();
        await listener(null);
        return;
      }

      // login()/register() en cours — ils appelleront setUser directement
      if (_authInFlight) return;

      // Firebase user présent — essai avec le token localStorage existant
      if (hasAccessToken()) {
        const user = await fetchProfile();
        if (user) {
          await listener(user);
          return;
        }
        clearAccessToken();
      }

      // Pas de token valide — échange le token Firebase contre un JWT FeetiPlay
      // (cas typique : rechargement de page avec JWT expiré)
      try {
        const idToken = await firebaseUser.getIdToken(true);
        const payload = await exchangeFirebaseToken(idToken);
        if (payload) {
          storeAccessToken(payload.accessToken);
          await listener(normalizeUser(payload.user));
        } else {
          await listener(null);
        }
      } catch {
        await listener(null);
      }
    });
  },

  async login(email: string, password: string) {
    _authInFlight = true;
    try {
      const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await fbUser.getIdToken();
      const payload = await legacyApiFetch<AuthApiPayload>("/auth/firebase/login", {
        method: "POST",
        body: JSON.stringify({ idToken }),
      });
      storeAccessToken(payload.accessToken);
      return normalizeUser(payload.user);
    } catch (e) {
      rethrowUserFacing(e);
    } finally {
      _authInFlight = false;
    }
  },

  async register(data: RegisterData) {
    _authInFlight = true;
    try {
      const { user: fbUser } = await createUserWithEmailAndPassword(auth, data.email, data.password);
      await updateFirebaseProfile(fbUser, { displayName: data.name });
      const idToken = await fbUser.getIdToken(true);
      const payload = await legacyApiFetch<AuthApiPayload>("/auth/firebase/register", {
        method: "POST",
        body: JSON.stringify({
          idToken,
          name: data.name,
          phone: data.phone,
          role: data.role,
        }),
      });
      storeAccessToken(payload.accessToken);
      return normalizeUser(payload.user);
    } catch (e) {
      rethrowUserFacing(e);
    } finally {
      _authInFlight = false;
    }
  },

  async startGoogleAuth() {
    clearAccessToken();
    const result = await signInWithGooglePopup();
    const prefill = {
      name: result.user.displayName ?? undefined,
      email: result.user.email ?? undefined,
      avatar: result.user.photoURL ?? null,
    };

    if (result.isNewUser) {
      window.sessionStorage.setItem(PENDING_GOOGLE_TOKEN_KEY, result.idToken);
      window.sessionStorage.setItem(GOOGLE_COMPLETION_FLAG_KEY, "1");
      return { requiresCompletion: true, prefill };
    }

    try {
      const payload = await legacyApiFetch<AuthApiPayload>("/auth/firebase/login", {
        method: "POST",
        body: JSON.stringify({ idToken: result.idToken }),
      });
      storeAccessToken(payload.accessToken);
      return { requiresCompletion: false, user: normalizeUser(payload.user) };
    } catch (err) {
      if (err instanceof BackendApiError && err.status === 404) {
        // Profil backend absent (inscription précédemment abandonnée)
        window.sessionStorage.setItem(PENDING_GOOGLE_TOKEN_KEY, result.idToken);
        window.sessionStorage.setItem(GOOGLE_COMPLETION_FLAG_KEY, "1");
        return { requiresCompletion: true, prefill };
      }
      throw err;
    }
  },

  async completeGoogleRegistration(data) {
    const idToken = window.sessionStorage.getItem(PENDING_GOOGLE_TOKEN_KEY);
    if (!idToken) {
      throw new Error("Session Google expirée. Relancez l'inscription Google.");
    }
    const payload = await legacyApiFetch<AuthApiPayload>("/auth/firebase/register", {
      method: "POST",
      body: JSON.stringify({ idToken, ...data }),
    });
    storeAccessToken(payload.accessToken);
    window.sessionStorage.removeItem(GOOGLE_COMPLETION_FLAG_KEY);
    window.sessionStorage.removeItem(PENDING_GOOGLE_TOKEN_KEY);
    return normalizeUser(payload.user);
  },

  async logout() {
    await legacyApiFetch("/auth/logout", { method: "POST" }).catch(() => undefined);
    await signOut(auth).catch(() => undefined);
    clearAccessToken();
  },

  async updateProfile(data: UpdateProfileData) {
    if (auth.currentUser && data.name) {
      await updateFirebaseProfile(auth.currentUser, { displayName: data.name }).catch(() => undefined);
    }
    const user = await legacyApiFetch<any>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return normalizeUser(user);
  },

  async changePassword(data: ChangePasswordData) {
    const fbUser = auth.currentUser;
    if (fbUser?.email) {
      try {
        const credential = EmailAuthProvider.credential(fbUser.email, data.currentPassword);
        await reauthenticateWithCredential(fbUser, credential);
        // Le backend met aussi à jour le hash — appel parallèle
      } catch (e) {
        rethrowUserFacing(e);
      }
    }
    await legacyApiFetch("/auth/password", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async deleteAccount(password: string) {
    const fbUser = auth.currentUser;
    if (fbUser?.email) {
      try {
        const credential = EmailAuthProvider.credential(fbUser.email, password);
        await reauthenticateWithCredential(fbUser, credential);
      } catch (e) {
        rethrowUserFacing(e);
      }
    }
    await legacyApiFetch("/auth/account", { method: "DELETE" });
    if (fbUser) {
      await deleteFirebaseUser(fbUser).catch(() => undefined);
    }
    clearAccessToken();
  },

  async getCurrentProfile() {
    if (!hasAccessToken()) return null;
    const user = await fetchProfile();
    if (!user) clearAccessToken();
    return user;
  },
};
