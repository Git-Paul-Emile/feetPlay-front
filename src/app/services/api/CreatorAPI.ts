import { fetchWithApiFallback } from "../../utils/serviceConfig";

// Utilisez une clé différente pour éviter d'écraser le token viewer
export const CREATOR_TOKEN_KEY = "feetiplay_creator_token";

export interface Creator {
  id: string;
  name: string;
  email?: string;
  channelName: string;
  channelSlug: string;
  category: string;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  isVerified: boolean;
  isActive: boolean;
  subscriberCount: number;
  videoCount: number;
  totalRevenue?: number;
  createdAt: string;
  updatedAt?: string;
  _count?: { subscriptions: number; videos: number };
}

export interface CreatorVideo {
  id: string;
  creatorId: string;
  title: string;
  description?: string | null;
  thumbnail?: string | null;
  videoUrl?: string | null;
  duration?: string | null;
  category?: string | null;
  viewCount: number;
  isPublished: boolean;
  isLive: boolean;
  isReplay?: boolean;
  streamUrl?: string | null;
  muxStreamId?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorStreamConfig {
  streamKey: string;
  rtmpUrl: string;
  muxStreamId?: string | null;
  playbackId?: string | null;
  hint?: string;
}

export interface CreatorRegisterData {
  name: string;
  email: string;
  password: string;
  channelName: string;
  channelSlug: string;
  category: string;
  bio?: string;
}

export interface CreatorLoginData {
  email: string;
  password: string;
}

export interface CreatorUpdateProfileData {
  name?: string;
  bio?: string | null;
  avatar?: string | null;
  coverImage?: string | null;
  category?: string;
  channelName?: string;
  channelSlug?: string;
}

export interface CreatorVideoInput {
  title: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
  category?: string;
  isPublished?: boolean;
  isLive?: boolean;
  isReplay?: boolean;
  streamUrl?: string;
  requiresSubscription?: boolean;
  subscriptionPrice?: number;
}

export interface CreatorDashboardStats {
  subscriberCount: number;
  videoCount: number;
  totalRevenue: number;
  topVideos: Pick<CreatorVideo, "id" | "title" | "viewCount" | "thumbnail" | "isPublished" | "isLive" | "createdAt">[];
}

function getCreatorToken(): string | null {
  return window.localStorage.getItem(CREATOR_TOKEN_KEY);
}

async function creatorFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = getCreatorToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  };
  const response = await fetchWithApiFallback(`/creators${endpoint}`, { ...options, headers });
  const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
  if (!response.ok) {
    const err: any = new Error(body.message ?? "Erreur serveur");
    err.status = response.status;
    err.errors = body.errors;
    throw err;
  }
  return body.data as T;
}

const CreatorAPI = {
  async register(data: CreatorRegisterData): Promise<{ creator: Creator; accessToken: string }> {
    return creatorFetch("/register", { method: "POST", body: JSON.stringify(data) });
  },

  async login(data: CreatorLoginData): Promise<{ creator: Creator; accessToken: string }> {
    return creatorFetch("/login", { method: "POST", body: JSON.stringify(data) });
  },

  async logout(): Promise<void> {
    await creatorFetch("/logout", { method: "POST" }).catch(() => undefined);
    window.localStorage.removeItem(CREATOR_TOKEN_KEY);
  },

  async getMe(): Promise<Creator> {
    return creatorFetch("/me");
  },

  async updateProfile(data: CreatorUpdateProfileData): Promise<Creator> {
    return creatorFetch("/profile", { method: "PATCH", body: JSON.stringify(data) });
  },

  async getDashboard(): Promise<CreatorDashboardStats> {
    return creatorFetch("/dashboard");
  },

  async getStreamConfig(): Promise<CreatorStreamConfig> {
    return creatorFetch("/me/stream-config");
  },

  async regenerateStreamKey(): Promise<CreatorStreamConfig> {
    return creatorFetch("/me/stream-config/regenerate", { method: "POST" });
  },

  async getAll(category?: string): Promise<Creator[]> {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    const response = await fetchWithApiFallback(`/creators${qs}`);
    const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
    if (!response.ok) throw new Error(body.message ?? "Erreur serveur");
    return body.data as Creator[];
  },

  async getBySlug(slug: string): Promise<Creator & { videos: CreatorVideo[] }> {
    const response = await fetchWithApiFallback(`/creators/${slug}`);
    const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
    if (!response.ok) throw new Error(body.message ?? "Erreur serveur");
    return body.data as Creator & { videos: CreatorVideo[] };
  },

  async subscribe(creatorId: string, plan: "free" | "paid" = "paid"): Promise<{ subscribed: boolean }> {
    const response = await fetchWithApiFallback(`/creators/${creatorId}/subscribe`, {
      method: "POST",
      body: JSON.stringify({ plan }),
    });
    const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
    if (!response.ok) throw new Error(body.message ?? "Erreur serveur");
    return body.data as { subscribed: boolean };
  },

  async unsubscribe(creatorId: string): Promise<{ subscribed: boolean }> {
    const response = await fetchWithApiFallback(`/creators/${creatorId}/subscribe`, { method: "DELETE" });
    const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
    if (!response.ok) throw new Error(body.message ?? "Erreur serveur");
    return body.data as { subscribed: boolean };
  },

  async getSubscriptionStatus(creatorId: string): Promise<{ subscribed: boolean }> {
    const response = await fetchWithApiFallback(`/creators/${creatorId}/subscription`);
    const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
    if (!response.ok) throw new Error(body.message ?? "Erreur serveur");
    return body.data as { subscribed: boolean };
  },

  async getMyVideos(): Promise<CreatorVideo[]> {
    return creatorFetch("/me/videos");
  },

  async createVideo(data: CreatorVideoInput): Promise<CreatorVideo> {
    return creatorFetch("/me/videos", { method: "POST", body: JSON.stringify(data) });
  },

  async updateVideo(videoId: string, data: Partial<CreatorVideoInput>): Promise<CreatorVideo> {
    return creatorFetch(`/me/videos/${videoId}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  async deleteVideo(videoId: string): Promise<void> {
    await creatorFetch(`/me/videos/${videoId}`, { method: "DELETE" });
  },

  // ── Public Videos ──

  async getVideoById(videoId: string): Promise<CreatorVideo & { creator: { id: string; channelName: string; channelSlug: string; avatar: string | null } }> {
    const response = await fetchWithApiFallback(`/creators/videos/${videoId}`);
    const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
    if (!response.ok) throw new Error(body.message ?? "Erreur serveur");
    return body.data;
  },

  async checkVideoAccess(videoId: string): Promise<{ hasAccess: boolean; reason: string }> {
    const response = await fetchWithApiFallback(`/creators/videos/${videoId}/access`, {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("feetiplay_token") ?? ""}`,
      },
    });
    const body = await response.json().catch(() => ({ message: "Erreur serveur" }));
    if (!response.ok) throw new Error(body.message ?? "Erreur serveur");
    return body.data;
  },
};

export default CreatorAPI;
