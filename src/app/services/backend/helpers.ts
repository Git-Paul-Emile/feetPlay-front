import {
  EmailAuthProvider,
  createUserWithEmailAndPassword,
  deleteUser as deleteFirebaseUser,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile as updateFirebaseProfile,
  type User,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type DocumentData,
  type QueryConstraint,
  type Timestamp,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { firebaseClientErrorToUserMessage } from "../../utils/firebaseUserFacingError";

export function toIsoDate(value: unknown): string {
  if (!value) return new Date().toISOString();
  if (typeof value === "string") return value;
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "object" && value !== null && "toDate" in value) {
    return (value as Timestamp).toDate().toISOString();
  }
  return new Date().toISOString();
}

export async function readCollection<T = DocumentData>(
  path: string,
  constraints: QueryConstraint[] = [],
): Promise<(T & { id: string })[]> {
  const snap = await getDocs(query(collection(db, path), ...constraints));
  return snap.docs.map((item) => ({ id: item.id, ...(item.data() as T) }));
}

export async function readDoc<T = DocumentData>(path: string, id: string): Promise<(T & { id: string }) | null> {
  const snap = await getDoc(doc(db, path, id));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as T) }) : null;
}

export function requireCurrentUser(): User {
  if (!auth.currentUser) {
    throw new Error("Veuillez vous connecter pour continuer");
  }
  return auth.currentUser;
}

export async function signInAndGetUser(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return requireCurrentUser();
  } catch (e) {
    throw new Error(firebaseClientErrorToUserMessage(e));
  }
}

export async function createFirebaseAccount(name: string, email: string, password: string) {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateFirebaseProfile(result.user, { displayName: name });
    return result.user;
  } catch (e) {
    throw new Error(firebaseClientErrorToUserMessage(e));
  }
}

export async function changeFirebasePassword(currentPassword: string, newPassword: string) {
  const user = requireCurrentUser();
  if (!user.email) {
    throw new Error("Non authentifie");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  } catch (e) {
    throw new Error(firebaseClientErrorToUserMessage(e));
  }
}

export async function deleteFirebaseAccount(password: string) {
  const user = requireCurrentUser();
  if (!user.email) {
    throw new Error("Non authentifie");
  }

  try {
    const credential = EmailAuthProvider.credential(user.email, password);
    await reauthenticateWithCredential(user, credential);
    await deleteFirebaseUser(user);
  } catch (e) {
    throw new Error(firebaseClientErrorToUserMessage(e));
  }
}

export async function logoutFirebase() {
  await signOut(auth);
}

export function normalizeStreamingEvent(event: Record<string, any>) {
  return {
    id: String(event.id),
    title: event.title ?? "",
    description: event.description ?? "",
    date: event.date ?? "",
    time: event.time ?? "",
    duration: event.duration ?? "",
    image: event.image ?? "",
    channelId: event.channelId ?? "",
    channelName: event.channelName ?? "",
    category: event.category ?? "",
    tags: Array.isArray(event.tags) ? event.tags.filter(Boolean) : [],
    isLive: Boolean(event.isLive),
    isReplay: Boolean(event.isReplay),
    isFeatured: Boolean(event.isFeatured),
    isFree: Boolean(event.isFree ?? !event.price),
    price: typeof event.price === "number" ? event.price : event.price != null ? Number(event.price) : undefined,
    currency: event.currency ?? "FCFA",
    viewerCount: typeof event.viewerCount === "number" ? event.viewerCount : 0,
    hasTicket: Boolean(event.hasTicket),
    streamUrl: event.streamUrl ?? null,
    location: event.location ?? null,
    createdAt: toIsoDate(event.createdAt),
    isFavorite: event.isFavorite,
    watchProgress: event.watchProgress,
  };
}

export function normalizeChannel(channel: Record<string, any>) {
  return {
    id: String(channel.id),
    name: channel.name ?? "",
    slug: channel.slug ?? "",
    description: channel.description ?? "",
    logo: channel.logo ?? null,
    coverImage: channel.coverImage ?? null,
    category: channel.category ?? "",
    isActive: Boolean(channel.isActive ?? true),
    subscriberCount: Number(channel.subscriberCount ?? 0),
    eventCount: Number(channel.eventCount ?? 0),
    country: channel.country ?? null,
    createdAt: toIsoDate(channel.createdAt),
  };
}

export function authHeaders(headers?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...(headers ?? {}),
  };
}

export async function querySingle<T = DocumentData>(
  path: string,
  constraints: QueryConstraint[],
): Promise<(T & { id: string }) | null> {
  const items = await readCollection<T>(path, [...constraints, limit(1)]);
  return items[0] ?? null;
}

export { auth, db, collection, deleteDoc, doc, getDoc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where };
