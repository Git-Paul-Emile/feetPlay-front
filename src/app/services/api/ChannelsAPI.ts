// Channels API Service pour FeetiPlay — connecté au backend réel

import BaseAPIService from './BaseAPI';

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  coverImage?: string;
  category: string;
  isActive: boolean;
  subscriberCount: number;
  eventCount: number;
  country?: string;
  createdAt: string;
}

class ChannelsAPIService extends BaseAPIService {
  async getAll(): Promise<Channel[]> {
    const res = await this.request('channels:all', () =>
      this.fetchApi<Channel[]>('/channels')
    );
    return res.data ?? [];
  }

  async getById(id: string): Promise<Channel | null> {
    const res = await this.request(`channels:${id}`, () =>
      this.fetchApi<Channel>(`/channels/${id}`)
    );
    return res.data ?? null;
  }

  async getBySlug(slug: string): Promise<Channel | null> {
    const res = await this.request(`channels:slug:${slug}`, () =>
      this.fetchApi<Channel>(`/channels/slug/${slug}`)
    );
    return res.data ?? null;
  }

  async getByCategory(category: string): Promise<Channel[]> {
    const res = await this.request(`channels:category:${category}`, () =>
      this.fetchApi<Channel[]>(`/channels?category=${encodeURIComponent(category)}`)
    );
    return res.data ?? [];
  }

  async search(query: string): Promise<Channel[]> {
    const res = await this.request(`channels:search:${query}`, () =>
      this.fetchApi<Channel[]>(`/channels?q=${encodeURIComponent(query)}`),
      { cache: false }
    );
    return res.data ?? [];
  }
}

const ChannelsAPI = new ChannelsAPIService();
export default ChannelsAPI;
