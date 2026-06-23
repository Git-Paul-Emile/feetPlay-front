import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, BellOff, Loader2, Crown, CreditCard, Smartphone, CheckCircle2, AlertTriangle } from "lucide-react";
import CreatorAPI, { type Creator } from "../../services/api/CreatorAPI";
import { useAuth } from "../../contexts/AuthContext";

interface SubscriptionModalProps {
  creator: Creator;
  isSubscribed: boolean;
  subscriptionPrice?: number | null;
  onClose: () => void;
  onToggle: (subscribed: boolean) => void;
}

type Step = "overview" | "payment" | "processing";
type PaymentMethod = "mobile-money" | "card" | null;

const DEFAULT_PRICE = 5000;

export function SubscriptionModal({
  creator,
  isSubscribed,
  subscriptionPrice,
  onClose,
  onToggle,
}: SubscriptionModalProps) {
  const { isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>("overview");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = subscriptionPrice ?? DEFAULT_PRICE;

  async function handleUnsubscribe() {
    if (!isAuthenticated) { setError("Vous devez être connecté."); return; }
    setLoading(true);
    setError(null);
    try {
      const result = await CreatorAPI.unsubscribe(creator.id);
      onToggle(result.subscribed);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  async function handleConfirmPayment() {
    if (!paymentMethod) return;
    if (!isAuthenticated) { setError("Vous devez être connecté."); return; }

    setStep("processing");
    setError(null);

    // Simulate payment processing (3s) then subscribe
    await new Promise((r) => setTimeout(r, 2500));

    setLoading(true);
    try {
      const result = await CreatorAPI.subscribe(creator.id, "paid");
      onToggle(result.subscribed);
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
      setStep("payment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative z-10 w-full max-w-sm rounded-2xl bg-[#111] border border-white/10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <AnimatePresence mode="wait">
            {/* ── STEP: OVERVIEW ── */}
            {!isSubscribed && step === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#CDFF71]/20 to-[#DE0035]/20 border border-[#CDFF71]/30 flex items-center justify-center mx-auto mb-3">
                    <Crown className="w-8 h-8 text-[#CDFF71]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Abonnement Premium</h3>
                  <p className="text-gray-400 text-sm">
                    Accès illimité à tous les contenus de{" "}
                    <span className="text-white font-medium">{creator.channelName}</span>
                  </p>
                </div>

                {/* Benefits */}
                <ul className="space-y-2.5 mb-6">
                  {[
                    "Accès à tous les événements payants sans ticket",
                    "Visionnage des replays exclusifs",
                    "Accès aux diffusions réservées aux abonnés",
                    "Annulable à tout moment",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle2 className="w-4 h-4 text-[#CDFF71] flex-shrink-0 mt-0.5" />
                      {benefit}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 mb-5 text-center">
                  <p className="text-gray-400 text-xs mb-1">Prix mensuel</p>
                  <p className="text-3xl font-bold text-[#CDFF71]">
                    {price.toLocaleString()} <span className="text-lg font-normal text-gray-400">FCFA</span>
                  </p>
                </div>

                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-3 py-2 text-sm text-white">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#DE0035]" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={() => setStep("payment")}
                    className="flex-1 rounded-xl bg-[#DE0035] hover:bg-[#DE0035]/80 px-4 py-3 text-sm font-semibold text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Crown className="w-4 h-4" />
                    S'abonner
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP: PAYMENT ── */}
            {step === "payment" && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6"
              >
                <h3 className="text-xl font-bold text-white mb-1">Paiement</h3>
                <p className="text-gray-400 text-sm mb-5">
                  Abonnement à <span className="text-white">{creator.channelName}</span> —{" "}
                  <span className="text-[#CDFF71] font-semibold">{price.toLocaleString()} FCFA/mois</span>
                </p>

                <p className="text-sm text-gray-400 mb-3">Mode de paiement</p>
                <div className="space-y-3 mb-6">
                  {[
                    { id: "mobile-money" as PaymentMethod, icon: Smartphone, label: "Mobile Money", sub: "MTN, Airtel, Orange Money" },
                    { id: "card" as PaymentMethod, icon: CreditCard, label: "Carte Bancaire", sub: "Visa, Mastercard" },
                  ].map(({ id, icon: Icon, label, sub }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id)}
                      className={`w-full flex items-center gap-4 rounded-xl border p-4 transition-all ${
                        paymentMethod === id
                          ? "border-[#CDFF71] bg-[#CDFF71]/5"
                          : "border-white/10 bg-white/5 hover:border-white/30"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${paymentMethod === id ? "bg-[#CDFF71]" : "bg-white/10"}`}>
                        <Icon className={`w-5 h-5 ${paymentMethod === id ? "text-black" : "text-white"}`} />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="text-sm font-medium text-white">{label}</p>
                        <p className="text-xs text-gray-400">{sub}</p>
                      </div>
                      {paymentMethod === id && <CheckCircle2 className="w-5 h-5 text-[#CDFF71]" />}
                    </button>
                  ))}
                </div>

                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-3 py-2 text-sm text-white">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#DE0035]" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep("overview")}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    onClick={handleConfirmPayment}
                    disabled={!paymentMethod}
                    className="flex-1 rounded-xl bg-[#DE0035] hover:bg-[#DE0035]/80 disabled:opacity-40 disabled:cursor-not-allowed px-4 py-3 text-sm font-semibold text-white transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── STEP: PROCESSING ── */}
            {step === "processing" && (
              <motion.div
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 flex flex-col items-center justify-center gap-5"
              >
                <div className="w-16 h-16 border-4 border-[#CDFF71]/30 border-t-[#CDFF71] rounded-full animate-spin" />
                <div className="text-center">
                  <p className="text-white font-semibold">Traitement du paiement…</p>
                  <p className="text-gray-400 text-sm mt-1">Veuillez patienter</p>
                </div>
              </motion.div>
            )}

            {/* ── ALREADY SUBSCRIBED ── */}
            {isSubscribed && step === "overview" && (
              <motion.div
                key="unsubscribe"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-[#DE0035]/10 border border-[#DE0035]/30 flex items-center justify-center mx-auto mb-3">
                    <BellOff className="w-8 h-8 text-[#DE0035]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1">Se désabonner</h3>
                  <p className="text-gray-400 text-sm">
                    Vous allez perdre l'accès aux contenus exclusifs de{" "}
                    <span className="text-white font-medium">{creator.channelName}</span>.
                  </p>
                </div>

                {error && (
                  <div className="mb-4 flex items-start gap-2 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-3 py-2 text-sm text-white">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#DE0035]" />
                    {error}
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleUnsubscribe}
                    disabled={loading}
                    className="flex-1 rounded-xl bg-white/10 hover:bg-white/20 text-white px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    Se désabonner
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
