// Service d'intégration feeti2 → feetiPlay
// Récupère les événements streaming de feeti2 via le backend feetiPlay (proxy)

import BaseAPIService from './BaseAPI';

export interface Feeti2Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
  image: string;
  category: string;
  isLive: boolean;
  isFeatured: boolean;
  streamUrl: string | null;
  videoUrl: string | null;
  isFree: boolean;
  price: number;
  currency: string;
  channelName: string;
  country: string | null;
  source: 'feeti2';
}

class Feeti2EventsAPIService extends BaseAPIService {
  async getStreamingEvents(): Promise<Feeti2Event[]> {
    const res = await this.request<Feeti2Event[]>(
      'feeti2:streaming-events',
      () => this.fetchApi<Feeti2Event[]>('/integration/feeti2-events'),
      { cache: true, cacheDuration: 2 * 60 * 1000 } as any,
    );
    return res.data ?? [];
  }

  async getLiveEvents(): Promise<Feeti2Event[]> {
    const events = await this.getStreamingEvents();
    return events.filter(e => e.isLive);
  }

  async getReplayEvents(): Promise<Feeti2Event[]> {
    const events = await this.getStreamingEvents();
    return events.filter(e => !e.isLive && e.videoUrl);
  }
}

const Feeti2EventsAPI = new Feeti2EventsAPIService();
export default Feeti2EventsAPI;
