export type BackendProviderMode = "express" | "firebase";

export interface AuthUser {
  uid: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: "viewer" | "admin" | "super_admin";
  subscriptionPlan?: "free" | "basic" | "premium" | "vip";
  createdAt: string;
  updatedAt: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role?: "viewer";
}

export interface GoogleCompletionData {
  name: string;
  phone?: string;
  role?: "viewer";
}

export interface GoogleAuthStartResult {
  requiresCompletion: boolean;
  user?: AuthUser;
  prefill?: {
    name?: string;
    email?: string;
    avatar?: string | null;
  };
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  phone?: string | null;
  avatar?: string | null;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface StreamingEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  duration: string;
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
  streamUrl?: string | null;
  location?: string | null;
  country?: string | null;
  creatorId?: string | null;
  requiresSubscription?: boolean;
  subscriptionPrice?: number | null;
  createdAt: string;
  isFavorite?: boolean;
  watchProgress?: number;
}

export interface Channel {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string | null;
  coverImage?: string | null;
  category: string;
  isActive: boolean;
  subscriberCount: number;
  eventCount: number;
  country?: string | null;
  createdAt: string;
}

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
  source: "feeti2";
}

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
  status: "valid" | "used" | "expired";
  purchaseDate: string;
  price: number;
  currency: string;
  streamUrl?: string | null;
}

export interface WatchHistoryEntry {
  eventId: string;
  eventTitle: string;
  watchedAt: string;
  progress: number;
  duration: string;
}

export interface StreamAccess {
  hasAccess: boolean;
  reason?: "ticket_valid" | "subscription" | "free" | "no_ticket" | "subscription_required";
  streamUrl?: string | null;
  expiresAt?: string;
}

export interface FavoriteToggleResult {
  isFavorited: boolean;
}

export interface CheckoutPurchaseInput {
  eventId: string;
  eventSource: "feetiplay" | "feeti2";
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  price?: number;
  currency: string;
  holderName: string;
  holderEmail: string;
  holderPhone: string;
  paymentMethod: "card" | "mobile-money" | "paystack" | null;
  mobileOperator?: "mtn" | "orange" | "airtel";
}

export interface CheckoutPurchaseResult {
  orderId: string;
  accessCode?: string;
  paymentId: string;
  paymentProvider: "stripe" | "mobile_money" | "paystack";
  emailSent?: boolean;
}

export interface AuthStateListener {
  (user: AuthUser | null): void | Promise<void>;
}

export interface AuthProvider {
  readonly mode: BackendProviderMode;
  subscribe(listener: AuthStateListener): () => void;
  login(email: string, password: string): Promise<AuthUser>;
  register(data: RegisterData): Promise<AuthUser>;
  startGoogleAuth(): Promise<GoogleAuthStartResult>;
  completeGoogleRegistration(data: GoogleCompletionData): Promise<AuthUser>;
  logout(): Promise<void>;
  loginFromFeeti2SSO(token: string): Promise<AuthUser>;
  updateProfile(data: UpdateProfileData): Promise<AuthUser>;
  changePassword(data: ChangePasswordData): Promise<void>;
  deleteAccount(password: string): Promise<void>;
  getCurrentProfile(): Promise<AuthUser | null>;
}

export interface EventsProvider {
  readonly mode: BackendProviderMode;
  getAll(): Promise<StreamingEvent[]>;
  getById(id: string): Promise<StreamingEvent | null>;
  getLive(): Promise<StreamingEvent[]>;
  getReplays(): Promise<StreamingEvent[]>;
  getFeatured(): Promise<StreamingEvent[]>;
  getByChannel(channelId: string): Promise<StreamingEvent[]>;
  getByCategory(category: string): Promise<StreamingEvent[]>;
  search(query: string): Promise<StreamingEvent[]>;
  getFavorites(): Promise<StreamingEvent[]>;
  toggleFavorite(eventId: string): Promise<FavoriteToggleResult>;
}

export interface ChannelsProvider {
  readonly mode: BackendProviderMode;
  getAll(): Promise<Channel[]>;
  getById(id: string): Promise<Channel | null>;
  getBySlug(slug: string): Promise<Channel | null>;
  getByCategory(category: string): Promise<Channel[]>;
  search(query: string): Promise<Channel[]>;
}

export interface StreamingProvider {
  readonly mode: BackendProviderMode;
  checkAccess(eventId: string, userId: string): Promise<StreamAccess>;
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
  }): Promise<DigitalTicketData>;
  getMyTickets(userId: string): Promise<DigitalTicketData[]>;
  getTicketById(ticketId: string): Promise<DigitalTicketData | null>;
  getWatchHistory(userId: string): Promise<WatchHistoryEntry[]>;
  updateWatchProgress(eventId: string, eventTitle: string, progress: number, duration: string): Promise<void>;
  clearWatchHistory(): Promise<void>;
  getMuxToken(eventId: string): Promise<{ token: string | null; playbackId: string }>;
}

export interface Feeti2IntegrationProvider {
  readonly mode: BackendProviderMode;
  getStreamingEvents(): Promise<Feeti2Event[]>;
  getLiveEvents(): Promise<Feeti2Event[]>;
  getReplayEvents(): Promise<Feeti2Event[]>;
}

export interface CheckoutProvider {
  readonly mode: BackendProviderMode;
  purchaseAccess(input: CheckoutPurchaseInput): Promise<CheckoutPurchaseResult>;
}
