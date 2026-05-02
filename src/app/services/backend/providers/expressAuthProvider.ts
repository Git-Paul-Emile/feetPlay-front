import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../config/firebase";
import { legacyApiFetch } from "../legacyApi";
import {
  changeFirebasePassword,
  createFirebaseAccount,
  deleteFirebaseAccount,
  logoutFirebase,
  signInAndGetUser,
} from "../helpers";
import type {
  AuthProvider,
  AuthStateListener,
  AuthUser,
  ChangePasswordData,
  RegisterData,
  UpdateProfileData,
} from "../types";

async function getMe() {
  return legacyApiFetch<AuthUser>("/auth/me");
}

export const expressAuthProvider: AuthProvider = {
  mode: "express",

  subscribe(listener: AuthStateListener) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        await listener(null);
        return;
      }

      try {
        await listener(await getMe());
      } catch {
        await listener(null);
      }
    });
  },

  async login(email: string, password: string) {
    await signInAndGetUser(email, password);
    return getMe();
  },

  async register(data: RegisterData) {
    const firebaseUser = await createFirebaseAccount(data.name, data.email, data.password);
    await legacyApiFetch<AuthUser>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: data.name, phone: data.phone, role: data.role }),
    });
    await firebaseUser.getIdToken(true);
    return getMe();
  },

  async logout() {
    await logoutFirebase();
  },

  async updateProfile(data: UpdateProfileData) {
    return legacyApiFetch<AuthUser>("/auth/profile", {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  },

  async changePassword(data: ChangePasswordData) {
    await changeFirebasePassword(data.currentPassword, data.newPassword);
  },

  async deleteAccount(password: string) {
    await legacyApiFetch("/auth/account", { method: "DELETE" });
    await deleteFirebaseAccount(password);
  },

  async getCurrentProfile() {
    if (!auth.currentUser) {
      return null;
    }

    try {
      return await getMe();
    } catch {
      return null;
    }
  },
};
