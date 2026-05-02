import { onAuthStateChanged, updateProfile as updateFirebaseProfile } from "firebase/auth";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import {
  changeFirebasePassword,
  createFirebaseAccount,
  deleteFirebaseAccount,
  logoutFirebase,
  signInAndGetUser,
  toIsoDate,
} from "../helpers";
import type {
  AuthProvider,
  AuthStateListener,
  AuthUser,
  ChangePasswordData,
  RegisterData,
  UpdateProfileData,
} from "../types";

function mapProfile(uid: string, data: Record<string, any>): AuthUser {
  return {
    uid,
    name: data.name ?? "",
    email: data.email ?? "",
    phone: data.phone ?? null,
    avatar: data.avatar ?? null,
    role: data.role ?? "viewer",
    subscriptionPlan: data.subscriptionPlan ?? "free",
    createdAt: toIsoDate(data.createdAt),
    updatedAt: toIsoDate(data.updatedAt),
  };
}

async function getProfile(uid: string): Promise<AuthUser | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? mapProfile(uid, snap.data() as Record<string, any>) : null;
}

export const firebaseAuthProvider: AuthProvider = {
  mode: "firebase",

  subscribe(listener: AuthStateListener) {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        await listener(null);
        return;
      }

      await listener(await getProfile(firebaseUser.uid));
    });
  },

  async login(email: string, password: string) {
    const user = await signInAndGetUser(email, password);
    const profile = await getProfile(user.uid);
    if (!profile) {
      throw new Error("Profil utilisateur introuvable");
    }
    return profile;
  },

  async register(data: RegisterData) {
    const firebaseUser = await createFirebaseAccount(data.name, data.email, data.password);
    const now = serverTimestamp();
    await setDoc(doc(db, "users", firebaseUser.uid), {
      uid: firebaseUser.uid,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      avatar: null,
      role: data.role ?? "viewer",
      subscriptionPlan: "free",
      createdAt: now,
      updatedAt: now,
    });

    const profile = await getProfile(firebaseUser.uid);
    if (!profile) {
      throw new Error("Profil utilisateur introuvable");
    }
    return profile;
  },

  async logout() {
    await logoutFirebase();
  },

  async updateProfile(data: UpdateProfileData) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Non authentifie");
    }

    const updates: Record<string, unknown> = { updatedAt: serverTimestamp() };
    if (data.name !== undefined) {
      updates.name = data.name;
      await updateFirebaseProfile(user, { displayName: data.name });
    }
    if (data.email !== undefined) {
      updates.email = data.email;
    }
    if (data.phone !== undefined) {
      updates.phone = data.phone ?? null;
    }
    if (data.avatar !== undefined) {
      updates.avatar = data.avatar ?? null;
    }

    await updateDoc(doc(db, "users", user.uid), updates);
    const profile = await getProfile(user.uid);
    if (!profile) {
      throw new Error("Profil utilisateur introuvable");
    }
    return profile;
  },

  async changePassword(data: ChangePasswordData) {
    await changeFirebasePassword(data.currentPassword, data.newPassword);
  },

  async deleteAccount(password: string) {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Non authentifie");
    }
    await deleteFirebaseAccount(password);
    await setDoc(doc(db, "users", user.uid), {}, { merge: false }).catch(() => undefined);
  },

  async getCurrentProfile() {
    const user = auth.currentUser;
    return user ? getProfile(user.uid) : null;
  },
};
