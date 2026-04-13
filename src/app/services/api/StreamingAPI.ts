// Streaming API Service pour FeetiPlay — connecté au backend réel

import BaseAPIService from './BaseAPI';

export interface DigitalTicketData {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  channelName: string;
  holderName: string;
  holderEmail: string;
  qrCode: string;
  status: 'valid' | 'used' | 'expired';
  purchaseDate: string;
  price: number;
  currency: string;
  streamUrl?: string;
}

export interface WatchHistoryEntry {
  eventId: string;
  eventTitle: string;
  watchedAt: string;
  progress: number; // 0-100 %
  duration: string;
}

export interface StreamAccess {
  hasAccess: boolean;
  reason?: 'ticket_valid' | 'subscription' | 'free' | 'no_ticket' | 'subscription_required';
  streamUrl?: string;
  expiresAt?: string;
}

class StreamingAPIService extends BaseAPIService {

  // ── Accès au stream ──────────────────────────────────────────────────────

  async checkAccess(eventId: string, _userId: string): Promise<StreamAccess> {
    const res = await this.request(`access:${eventId}`, () =>
      this.fetchApi<StreamAccess>(`/streaming/access/${eventId}`),
      { cache: false }
    );
    return res.data ?? { hasAccess: false, reason: 'no_ticket' };
  }

  // ── Tickets numériques ───────────────────────────────────────────────────

  async purchaseTicket(params: {
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
    const res = await this.request(`purchase:${params.eventId}`, () =>
      this.fetchApi<DigitalTicketData>('/streaming/tickets', {
        method: 'POST',
        body: JSON.stringify({
          eventId: params.eventId,
          holderName: params.holderName,
          holderEmail: params.holderEmail,
        }),
      }),
      { cache: false, deduplicate: false }
    );
    if (!res.data) throw new Error('Erreur lors de l\'achat du ticket');
    this.invalidateCache('tickets');
    return res.data;
  }

  async getMyTickets(_userId: string): Promise<DigitalTicketData[]> {
    const res = await this.request('tickets:mine', () =>
      this.fetchApi<DigitalTicketData[]>('/streaming/tickets'),
      { cache: false }
    );
    return res.data ?? [];
  }

  async getTicketById(ticketId: string): Promise<DigitalTicketData | null> {
    const res = await this.request(`ticket:${ticketId}`, () =>
      this.fetchApi<DigitalTicketData>(`/streaming/tickets/${ticketId}`)
    );
    return res.data ?? null;
  }

  // ── Historique de visionnage ─────────────────────────────────────────────

  async getWatchHistory(_userId: string): Promise<WatchHistoryEntry[]> {
    const res = await this.request('watch-history', () =>
      this.fetchApi<WatchHistoryEntry[]>('/streaming/watch-history'),
      { cache: false }
    );
    return res.data ?? [];
  }

  async updateWatchProgress(eventId: string, eventTitle: string, progress: number, duration: string): Promise<void> {
    await this.fetchApi('/streaming/watch-history', {
      method: 'POST',
      body: JSON.stringify({ eventId, eventTitle, progress, duration }),
    }).catch(console.error);
    this.invalidateCache('watch-history');
  }

  async clearWatchHistory(): Promise<void> {
    await this.fetchApi('/streaming/watch-history', { method: 'DELETE' });
    this.invalidateCache('watch-history');
  }

  // ── Signed token Mux (pour contenu premium) ──────────────────────────────

  async getMuxToken(eventId: string): Promise<{ token: string | null; playbackId: string }> {
    const res = await this.request(`mux-token:${eventId}`, () =>
      this.fetchApi<{ token: string | null; playbackId: string }>(`/streaming/mux-token/${eventId}`),
      { cache: false }
    );
    if (!res.data) throw new Error('Impossible de récupérer le token de lecture');
    return res.data;
  }
}

const StreamingAPI = new StreamingAPIService();
export default StreamingAPI;
