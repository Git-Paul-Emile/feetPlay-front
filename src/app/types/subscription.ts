export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | 'pending';
export type SubscriptionTier = 'basic' | 'premium' | 'vip';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type ContentType = 'video' | 'post' | 'podcast' | 'live_stream';

export interface SubscriptionPlan {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  tier: SubscriptionTier;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  isActive: boolean;
}

export interface UserSubscription {
  id: string;
  userId: string;
  creatorId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  amount: number;
  currency: string;
  autoRenew: boolean;
  cancelledAt?: string;
  cancelReason?: string;
}

export interface Payment {
  id: string;
  subscriptionId: string;
  userId: string;
  creatorId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  processedAt?: string;
  failureReason?: string;
}

export interface ExclusiveContent {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: ContentType;
  thumbnailUrl: string;
  contentUrl: string;
  duration?: number;
  requiredTier: SubscriptionTier;
  publishedAt: string;
  viewCount: number;
  isPublished: boolean;
}

export interface CreatorStats {
  creatorId: string;
  totalSubscribers: number;
  activeSubscribers: number;
  totalRevenue: number;
  monthlyRevenue: number;
  churnRate: number;
  subscribersByTier: {
    basic: number;
    premium: number;
    vip: number;
  };
  revenueByMonth: {
    month: string;
    revenue: number;
    subscribers: number;
  }[];
}

export interface Notification {
  id: string;
  userId: string;
  type: 'subscription_confirmed' | 'renewal_reminder' | 'payment_failed' | 'new_content' | 'price_change';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatar: string;
  coverImage: string;
  bio: string;
  category: string;
  subscriberCount: number;
  contentCount: number;
  isVerified: boolean;
  socialLinks: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
}
