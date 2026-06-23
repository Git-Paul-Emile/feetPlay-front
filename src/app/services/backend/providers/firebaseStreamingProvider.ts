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
import type { DigitalTicketData, StreamAccess, StreamingEvent, StreamingProvider, WatchHistoryEntry } from "../types";

function requireUser() {
  if (!auth.currentUser) {
    throw new Error("Veuillez vous connecter pour continuer");
  }
  return auth.currentUser;
}

function mapTicket(id: string, data: Record<string, any>): DigitalTicketData {
  return {
    id,
    eventId: data.eventId ?? "",
    eventTitle: data.eventTitle ?? "",
    eventDate: data.eventDate ?? "",
    eventTime: data.eventTime ?? "",
    channelName: data.channelName ?? "",
    holderName: data.holderName ?? "",
    holderEmail: data.holderEmail ?? "",
    qrCode: data.qrCode ?? data.qrData ?? id,
    status: data.status ?? "valid",
    purchaseDate: typeof data.purchaseDate === "string" ? data.purchaseDate : new Date().toISOString(),
    price: Number(data.price ?? 0),
    currency: data.currency ?? "FCFA",
    streamUrl: data.streamUrl ?? null,
  };
}

async function getEvent(eventId: string): Promise<(StreamingEvent & { id: string }) | null> {
  const snap = await getDoc(doc(db, "streaming_events", eventId));
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as StreamingEvent) }) : null;
}

export const firebaseStreamingProvider: StreamingProvider = {
  mode: "firebase",

  async checkAccess(eventId: string): Promise<StreamAccess> {
    const user = auth.currentUser;
    const event = await getEvent(eventId);
    if (!event) {
      return { hasAccess: false, reason: "no_ticket" };
    }

    if (event.isFree) {
      return { hasAccess: true, reason: "free", streamUrl: event.streamUrl ?? null };
    }

    if (!user) {
      return { hasAccess: false, reason: "subscription_required" };
    }

    const ticketId = `${user.uid}_${eventId}`;
    const ticketSnap = await getDoc(doc(db, "tickets", ticketId));
    if (ticketSnap.exists() && (ticketSnap.data().status ?? "valid") === "valid") {
      return { hasAccess: true, reason: "ticket_valid", streamUrl: event.streamUrl ?? null };
    }

    const userSnap = await getDoc(doc(db, "users", user.uid));
    const role = userSnap.exists() ? String(userSnap.data().role ?? "viewer") : "viewer";
    if (["admin", "super_admin"].includes(role)) {
      return { hasAccess: true, reason: "subscription", streamUrl: event.streamUrl ?? null };
    }

    return { hasAccess: false, reason: "subscription_required" };
  },

  async purchaseTicket(params) {
    const user = requireUser();
    const existingId = `${user.uid}_${params.eventId}`;
    const ticketRef = doc(db, "tickets", existingId);
    const existing = await getDoc(ticketRef);
    if (existing.exists()) {
      return mapTicket(existing.id, existing.data() as Record<string, any>);
    }

    const payload = {
      eventId: params.eventId,
      userId: user.uid,
      eventTitle: params.eventTitle,
      eventDate: params.eventDate,
      eventTime: params.eventTime,
      channelName: params.channelName,
      holderName: params.holderName,
      holderEmail: params.holderEmail,
      qrCode: `FP-${params.eventId}-${user.uid}`,
      status: "valid",
      price: params.price,
      currency: params.currency,
      purchaseDate: new Date().toISOString(),
      streamUrl: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(ticketRef, payload);
    return mapTicket(ticketRef.id, payload);
  },

  async getMyTickets() {
    const user = requireUser();
    const snap = await getDocs(query(collection(db, "tickets"), where("userId", "==", user.uid), orderBy("purchaseDate", "desc")));
    return snap.docs.map((item) => mapTicket(item.id, item.data() as Record<string, any>));
  },

  async getTicketById(ticketId: string) {
    const user = requireUser();
    const snap = await getDoc(doc(db, "tickets", ticketId));
    if (!snap.exists()) {
      return null;
    }
    const data = snap.data() as Record<string, any>;
    if (data.userId && data.userId !== user.uid) {
      throw new Error("Acces refuse");
    }
    return mapTicket(snap.id, data);
  },

  async getWatchHistory() {
    const user = requireUser();
    const snap = await getDocs(
      query(collection(db, "watch_history"), where("userId", "==", user.uid), orderBy("watchedAt", "desc")),
    );
    return snap.docs.map((item) => {
      const data = item.data() as Record<string, any>;
      return {
        eventId: data.eventId ?? "",
        eventTitle: data.eventTitle ?? "",
        watchedAt: typeof data.watchedAt === "string" ? data.watchedAt : new Date().toISOString(),
        progress: Number(data.progress ?? 0),
        duration: data.duration ?? "",
      } satisfies WatchHistoryEntry;
    });
  },

  async updateWatchProgress(eventId: string, eventTitle: string, progress: number, duration: string) {
    const user = requireUser();
    await setDoc(
      doc(db, "watch_history", `${user.uid}_${eventId}`),
      {
        userId: user.uid,
        eventId,
        eventTitle,
        progress: Math.min(100, Math.max(0, progress)),
        duration,
        watchedAt: new Date().toISOString(),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
  },

  async clearWatchHistory() {
    const user = requireUser();
    const snap = await getDocs(query(collection(db, "watch_history"), where("userId", "==", user.uid), limit(200)));
    await Promise.all(snap.docs.map((item) => deleteDoc(item.ref)));
  },

  async getMuxToken(eventId: string) {
    const access = await this.checkAccess(eventId, "me");
    if (!access.hasAccess || !access.streamUrl) {
      throw new Error("Acces refuse");
    }
    return { token: null, playbackId: access.streamUrl };
  },
};
