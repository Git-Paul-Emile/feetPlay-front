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



export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [userSubscriptions, setUserSubscriptions] = useState<UserSubscription[]>([]);
  const [creators, setCreators] = useState<Creator[]>([]);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [exclusiveContents, setExclusiveContents] = useState<ExclusiveContent[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [creatorStats, setCreatorStats] = useState<Map<string, CreatorStats>>(new Map());

  useEffect(() => {
    // Charger les créateurs depuis l'API
    import('../services/api/CreatorAPI').then((module) => {
      module.default.getAll().then((data: any) => {
        setCreators(data);
      }).catch(console.error);
    });
  }, []);

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
