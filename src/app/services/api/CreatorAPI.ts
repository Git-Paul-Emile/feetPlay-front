import { fetchWithApiFallback } from "../../utils/serviceConfig";

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
  streamUrl?: string | null;
  createdAt: string;
  updatedAt: string;
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

  async getAll(category?: string): Promise<Creator[]> {
    const qs = category ? `?category=${encodeURIComponent(category)}` : "";
    return creatorFetch(`/${qs}`);
  },

  async getBySlug(slug: string): Promise<Creator & { videos: CreatorVideo[] }> {
    return creatorFetch(`/${slug}`);
  },

  async subscribe(creatorId: string): Promise<{ subscribed: boolean }> {
    return creatorFetch(`/${creatorId}/subscribe`, { method: "POST" });
  },

  async unsubscribe(creatorId: string): Promise<{ subscribed: boolean }> {
    return creatorFetch(`/${creatorId}/subscribe`, { method: "DELETE" });
  },

  async getSubscriptionStatus(creatorId: string): Promise<{ subscribed: boolean }> {
    return creatorFetch(`/${creatorId}/subscription`);
  },

  async getMyVideos(): Promise<CreatorVideo[]> {
    return creatorFetch("/me/videos");
  },

  async createVideo(data: Partial<CreatorVideo>): Promise<CreatorVideo> {
    return creatorFetch("/me/videos", { method: "POST", body: JSON.stringify(data) });
  },

  async updateVideo(videoId: string, data: Partial<CreatorVideo>): Promise<CreatorVideo> {
    return creatorFetch(`/me/videos/${videoId}`, { method: "PATCH", body: JSON.stringify(data) });
  },

  async deleteVideo(videoId: string): Promise<void> {
    return creatorFetch(`/me/videos/${videoId}`, { method: "DELETE" });
  },
};

export default CreatorAPI;
