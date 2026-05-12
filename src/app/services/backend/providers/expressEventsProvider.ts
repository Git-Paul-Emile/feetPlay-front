import { legacyApiFetch } from "../legacyApi";
import type { EventsProvider, FavoriteToggleResult, StreamingEvent } from "../types";

export const expressEventsProvider: EventsProvider = {
  mode: "express",

  getAll() {
    return legacyApiFetch<StreamingEvent[]>("/events");
  },

  getById(id: string) {
    return legacyApiFetch<StreamingEvent>(`/events/${id}`).catch(() => null);
  },

  getLive() {
    return legacyApiFetch<StreamingEvent[]>("/events?live=true");
  },

  getReplays() {
    return legacyApiFetch<StreamingEvent[]>("/events?replay=true");
  },

  getFeatured() {
    return legacyApiFetch<StreamingEvent[]>("/events?featured=true");
  },

  getByChannel(channelId: string) {
    return legacyApiFetch<StreamingEvent[]>(`/events?channelId=${encodeURIComponent(channelId)}`);
  },

  getByCategory(category: string) {
    return legacyApiFetch<StreamingEvent[]>(`/events?category=${encodeURIComponent(category)}`);
  },

  getFavorites() {
    return legacyApiFetch<StreamingEvent[]>("/events/favorites");
  },

  toggleFavorite(eventId: string): Promise<FavoriteToggleResult> {
    return legacyApiFetch<{ isFavorite?: boolean; isFavorited?: boolean }>(`/events/${eventId}/favorite`, {
      method: "POST",
    }).then((result) => ({
      isFavorited: Boolean(result.isFavorited ?? result.isFavorite),
    }));
  },

  search(query: string) {
    return legacyApiFetch<StreamingEvent[]>(`/events?q=${encodeURIComponent(query)}`);
  },
};
