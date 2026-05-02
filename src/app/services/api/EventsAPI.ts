import { backendGateway } from "../backend/gateway";
import type { FavoriteToggleResult, StreamingEvent } from "../backend/types";

const EventsAPI = {
  getAll(): Promise<StreamingEvent[]> {
    return backendGateway.events.getAll();
  },

  getById(id: string): Promise<StreamingEvent | null> {
    return backendGateway.events.getById(id);
  },

  getLive(): Promise<StreamingEvent[]> {
    return backendGateway.events.getLive();
  },

  getReplays(): Promise<StreamingEvent[]> {
    return backendGateway.events.getReplays();
  },

  getFeatured(): Promise<StreamingEvent[]> {
    return backendGateway.events.getFeatured();
  },

  getByChannel(channelId: string): Promise<StreamingEvent[]> {
    return backendGateway.events.getByChannel(channelId);
  },

  getByCategory(category: string): Promise<StreamingEvent[]> {
    return backendGateway.events.getByCategory(category);
  },

  search(query: string): Promise<StreamingEvent[]> {
    return backendGateway.events.search(query);
  },

  getFavorites(): Promise<StreamingEvent[]> {
    return backendGateway.events.getFavorites();
  },

  toggleFavorite(eventId: string): Promise<FavoriteToggleResult> {
    return backendGateway.events.toggleFavorite(eventId);
  },
};

export type { StreamingEvent, FavoriteToggleResult };
export default EventsAPI;
