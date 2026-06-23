// AdminAPI — connecté aux routes /api/admin/* du backend FeetiPlay

import { fetchWithApiFallback } from '../../utils/serviceConfig';
import type { StreamingEvent } from './EventsAPI';

// Le token Firebase est injecté automatiquement par fetchWithApiFallback.
async function adminFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetchWithApiFallback(`/api/admin${endpoint}`, { ...options, useAdminToken: true });
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

export type AdminRole = 'super_admin' | 'admin' | 'finance' | 'moderator' | 'marketing';

export interface AdminAccountItem {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminLoginResult {
  admin: AdminAccountItem & { permissions: string[] };
  accessToken: string;
}

export interface AdminEventItem {
  id: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  isLive: boolean;
  isReplay: boolean;
  isFeatured: boolean;
  price: number;
  currency: string;
  viewerCount: number;
  image: string;
  category?: string;
  location?: string | null;
  streamUrl?: string | null;
  muxStreamId?: string | null;
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

export interface FinanceReportMonth {
  month: string;
  revenue: number;
  ticketCount: number;
  freeCount: number;
}

export interface FinanceReportEvent {
  eventId: string;
  title: string;
  category: string;
  revenue: number;
  ticketCount: number;
}

export interface FinanceReport {
  months: FinanceReportMonth[];
  topEvents: FinanceReportEvent[];
}

export interface TicketFilterParams {
  status?: string;
  dateFrom?: string;
  dateTo?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
  offset?: number;
}


// ── API methods ───────────────────────────────────────────────────────────

const AdminAPI = {
  async login(email: string, password: string): Promise<AdminLoginResult> {
    const response = await fetchWithApiFallback('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      useAdminToken: true,
    });
    const body = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    if (!response.ok) throw new Error(body.message ?? 'Erreur serveur');
    return body.data as AdminLoginResult;
  },

  async logout(): Promise<void> {
    await fetchWithApiFallback('/admin/auth/logout', { method: 'POST', useAdminToken: true }).catch(() => undefined);
  },

  async getMe(): Promise<AdminAccountItem & { permissions: string[] }> {
    const response = await fetchWithApiFallback('/admin/auth/me', { useAdminToken: true });
    const body = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    if (!response.ok) throw new Error(body.message ?? 'Erreur serveur');
    return body.data as AdminAccountItem & { permissions: string[] };
  },

  async getStats(): Promise<AdminStats> {
    return adminFetch<AdminStats>('/stats');
  },

  async getRecentEvents(limit = 10): Promise<AdminEventItem[]> {
    return adminFetch<AdminEventItem[]>(`/events/recent?limit=${limit}`);
  },

  async getRecentTickets(limit = 20): Promise<AdminTicketItem[]> {
    return adminFetch<AdminTicketItem[]>(`/tickets/recent?limit=${limit}`);
  },

  async getAllTickets(params?: TicketFilterParams): Promise<{ tickets: AdminTicketItem[]; total: number; limit: number; offset: number }> {
    const qs = new URLSearchParams();
    if (params?.status)   qs.set('status',   params.status);
    if (params?.dateFrom) qs.set('dateFrom', params.dateFrom);
    if (params?.dateTo)   qs.set('dateTo',   params.dateTo);
    if (params?.minPrice != null) qs.set('minPrice', String(params.minPrice));
    if (params?.maxPrice != null) qs.set('maxPrice', String(params.maxPrice));
    if (params?.limit)    qs.set('limit',    String(params.limit));
    if (params?.offset)   qs.set('offset',   String(params.offset));
    return adminFetch<{ tickets: AdminTicketItem[]; total: number; limit: number; offset: number }>(`/tickets?${qs}`);
  },

  async getFinanceReport(): Promise<FinanceReport> {
    return adminFetch<FinanceReport>('/finance/report');
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

  async getAdmins(): Promise<AdminAccountItem[]> {
    return adminFetch<AdminAccountItem[]>('/admins');
  },

  async createAdmin(data: { name: string; email: string; password: string; role: AdminRole; avatar?: string | null }): Promise<AdminAccountItem> {
    return adminFetch<AdminAccountItem>('/admins', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAdminRole(adminId: string, role: AdminRole): Promise<AdminAccountItem> {
    return adminFetch<AdminAccountItem>(`/admins/${adminId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },

  async deleteAdmin(adminId: string): Promise<void> {
    await adminFetch(`/admins/${adminId}`, { method: 'DELETE' });
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

  async createMuxLiveStream(data: { title?: string; eventId?: string }): Promise<{
    muxStreamId: string;
    streamKey: string;
    playbackId: string;
    rtmpUrl: string;
    status: string;
    linkedEventId: string | null;
    hint: string;
  }> {
    return adminFetch('/mux/live-streams', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async getMuxLiveStreamStatus(streamId: string): Promise<{ status: string; playbackId: string | null }> {
    return adminFetch(`/mux/live-streams/${streamId}/status`);
  },

  async disableMuxLiveStream(streamId: string): Promise<void> {
    await adminFetch(`/mux/live-streams/${streamId}/disable`, { method: 'POST' });
  },

  async hideEvent(eventId: string): Promise<void> {
    await adminFetch(`/events/${eventId}/hide`, { method: 'POST' });
  },

  async flagEvent(eventId: string): Promise<void> {
    await adminFetch(`/events/${eventId}/flag`, { method: 'POST' });
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

  async getSettings(): Promise<Record<string, string>> {
    return adminFetch<Record<string, string>>('/settings');
  },

  async updateSettings(data: Record<string, string>): Promise<Record<string, string>> {
    return adminFetch<Record<string, string>>('/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async getBackups(): Promise<Array<{ id: string; filename: string; size: number; status: string; createdAt: string }>> {
    return adminFetch<Array<{ id: string; filename: string; size: number; status: string; createdAt: string }>>('/backups');
  },

  async createBackup(): Promise<any> {
    return adminFetch<any>('/backups', { method: 'POST' });
  },

  async restoreBackup(id: string): Promise<void> {
    await adminFetch(`/backups/${id}/restore`, { method: 'POST' });
  },

  async getMonitoring(): Promise<{
    sentry: { enabled: boolean; dsn: string };
    metrics: {
      ram: { total: number; free: number; used: number; usagePercent: number };
      cpu: { model: string; cores: number; loadAvg: number[] };
      uptime: number;
      platform: string;
      arch: string;
    };
    errorLogs: Array<{ id: string; action: string; description: string; level: string; adminName: string; adminRole: string; createdAt: string }>;
  }> {
    return adminFetch<any>('/monitoring');
  },
};

export default AdminAPI;
