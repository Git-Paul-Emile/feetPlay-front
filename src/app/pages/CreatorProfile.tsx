import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { PaymentModal } from '../components/PaymentModal';
import { ArrowLeft, Check, Lock, Play, Clock, Eye } from 'lucide-react';
import { motion } from 'motion/react';

export function CreatorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    creators,
    subscriptionPlans,
    exclusiveContents,
    getCreatorSubscription,
    subscribe,
    processPayment,
    hasAccessToContent,
  } = useSubscription();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>('');

  const creator = creators.find(c => c.id === id);
  const currentSubscription = creator ? getCreatorSubscription(creator.id) : undefined;
  const creatorPlans = subscriptionPlans.filter(p => p.creatorId === id);
  const creatorContents = exclusiveContents.filter(c => c.creatorId === id && c.isPublished);

  if (!creator) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Créateur introuvable</h2>
          <button
            onClick={() => navigate('/createurs')}
            className="text-[#16BDA0] hover:text-[#0d9488]"
          >
            Retour aux créateurs
          </button>
        </div>
      </div>
    );
  }

  const handleSubscribe = async (planId: string) => {
    setSelectedPlanId(planId);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentMethod: string) => {
    if (!currentSubscription) {
      await subscribe(creator.id, selectedPlanId);
    }
    await processPayment(currentSubscription?.id || 'new', paymentMethod);
    setShowPaymentModal(false);
  };

  const selectedPlan = subscriptionPlans.find(p => p.id === selectedPlanId);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* Cover Image */}
      <div className="relative h-[400px]">
        <img
          src={creator.coverImage}
          alt={creator.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/60 to-transparent" />

        <button
          onClick={() => navigate('/createurs')}
          className="absolute top-6 left-6 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Retour
        </button>
      </div>

      {/* Creator Info */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        <div className="flex flex-col md:flex-row gap-6 mb-12">
          <div className="relative">
            <img
              src={creator.avatar}
              alt={creator.name}
              className="w-32 h-32 rounded-full border-4 border-[#080808] object-cover"
            />
            {creator.isVerified && (
              <div className="absolute bottom-0 right-0 w-10 h-10 bg-[#16BDA0] rounded-full flex items-center justify-center border-4 border-[#080808]">
                <Check className="w-6 h-6 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-white text-4xl font-bold mb-2">{creator.name}</h1>
            <p className="text-white/60 text-lg mb-4">{creator.username}</p>
            <p className="text-white/80 text-base mb-6 max-w-2xl">{creator.bio}</p>

            <div className="flex flex-wrap gap-6 text-white/60">
              <div>
                <span className="text-white text-2xl font-bold">
                  {creator.subscriberCount.toLocaleString()}
                </span>
                <span className="ml-2">abonnés</span>
              </div>
              <div>
                <span className="text-white text-2xl font-bold">
                  {creator.contentCount}
                </span>
                <span className="ml-2">contenus</span>
              </div>
              <div>
                <span className="inline-block bg-[#16BDA0]/20 text-[#16BDA0] px-3 py-1 rounded-full text-sm font-semibold">
                  {creator.category}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Plans */}
        <section className="mb-16">
          <h2 className="text-white text-3xl font-bold mb-8">Plans d'abonnement</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorPlans.map((plan, index) => (
              <SubscriptionCard
                key={plan.id}
                plan={plan}
                isSubscribed={currentSubscription?.planId === plan.id && currentSubscription?.status === 'active'}
                onSubscribe={handleSubscribe}
                popular={index === 1}
              />
            ))}
          </div>
        </section>

        {/* Exclusive Content */}
        <section className="pb-16">
          <h2 className="text-white text-3xl font-bold mb-8">Contenu exclusif</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creatorContents.map((content) => {
              const hasAccess = hasAccessToContent(content.id);

              return (
                <motion.div
                  key={content.id}
                  whileHover={{ scale: 1.03 }}
                  className="relative group cursor-pointer"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img
                      src={content.thumbnailUrl}
                      alt={content.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                    {!hasAccess && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-12 h-12 text-white/80 mx-auto mb-3" />
                          <p className="text-white font-semibold">Abonnement requis</p>
                          <p className="text-white/60 text-sm">
                            {content.requiredTier === 'basic' ? 'Basic' : content.requiredTier === 'premium' ? 'Premium' : 'VIP'} ou supérieur
                          </p>
                        </div>
                      </div>
                    )}

                    {hasAccess && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex gap-2">
                      <div className="bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs font-semibold">
                        {content.type === 'video' ? 'Vidéo' : content.type === 'podcast' ? 'Podcast' : content.type === 'live_stream' ? 'Live' : 'Post'}
                      </div>
                    </div>

                    {content.duration && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-white text-xs">
                        <Clock className="w-3 h-3" />
                        {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>

                  <div className="mt-3">
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
                      {content.title}
                    </h3>
                    <p className="text-white/60 text-sm line-clamp-2 mb-2">
                      {content.description}
                    </p>
                    <div className="flex items-center gap-4 text-white/60 text-sm">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {content.viewCount.toLocaleString()} vues
                      </div>
                      <div>
                        {new Date(content.publishedAt).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {creatorContents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-white/60 text-lg">
                Aucun contenu exclusif pour le moment
              </p>
            </div>
          )}
        </section>
      </div>

      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          plan={selectedPlan}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
