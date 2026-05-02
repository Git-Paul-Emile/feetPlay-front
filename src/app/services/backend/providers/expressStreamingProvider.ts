import { legacyApiFetch } from "../legacyApi";
import type { DigitalTicketData, StreamAccess, StreamingProvider, WatchHistoryEntry } from "../types";

export const expressStreamingProvider: StreamingProvider = {
  mode: "express",

  checkAccess(eventId: string) {
    return legacyApiFetch<StreamAccess>(`/streaming/access/${eventId}`);
  },

  purchaseTicket(params) {
    return legacyApiFetch<DigitalTicketData>("/streaming/tickets", {
      method: "POST",
      body: JSON.stringify({
        eventId: params.eventId,
        holderName: params.holderName,
        holderEmail: params.holderEmail,
      }),
    });
  },

  getMyTickets() {
    return legacyApiFetch<DigitalTicketData[]>("/streaming/tickets");
  },

  getTicketById(ticketId: string) {
    return legacyApiFetch<DigitalTicketData>(`/streaming/tickets/${ticketId}`).catch(() => null);
  },

  getWatchHistory() {
    return legacyApiFetch<WatchHistoryEntry[]>("/streaming/watch-history");
  },

  async updateWatchProgress(eventId: string, eventTitle: string, progress: number, duration: string) {
    await legacyApiFetch("/streaming/watch-history", {
      method: "POST",
      body: JSON.stringify({ eventId, eventTitle, progress, duration }),
    });
  },

  async clearWatchHistory() {
    await legacyApiFetch("/streaming/watch-history", { method: "DELETE" });
  },

  getMuxToken(eventId: string) {
    return legacyApiFetch<{ token: string | null; playbackId: string }>(`/streaming/mux-token/${eventId}`);
  },
};
