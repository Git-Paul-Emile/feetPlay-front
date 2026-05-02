import { backendGateway } from "../backend/gateway";
import type { DigitalTicketData, StreamAccess, WatchHistoryEntry } from "../backend/types";

const StreamingAPI = {
  checkAccess(eventId: string, userId: string): Promise<StreamAccess> {
    return backendGateway.streaming.checkAccess(eventId, userId);
  },

  purchaseTicket(params: {
    eventId: string;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    channelName: string;
    holderName: string;
    holderEmail: string;
    price: number;
    currency: string;
  }): Promise<DigitalTicketData> {
    return backendGateway.streaming.purchaseTicket(params);
  },

  getMyTickets(userId: string): Promise<DigitalTicketData[]> {
    return backendGateway.streaming.getMyTickets(userId);
  },

  getTicketById(ticketId: string): Promise<DigitalTicketData | null> {
    return backendGateway.streaming.getTicketById(ticketId);
  },

  getWatchHistory(userId: string): Promise<WatchHistoryEntry[]> {
    return backendGateway.streaming.getWatchHistory(userId);
  },

  updateWatchProgress(eventId: string, eventTitle: string, progress: number, duration: string): Promise<void> {
    return backendGateway.streaming.updateWatchProgress(eventId, eventTitle, progress, duration);
  },

  clearWatchHistory(): Promise<void> {
    return backendGateway.streaming.clearWatchHistory();
  },

  getMuxToken(eventId: string): Promise<{ token: string | null; playbackId: string }> {
    return backendGateway.streaming.getMuxToken(eventId);
  },
};

export type { DigitalTicketData, WatchHistoryEntry, StreamAccess };
export default StreamingAPI;
