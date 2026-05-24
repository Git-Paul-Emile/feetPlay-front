import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  UserSubscription,
  SubscriptionPlan,
  Payment,
  ExclusiveContent,
  Notification,
  Creator,
  CreatorStats,
  SubscriptionStatus,
  SubscriptionTier,
} from '../types/subscription';

interface SubscriptionContextType {
  userSubscriptions: UserSubscription[];
  creators: Creator[];
  subscriptionPlans: SubscriptionPlan[];
  exclusiveContents: ExclusiveContent[];
  payments: Payment[];
  notifications: Notification[];
  creatorStats: Map<string, CreatorStats>;

  subscribe: (creatorId: string, planId: string) => Promise<boolean>;
  cancelSubscription: (subscriptionId: string, reason: string) => Promise<boolean>;
  renewSubscription: (subscriptionId: string) => Promise<boolean>;
  getCreatorSubscription: (creatorId: string) => UserSubscription | undefined;
  hasAccessToContent: (contentId: string) => boolean;
  processPayment: (subscriptionId: string, paymentMethod: string) => Promise<boolean>;
  markNotificationAsRead: (notificationId: string) => void;
  getCreatorStats: (creatorId: string) => CreatorStats | undefined;
  publishContent: (creatorId: string, content: Omit<ExclusiveContent, 'id' | 'viewCount' | 'publishedAt'>) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const mockCreators: Creator[] = [
  {
    id: 'creator-1',
    name: 'Dadju',
    username: '@dadju',
    avatar: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1200&h=400&fit=crop',
    bio: 'Artiste international, concerts exclusifs et contenus en coulisses',
    category: 'Musique',
    subscriberCount: 15420,
    contentCount: 87,
    isVerified: true,
    socialLinks: {
      instagram: '@dadju',
      twitter: '@dadju',
    },
  },
  {
    id: 'creator-2',
    name: 'Fally Ipupa',
    username: '@fallyipupa',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1501612780327-45045538702b?w=1200&h=400&fit=crop',
    bio: 'Légende de la musique congolaise, accès VIP à mes concerts',
    category: 'Musique',
    subscriberCount: 28950,
    contentCount: 142,
    isVerified: true,
    socialLinks: {
      instagram: '@fallyipupa',
      youtube: 'FallyIpupaOfficial',
    },
  },
  {
    id: 'creator-3',
    name: 'Coach Fitness Pro',
    username: '@fitnesspro',
    avatar: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=400&fit=crop',
    bio: 'Programmes d\'entraînement exclusifs et coaching personnalisé',
    category: 'Sport',
    subscriberCount: 8340,
    contentCount: 56,
    isVerified: true,
    socialLinks: {
      youtube: 'FitnessProChannel',
    },
  },
];

const mockPlans: SubscriptionPlan[] = [
  {
    id: 'plan-1-basic',
    creatorId: 'creator-1',
    name: 'Fan Basique',
    description: 'Accès aux contenus basiques et replays de concerts',
    tier: 'basic',
    price: 5000,
    currency: 'FCFA',
    billingCycle: 'monthly',
    features: ['Replays de concerts', 'Posts exclusifs', 'Badge Fan'],
    isActive: true,
  },
  {
    id: 'plan-1-premium',
    creatorId: 'creator-1',
    name: 'Fan Premium',
    description: 'Tous les contenus + accès anticipé aux nouvelles sorties',
    tier: 'premium',
    price: 10000,
    currency: 'FCFA',
    billingCycle: 'monthly',
    features: ['Tout du Basic', 'Accès anticipé', 'Lives exclusifs', 'Messages directs'],
    isActive: true,
  },
  {
    id: 'plan-1-vip',
    creatorId: 'creator-1',
    name: 'VIP',
    description: 'Expérience VIP complète avec rencontres virtuelles',
    tier: 'vip',
    price: 25000,
    currency: 'FCFA',
    billingCycle: 'monthly',
    features: ['Tout du Premium', 'Rencontres virtuelles mensuelles', 'Contenus ultra exclusifs', 'Cadeaux personnalisés'],
    isActive: true,
  },
  {
    id: 'plan-2-basic',
    creatorId: 'creator-2',
    name: 'Supporter',
    description: 'Soutenez et accédez aux contenus exclusifs',
    tier: 'basic',
    price: 6000,
    currency: 'FCFA',
    billingCycle: 'monthly',
    features: ['Replays concerts', 'Podcasts', 'Photos exclusives'],
    isActive: true,
  },
  {
    id: 'plan-2-premium',
    creatorId: 'creator-2',
    name: 'VIP Fan',
    description: 'Expérience VIP avec avantages uniques',
    tier: 'premium',
    price: 15000,
    currency: 'FCFA',
    billingCycle: 'monthly',
    features: ['Tout du Supporter', 'Sessions Q&A', 'Réductions billets concerts', 'Contenus backstage'],
    isActive: true,
  },
  {
    id: 'plan-3-basic',
    creatorId: 'creator-3',
    name: 'Membre Actif',
    description: 'Programmes d\'entraînement complets',
    tier: 'basic',
    price: 8000,
    currency: 'FCFA',
    billingCycle: 'monthly',
    features: ['Programmes d\'entraînement', 'Plans nutritionnels', 'Vidéos tutoriels'],
    isActive: true,
  },
];

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([
    {
      id: 'sub-1',
      userId: 'user-current',
      creatorId: 'creator-1',
      planId: 'plan-1-premium',
      status: 'active',
      startDate: '2026-04-17T10:00:00Z',
      endDate: '2026-06-17T10:00:00Z',
      nextBillingDate: '2026-06-17T10:00:00Z',
      amount: 10000,
      currency: 'FCFA',
      autoRenew: true,
    },
  ]);

  const [creators] = useState<Creator[]>(mockCreators);
  const [subscriptionPlans] = useState<SubscriptionPlan[]>(mockPlans);
  const [exclusiveContents, setExclusiveContents] = useState<ExclusiveContent[]>([
    {
      id: 'content-1',
      creatorId: 'creator-1',
      title: 'Concert Privé - Brazzaville',
      description: 'Replay exclusif du concert privé à Brazzaville',
      type: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&h=400&fit=crop',
      contentUrl: 'https://example.com/video1',
      duration: 3600,
      requiredTier: 'basic',
      publishedAt: '2026-05-10T18:00:00Z',
      viewCount: 1240,
      isPublished: true,
    },
    {
      id: 'content-2',
      creatorId: 'creator-1',
      title: 'Session Studio - Nouvel Album',
      description: 'En coulisses de l\'enregistrement du nouvel album',
      type: 'video',
      thumbnailUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=600&h=400&fit=crop',
      contentUrl: 'https://example.com/video2',
      duration: 1800,
      requiredTier: 'premium',
      publishedAt: '2026-05-15T20:00:00Z',
      viewCount: 850,
      isPublished: true,
    },
  ]);

  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 'pay-1',
      subscriptionId: 'sub-1',
      userId: 'user-current',
      creatorId: 'creator-1',
      amount: 10000,
      currency: 'FCFA',
      status: 'completed',
      paymentMethod: 'mobile_money',
      transactionId: 'TXN-20260417-001',
      createdAt: '2026-04-17T10:00:00Z',
      processedAt: '2026-04-17T10:01:23Z',
    },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'notif-1',
      userId: 'user-current',
      type: 'subscription_confirmed',
      title: 'Abonnement confirmé',
      message: 'Votre abonnement à Dadju a été confirmé avec succès',
      read: false,
      createdAt: '2026-04-17T10:01:30Z',
      actionUrl: '/creator/creator-1',
    },
    {
      id: 'notif-2',
      userId: 'user-current',
      type: 'new_content',
      title: 'Nouveau contenu disponible',
      message: 'Dadju a publié une nouvelle vidéo exclusive',
      read: false,
      createdAt: '2026-05-15T20:05:00Z',
      actionUrl: '/content/content-2',
    },
  ]);

  const [creatorStats] = useState<Map<string, CreatorStats>>(new Map([
    ['creator-1', {
      creatorId: 'creator-1',
      totalSubscribers: 15420,
      activeSubscribers: 14890,
      totalRevenue: 128500000,
      monthlyRevenue: 12400000,
      churnRate: 3.4,
      subscribersByTier: {
        basic: 8900,
        premium: 5200,
        vip: 790,
      },
      revenueByMonth: [
        { month: '2026-01', revenue: 11200000, subscribers: 13850 },
        { month: '2026-02', revenue: 11800000, subscribers: 14120 },
        { month: '2026-03', revenue: 12100000, subscribers: 14560 },
        { month: '2026-04', revenue: 12400000, subscribers: 14890 },
        { month: '2026-05', revenue: 12400000, subscribers: 14890 },
      ],
    }],
    ['creator-2', {
      creatorId: 'creator-2',
      totalSubscribers: 28950,
      activeSubscribers: 27840,
      totalRevenue: 245600000,
      monthlyRevenue: 23800000,
      churnRate: 3.8,
      subscribersByTier: {
        basic: 18900,
        premium: 8940,
        vip: 0,
      },
      revenueByMonth: [
        { month: '2026-01', revenue: 22100000, subscribers: 26200 },
        { month: '2026-02', revenue: 22800000, subscribers: 26850 },
        { month: '2026-03', revenue: 23300000, subscribers: 27420 },
        { month: '2026-04', revenue: 23800000, subscribers: 27840 },
        { month: '2026-05', revenue: 23800000, subscribers: 27840 },
      ],
    }],
  ]));

  const subscribe = async (creatorId: string, planId: string): Promise<boolean> => {
    const plan = subscriptionPlans.find(p => p.id === planId);
    if (!plan) return false;

    const newSubscription: UserSubscription = {
      id: `sub-${Date.now()}`,
      userId: 'user-current',
      creatorId,
      planId,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: plan.price,
      currency: plan.currency,
      autoRenew: true,
    };

    setUserSubscriptions(prev => [...prev, newSubscription]);

    const notification: Notification = {
      id: `notif-${Date.now()}`,
      userId: 'user-current',
      type: 'subscription_confirmed',
      title: 'Abonnement confirmé',
      message: `Votre abonnement ${plan.name} a été confirmé avec succès`,
      read: false,
      createdAt: new Date().toISOString(),
      actionUrl: `/creator/${creatorId}`,
    };

    setNotifications(prev => [notification, ...prev]);

    return true;
  };

  const cancelSubscription = async (subscriptionId: string, reason: string): Promise<boolean> => {
    setUserSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId
          ? {
              ...sub,
              status: 'cancelled' as SubscriptionStatus,
              autoRenew: false,
              cancelledAt: new Date().toISOString(),
              cancelReason: reason,
            }
          : sub
      )
    );
    return true;
  };

  const renewSubscription = async (subscriptionId: string): Promise<boolean> => {
    setUserSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId
          ? {
              ...sub,
              status: 'active' as SubscriptionStatus,
              autoRenew: true,
              endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              nextBillingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            }
          : sub
      )
    );
    return true;
  };

  const getCreatorSubscription = (creatorId: string): UserSubscription | undefined => {
    return userSubscriptions.find(
      sub => sub.creatorId === creatorId && (sub.status === 'active' || sub.status === 'pending')
    );
  };

  const hasAccessToContent = (contentId: string): boolean => {
    const content = exclusiveContents.find(c => c.id === contentId);
    if (!content) return false;

    const subscription = getCreatorSubscription(content.creatorId);
    if (!subscription || subscription.status !== 'active') return false;

    const plan = subscriptionPlans.find(p => p.id === subscription.planId);
    if (!plan) return false;

    const tierHierarchy: Record<SubscriptionTier, number> = {
      basic: 1,
      premium: 2,
      vip: 3,
    };

    return tierHierarchy[plan.tier] >= tierHierarchy[content.requiredTier];
  };

  const processPayment = async (subscriptionId: string, paymentMethod: string): Promise<boolean> => {
    const subscription = userSubscriptions.find(s => s.id === subscriptionId);
    if (!subscription) return false;

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      subscriptionId,
      userId: subscription.userId,
      creatorId: subscription.creatorId,
      amount: subscription.amount,
      currency: subscription.currency,
      status: 'completed',
      paymentMethod,
      transactionId: `TXN-${Date.now()}`,
      createdAt: new Date().toISOString(),
      processedAt: new Date().toISOString(),
    };

    setPayments(prev => [newPayment, ...prev]);
    return true;
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const getCreatorStats = (creatorId: string): CreatorStats | undefined => {
    return creatorStats.get(creatorId);
  };

  const publishContent = (
    creatorId: string,
    content: Omit<ExclusiveContent, 'id' | 'viewCount' | 'publishedAt'>
  ) => {
    const newContent: ExclusiveContent = {
      ...content,
      id: `content-${Date.now()}`,
      viewCount: 0,
      publishedAt: new Date().toISOString(),
    };

    setExclusiveContents(prev => [newContent, ...prev]);

    const creator = creators.find(c => c.id === creatorId);
    if (creator) {
      const notification: Notification = {
        id: `notif-${Date.now()}`,
        userId: 'all-subscribers',
        type: 'new_content',
        title: 'Nouveau contenu disponible',
        message: `${creator.name} a publié : ${content.title}`,
        read: false,
        createdAt: new Date().toISOString(),
        actionUrl: `/content/${newContent.id}`,
      };

      setNotifications(prev => [notification, ...prev]);
    }
  };

  const value: SubscriptionContextType = {
    userSubscriptions,
    creators,
    subscriptionPlans,
    exclusiveContents,
    payments,
    notifications,
    creatorStats,
    subscribe,
    cancelSubscription,
    renewSubscription,
    getCreatorSubscription,
    hasAccessToContent,
    processPayment,
    markNotificationAsRead,
    getCreatorStats,
    publishContent,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider');
  }
  return context;
}
