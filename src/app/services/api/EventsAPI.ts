// Events API Service pour FeetiPlay — connecté au backend réel

import BaseAPIService from './BaseAPI';

export interface StreamingEvent {
  id: string;
  title: string;
  description: string;
  date: string;          // ISO date
  time: string;          // HH:mm
  duration: string;      // ex: "2h30"
  image: string;
  channelId: string;
  channelName: string;
  category: string;
  tags: string[];
  isLive: boolean;
  isReplay: boolean;
  isFeatured: boolean;
  isFree: boolean;
  price?: number;
  currency: string;
  viewerCount?: number;
  hasTicket?: boolean;
  streamUrl?: string;
  location?: string;
  createdAt: string;
}

class EventsAPIService extends BaseAPIService {
  async getAll(): Promise<StreamingEvent[]> {
    const res = await this.request('events:all', () =>
      this.fetchApi<StreamingEvent[]>('/events')
    );
    return res.data ?? [];
  }

  async getById(id: string): Promise<StreamingEvent | null> {
    const res = await this.request(`events:${id}`, () =>
      this.fetchApi<StreamingEvent>(`/events/${id}`)
    );
    return res.data ?? null;
  }

  async getLive(): Promise<StreamingEvent[]> {
    const res = await this.request('events:live', () =>
      this.fetchApi<StreamingEvent[]>('/events?live=true'),
      { cache: false }
    );
    return res.data ?? [];
  }

  async getReplays(): Promise<StreamingEvent[]> {
    const res = await this.request('events:replays', () =>
      this.fetchApi<StreamingEvent[]>('/events?replay=true')
    );
    return res.data ?? [];
  }

  async getFeatured(): Promise<StreamingEvent[]> {
    const res = await this.request('events:featured', () =>
      this.fetchApi<StreamingEvent[]>('/events?featured=true')
    );
    return res.data ?? [];
  }

  async getByChannel(channelId: string): Promise<StreamingEvent[]> {
    const res = await this.request(`events:channel:${channelId}`, () =>
      this.fetchApi<StreamingEvent[]>(`/events?channelId=${encodeURIComponent(channelId)}`)
    );
    return res.data ?? [];
  }

  async getByCategory(category: string): Promise<StreamingEvent[]> {
    const res = await this.request(`events:category:${category}`, () =>
      this.fetchApi<StreamingEvent[]>(`/events?category=${encodeURIComponent(category)}`)
    );
    return res.data ?? [];
  }

  async search(query: string): Promise<StreamingEvent[]> {
    const res = await this.request(`events:search:${query}`, () =>
      this.fetchApi<StreamingEvent[]>(`/events?q=${encodeURIComponent(query)}`),
      { cache: false }
    );
    return res.data ?? [];
  }
}

const EventsAPI = new EventsAPIService();
export default EventsAPI;
