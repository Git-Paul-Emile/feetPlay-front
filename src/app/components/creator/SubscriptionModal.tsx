import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Bell, BellOff, Loader2 } from "lucide-react";
import CreatorAPI, { type Creator } from "../../services/api/CreatorAPI";
import { useAuth } from "../../contexts/AuthContext";

interface SubscriptionModalProps {
  creator: Creator;
  isSubscribed: boolean;
  onClose: () => void;
  onToggle: (subscribed: boolean) => void;
}

export function SubscriptionModal({ creator, isSubscribed, onClose, onToggle }: SubscriptionModalProps) {
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleToggle() {
    if (!isAuthenticated) {
      setError("Vous devez être connecté pour vous abonner.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = isSubscribed
        ? await CreatorAPI.unsubscribe(creator.id)
        : await CreatorAPI.subscribe(creator.id);
      onToggle(result.subscribed);
      onClose();
    } catch (err: any) {
      setError(err.message ?? "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
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
          className="relative z-10 w-full max-w-sm rounded-2xl bg-[#111] border border-white/10 p-6"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-[#DE0035]/10 border border-[#DE0035]/30 flex items-center justify-center mx-auto mb-3">
              {isSubscribed
                ? <BellOff className="w-8 h-8 text-[#DE0035]" />
                : <Bell className="w-8 h-8 text-[#CDFF71]" />
              }
            </div>
            <h3 className="text-xl font-bold text-white mb-1">
              {isSubscribed ? "Se désabonner" : "S'abonner"}
            </h3>
            <p className="text-gray-400 text-sm">
              {isSubscribed
                ? `Vous allez vous désabonner de ${creator.channelName}.`
                : `Abonnez-vous à ${creator.channelName} pour suivre ses créations.`
              }
            </p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-3 py-2 text-sm text-white">
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
              onClick={handleToggle}
              disabled={loading}
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                isSubscribed
                  ? "bg-white/10 hover:bg-white/20 text-white"
                  : "bg-[#DE0035] hover:bg-[#DE0035]/80 text-white"
              }`}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubscribed ? "Se désabonner" : "S'abonner gratuitement"}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
