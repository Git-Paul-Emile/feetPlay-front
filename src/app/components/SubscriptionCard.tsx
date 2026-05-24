import { Check, Star, Crown, Zap } from 'lucide-react';
import { SubscriptionPlan, SubscriptionTier } from '../types/subscription';
import { useState } from 'react';

interface SubscriptionCardProps {
  plan: SubscriptionPlan;
  isSubscribed?: boolean;
  onSubscribe: (planId: string) => void;
  popular?: boolean;
}

export function SubscriptionCard({ plan, isSubscribed, onSubscribe, popular }: SubscriptionCardProps) {
  const [loading, setLoading] = useState(false);

  const tierConfig: Record<SubscriptionTier, { icon: JSX.Element; color: string; bgGradient: string }> = {
    basic: {
      icon: <Star className="w-6 h-6" />,
      color: 'text-blue-400',
      bgGradient: 'from-blue-500/20 to-blue-600/20',
    },
    premium: {
      icon: <Zap className="w-6 h-6" />,
      color: 'text-purple-400',
      bgGradient: 'from-purple-500/20 to-purple-600/20',
    },
    vip: {
      icon: <Crown className="w-6 h-6" />,
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-500/20 to-yellow-600/20',
    },
  };

  const config = tierConfig[plan.tier];

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      await onSubscribe(plan.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative bg-gradient-to-br ${config.bgGradient} backdrop-blur-sm border-2 ${
        popular ? 'border-[#16BDA0]' : 'border-white/10'
      } rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:scale-105 hover:border-[#16BDA0]/50`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#16BDA0] to-[#0d9488] px-6 py-1.5 rounded-full">
          <span className="text-white text-sm font-bold">Plus populaire</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className={`p-3 bg-white/10 rounded-xl ${config.color}`}>
          {config.icon}
        </div>
        {isSubscribed && (
          <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
            <Check className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-semibold">Actif</span>
          </div>
        )}
      </div>

      <h3 className="text-white text-2xl font-bold mb-2">{plan.name}</h3>
      <p className="text-white/70 text-sm mb-6">{plan.description}</p>

      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span className="text-white text-4xl font-bold">
            {plan.price.toLocaleString()}
          </span>
          <span className="text-white/60 text-lg">{plan.currency}</span>
        </div>
        <span className="text-white/60 text-sm">
          par {plan.billingCycle === 'monthly' ? 'mois' : 'an'}
        </span>
      </div>

      <div className="space-y-3 mb-8">
        {plan.features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="mt-0.5">
              <Check className="w-5 h-5 text-[#16BDA0]" />
            </div>
            <span className="text-white/90 text-sm">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isSubscribed || loading || !plan.isActive}
        className={`w-full py-3.5 rounded-lg font-semibold text-lg transition-all ${
          isSubscribed
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white hover:from-[#c5002f] hover:to-[#e6153d]'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Traitement...
          </span>
        ) : isSubscribed ? (
          'Déjà abonné'
        ) : (
          'S\'abonner'
        )}
      </button>
    </div>
  );
}
