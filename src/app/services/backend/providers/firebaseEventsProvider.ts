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
  where,
} from "firebase/firestore";
import { auth, db } from "../../../config/firebase";
import { normalizeStreamingEvent, toIsoDate } from "../helpers";
import type { EventsProvider, FavoriteToggleResult, StreamingEvent } from "../types";

async function loadEvents(filters: Array<ReturnType<typeof where>> = []) {
  const snap = await getDocs(query(collection(db, "streaming_events"), ...filters, orderBy("createdAt", "desc")));
  return snap.docs.map((item) => normalizeStreamingEvent({ id: item.id, ...item.data() }));
}

async function markFavorites(events: StreamingEvent[]) {
  const user = auth.currentUser;
  if (!user || events.length === 0) {
    return events;
  }

  const checks = await Promise.all(events.map((event) => getDoc(doc(db, "favorites", `${user.uid}_${event.id}`))));
  return events.map((event, index) => ({
    ...event,
    isFavorite: checks[index]?.exists() ?? false,
  }));
}

export const firebaseEventsProvider: EventsProvider = {
  mode: "firebase",

  async getAll() {
    return markFavorites(await loadEvents());
  },

  async getById(id: string) {
    const snap = await getDoc(doc(db, "streaming_events", id));
    if (!snap.exists()) {
      return null;
    }

    const event = normalizeStreamingEvent({ id: snap.id, ...snap.data() });
    return (await markFavorites([event]))[0] ?? null;
  },

  getLive() {
    return loadEvents([where("isLive", "==", true)]);
  },

  getReplays() {
    return loadEvents([where("isReplay", "==", true)]);
  },

  getFeatured() {
    return loadEvents([where("isFeatured", "==", true)]);
  },

  getByChannel(channelId: string) {
    return loadEvents([where("channelId", "==", channelId)]);
  },

  getByCategory(category: string) {
    return loadEvents([where("category", "==", category)]);
  },

  async search(searchTerm: string) {
    const normalized = searchTerm.trim().toLowerCase();
    if (!normalized) {
      return this.getAll();
    }

    const events = await this.getAll();
    return events.filter((event) => {
      const haystack = [
        event.title,
        event.description,
        event.category,
        event.channelName,
        ...event.tags,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalized);
    });
  },

  async getFavorites() {
    const user = auth.currentUser;
    if (!user) {
      return [];
    }

    const favSnap = await getDocs(
      query(collection(db, "favorites"), where("userId", "==", user.uid), orderBy("createdAt", "desc")),
    );
    const eventSnaps = await Promise.all(
      favSnap.docs.map((favorite) => getDoc(doc(db, "streaming_events", String(favorite.data().eventId)))),
    );

    return eventSnaps
      .filter((snap) => snap.exists())
      .map((snap) => normalizeStreamingEvent({ id: snap.id, ...snap.data(), isFavorite: true }));
  },

  async toggleFavorite(eventId: string): Promise<FavoriteToggleResult> {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Veuillez vous connecter pour continuer");
    }

    const eventSnap = await getDoc(doc(db, "streaming_events", eventId));
    if (!eventSnap.exists()) {
      throw new Error("Evenement introuvable");
    }

    const favoriteId = `${user.uid}_${eventId}`;
    const favoriteRef = doc(db, "favorites", favoriteId);
    const favoriteSnap = await getDoc(favoriteRef);

    if (favoriteSnap.exists()) {
      await deleteDoc(favoriteRef);
      return { isFavorited: false };
    }

    await setDoc(favoriteRef, {
      userId: user.uid,
      eventId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdAtIso: toIsoDate(new Date()),
    });
    return { isFavorited: true };
  },
};
