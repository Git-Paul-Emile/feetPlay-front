import { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigate } from 'react-router';
import { Calendar, CreditCard, AlertCircle, Check, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ManageSubscriptions() {
  const navigate = useNavigate();
  const {
    userSubscriptions,
    creators,
    subscriptionPlans,
    payments,
    cancelSubscription,
    renewSubscription,
  } = useSubscription();

  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!cancelReason) {
      alert('Veuillez indiquer une raison');
      return;
    }

    const success = await cancelSubscription(subscriptionId, cancelReason);
    if (success) {
      setCancelingId(null);
      setCancelReason('');
    }
  };

  const handleRenewSubscription = async (subscriptionId: string) => {
    await renewSubscription(subscriptionId);
  };

  return (
    <div className="min-h-screen bg-[#080808] py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-white text-4xl font-bold mb-4">Mes abonnements</h1>
          <p className="text-white/60 text-lg">
            Gérez vos abonnements et consultez votre historique de paiements
          </p>
        </div>

        {/* Active Subscriptions */}
        <section className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-6">Abonnements actifs</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {userSubscriptions
              .filter(sub => sub.status === 'active')
              .map(subscription => {
                const creator = creators.find(c => c.id === subscription.creatorId);
                const plan = subscriptionPlans.find(p => p.id === subscription.planId);

                if (!creator || !plan) return null;

                return (
                  <motion.div
                    key={subscription.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <img
                        src={creator.avatar}
                        alt={creator.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <h3 className="text-white text-xl font-bold mb-1">{creator.name}</h3>
                        <p className="text-white/60">{plan.name}</p>
                      </div>
                      <div className="flex items-center gap-1.5 bg-green-500/20 px-3 py-1.5 rounded-full border border-green-500/30">
                        <Check className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm font-semibold">Actif</span>
                      </div>
                    </div>

                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/60">
                          <CreditCard className="w-5 h-5" />
                          <span>Montant</span>
                        </div>
                        <span className="text-white font-semibold">
                          {subscription.amount.toLocaleString()} {subscription.currency}/mois
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/60">
                          <Calendar className="w-5 h-5" />
                          <span>Prochain paiement</span>
                        </div>
                        <span className="text-white font-semibold">
                          {new Date(subscription.nextBillingDate).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-white/60">
                          <RefreshCw className="w-5 h-5" />
                          <span>Renouvellement auto</span>
                        </div>
                        <span className={`font-semibold ${subscription.autoRenew ? 'text-green-400' : 'text-red-400'}`}>
                          {subscription.autoRenew ? 'Activé' : 'Désactivé'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/creator/${creator.id}`)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg font-semibold transition-colors"
                      >
                        Voir le profil
                      </button>
                      <button
                        onClick={() => setCancelingId(subscription.id)}
                        className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2.5 rounded-lg font-semibold transition-colors border border-red-500/30"
                      >
                        Résilier
                      </button>
                    </div>
                  </motion.div>
                );
              })}
          </div>

          {userSubscriptions.filter(sub => sub.status === 'active').length === 0 && (
            <div className="text-center py-12 bg-white/5 rounded-2xl">
              <p className="text-white/60 text-lg mb-4">Aucun abonnement actif</p>
              <button
                onClick={() => navigate('/createurs')}
                className="bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white px-6 py-3 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all"
              >
                Découvrir les créateurs
              </button>
            </div>
          )}
        </section>

        {/* Cancelled/Expired Subscriptions */}
        {userSubscriptions.filter(sub => sub.status === 'cancelled' || sub.status === 'expired').length > 0 && (
          <section className="mb-12">
            <h2 className="text-white text-2xl font-bold mb-6">Abonnements résiliés</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {userSubscriptions
                .filter(sub => sub.status === 'cancelled' || sub.status === 'expired')
                .map(subscription => {
                  const creator = creators.find(c => c.id === subscription.creatorId);
                  const plan = subscriptionPlans.find(p => p.id === subscription.planId);

                  if (!creator || !plan) return null;

                  return (
                    <motion.div
                      key={subscription.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-[#1a1a2e]/40 to-[#16202e]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 opacity-60"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <img
                          src={creator.avatar}
                          alt={creator.name}
                          className="w-16 h-16 rounded-full object-cover grayscale"
                        />
                        <div className="flex-1">
                          <h3 className="text-white text-xl font-bold mb-1">{creator.name}</h3>
                          <p className="text-white/60">{plan.name}</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-red-500/20 px-3 py-1.5 rounded-full border border-red-500/30">
                          <X className="w-4 h-4 text-red-400" />
                          <span className="text-red-400 text-sm font-semibold">
                            {subscription.status === 'cancelled' ? 'Résilié' : 'Expiré'}
                          </span>
                        </div>
                      </div>

                      {subscription.cancelReason && (
                        <div className="mb-4">
                          <p className="text-white/40 text-sm">
                            Raison: {subscription.cancelReason}
                          </p>
                        </div>
                      )}

                      <button
                        onClick={() => handleRenewSubscription(subscription.id)}
                        className="w-full bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white py-2.5 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all"
                      >
                        Réactiver l'abonnement
                      </button>
                    </motion.div>
                  );
                })}
            </div>
          </section>
        )}

        {/* Payment History */}
        <section>
          <h2 className="text-white text-2xl font-bold mb-6">Historique des paiements</h2>
          <div className="bg-gradient-to-br from-[#1a1a2e]/80 to-[#16202e]/80 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Créateur</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Montant</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Méthode</th>
                    <th className="px-6 py-4 text-left text-white/80 font-semibold">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.map(payment => {
                    const creator = creators.find(c => c.id === payment.creatorId);

                    return (
                      <tr key={payment.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 text-white">
                          {new Date(payment.createdAt).toLocaleDateString('fr-FR')}
                        </td>
                        <td className="px-6 py-4 text-white">{creator?.name}</td>
                        <td className="px-6 py-4 text-white font-semibold">
                          {payment.amount.toLocaleString()} {payment.currency}
                        </td>
                        <td className="px-6 py-4 text-white/60 capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${
                              payment.status === 'completed'
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                : payment.status === 'failed'
                                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                            }`}
                          >
                            {payment.status === 'completed' && <Check className="w-3 h-3" />}
                            {payment.status === 'failed' && <X className="w-3 h-3" />}
                            {payment.status === 'completed' ? 'Réussi' : payment.status === 'failed' ? 'Échoué' : 'En attente'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {payments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-white/60">Aucun paiement enregistré</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Cancel Modal */}
      <AnimatePresence>
        {cancelingId && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-gradient-to-br from-[#1a1a2e] to-[#16202e] rounded-2xl max-w-md w-full p-6 border border-white/10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white text-xl font-bold">Résilier l'abonnement</h3>
              </div>

              <p className="text-white/70 mb-6">
                Êtes-vous sûr de vouloir résilier cet abonnement ? Vous n'aurez plus accès au contenu exclusif.
              </p>

              <div className="mb-6">
                <label className="text-white text-sm font-medium block mb-2">
                  Raison de la résiliation
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Pourquoi résiliez-vous cet abonnement ?"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0] min-h-[100px] resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setCancelingId(null);
                    setCancelReason('');
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleCancelSubscription(cancelingId)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-semibold transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
