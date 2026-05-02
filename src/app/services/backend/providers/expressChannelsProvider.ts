import { legacyApiFetch } from "../legacyApi";
import type { Channel, ChannelsProvider } from "../types";

export const expressChannelsProvider: ChannelsProvider = {
  mode: "express",

  getAll() {
    return legacyApiFetch<Channel[]>("/channels");
  },

  getById(id: string) {
    return legacyApiFetch<Channel>(`/channels/${id}`).catch(() => null);
  },

  getBySlug(slug: string) {
    return legacyApiFetch<Channel>(`/channels/slug/${slug}`).catch(() => null);
  },

  getByCategory(category: string) {
    return legacyApiFetch<Channel[]>(`/channels?category=${encodeURIComponent(category)}`);
  },

  search(query: string) {
    return legacyApiFetch<Channel[]>(`/channels?q=${encodeURIComponent(query)}`);
  },
};
