// AdminAPI — connecté aux routes /api/admin/* du backend FeetiPlay

import { fetchWithApiFallback } from '../../utils/serviceConfig';
import type { StreamingEvent } from './EventsAPI';

// Le token Firebase est injecté automatiquement par fetchWithApiFallback.
async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithApiFallback(`/api/admin${endpoint}`, options);
  const body = await res.json().catch(() => ({ message: 'Erreur serveur' }));
  if (!res.ok) throw new Error(body.message ?? 'Erreur serveur');
  return body.data as T;
}

// ── Types ─────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalUsers: number;
  newUsersThisMonth: number;
  totalEvents: number;
  liveEvents: number;
  totalTickets: number;
  ticketsThisMonth: number;
  totalRevenue: number;
  revenueThisMonth: number;
  totalChannels: number;
}

export interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  subscriptionPlan: string;
  avatar: string | null;
  createdAt: string;
  _count: { tickets: number; favorites: number; watchHistory: number };
}

export interface AdminEventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  isLive: boolean;
  isReplay: boolean;
  isFeatured: boolean;
  price: number;
  currency: string;
  viewerCount: number;
  image: string;
  channel: { name: string };
  _count: { tickets: number };
}

export interface AdminTicketItem {
  id: string;
  price: number;
  currency: string;
  purchaseDate: string;
  status: string;
  user: { name: string; email: string };
  event: { title: string };
}

export interface AdminChannel {
  id: string;
  name: string;
  slug: string;
  category: string;
  isActive: boolean;
  subscriberCount: number;
  eventCount: number;
  _count: { events: number };
}

export interface AdminEventCreateInput {
  title: string;
  description: string;
  date: string;
  time: string;
  duration?: string;
  image?: string;
  channelId: string;
  channelName: string;
  category: string;
  isLive?: boolean;
  isReplay?: boolean;
  isFeatured?: boolean;
  price?: number;
  currency?: string;
  streamUrl?: string;
  location?: string;
}

export type AdminEventUpdateInput = Partial<AdminEventCreateInput>;

export interface SystemLogItem {
  id: string;
  action: string;
  description: string;
  level: 'info' | 'success' | 'warning' | 'error';
  adminName: string;
  adminRole: string;
  ipAddress: string | null;
  createdAt: string;
}

export interface CreateLogInput {
  action: string;
  description: string;
  level?: 'info' | 'success' | 'warning' | 'error';
  adminName: string;
  adminRole: string;
}

export interface AdminNotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'promo' | 'maintenance';
  audience: 'all' | 'premium' | 'free';
  sentBy: string;
  sentAt: string;
  readCount: number;
}

export interface SendNotificationInput {
  title: string;
  message: string;
  type?: 'info' | 'warning' | 'promo' | 'maintenance';
  audience?: 'all' | 'premium' | 'free';
  sentBy: string;
}

// ── API methods ───────────────────────────────────────────────────────────

const AdminAPI = {
  async getStats(): Promise<AdminStats> {
    return adminFetch<AdminStats>('/stats');
  },

  async getRecentEvents(limit = 10): Promise<AdminEventItem[]> {
    return adminFetch<AdminEventItem[]>(`/events/recent?limit=${limit}`);
  },

  async getRecentTickets(limit = 20): Promise<AdminTicketItem[]> {
    return adminFetch<AdminTicketItem[]>(`/tickets/recent?limit=${limit}`);
  },

  async getChannels(): Promise<AdminChannel[]> {
    return adminFetch<AdminChannel[]>('/channels');
  },

  async getUsers(params?: { role?: string; search?: string; limit?: number; offset?: number }): Promise<{ users: AdminUserItem[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.role)   qs.set('role', params.role);
    if (params?.search) qs.set('search', params.search);
    if (params?.limit)  qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return adminFetch<{ users: AdminUserItem[]; total: number }>(`/users?${qs}`);
  },

  async updateUserRole(userId: string, role: string): Promise<void> {
    await adminFetch(`/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async deleteUser(userId: string): Promise<void> {
    await adminFetch(`/users/${userId}`, { method: 'DELETE' });
  },

  async createEvent(data: AdminEventCreateInput): Promise<StreamingEvent> {
    return adminFetch<StreamingEvent>('/events', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEvent(eventId: string, data: AdminEventUpdateInput): Promise<StreamingEvent> {
    return adminFetch<StreamingEvent>(`/events/${eventId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async deleteEvent(eventId: string): Promise<void> {
    await adminFetch(`/events/${eventId}`, { method: 'DELETE' });
  },

  async getLogs(params?: { level?: string; search?: string; limit?: number; offset?: number }): Promise<{ logs: SystemLogItem[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.level)  qs.set('level', params.level);
    if (params?.search) qs.set('search', params.search);
    if (params?.limit)  qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return adminFetch<{ logs: SystemLogItem[]; total: number }>(`/logs?${qs}`);
  },

  async createLog(data: CreateLogInput): Promise<SystemLogItem> {
    return adminFetch<SystemLogItem>('/logs', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getNotifications(params?: { limit?: number; offset?: number }): Promise<{ notifications: AdminNotificationItem[]; total: number }> {
    const qs = new URLSearchParams();
    if (params?.limit)  qs.set('limit', String(params.limit));
    if (params?.offset) qs.set('offset', String(params.offset));
    return adminFetch<{ notifications: AdminNotificationItem[]; total: number }>(`/notifications?${qs}`);
  },

  async sendNotification(data: SendNotificationInput): Promise<AdminNotificationItem> {
    return adminFetch<AdminNotificationItem>('/notifications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteNotification(id: string): Promise<void> {
    await adminFetch(`/notifications/${id}`, { method: 'DELETE' });
  },
};

export default AdminAPI;
