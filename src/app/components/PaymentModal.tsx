import { useState } from 'react';
import { X, CreditCard, Smartphone, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SubscriptionPlan } from '../types/subscription';
import { legacyApiRaw } from '../services/backend/legacyApi';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onSuccess: (payment: { provider: 'stripe' | 'mobile_money'; paymentId: string }) => Promise<void>;
}

// Seules les méthodes réellement supportées par le moteur de simulation
// partagé (payment.service.ts côté feeti2) sont proposées ici — pas de
// virement bancaire, qui n'a jamais été implémenté nulle part dans l'écosystème.
type PaymentMethod = 'mobile_money' | 'card';
type PaymentStep = 'method' | 'details' | 'processing' | 'success' | 'error';

export function PaymentModal({ isOpen, onClose, plan, onSuccess }: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mobile_money');
  const [step, setStep] = useState<PaymentStep>('method');
  const [error, setError] = useState<string>('');

  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    phoneNumber: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const processPayment = async () => {
    setStep('processing');
    setError('');

    try {
      let paymentId: string;

      if (paymentMethod === 'mobile_money') {
        const response = await legacyApiRaw('/payments/mobile-money/initialize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: formData.phoneNumber,
            provider: 'mtn',
            amount: plan.price,
            currency: plan.currency,
          }),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body?.message ?? 'Échec de l\'initialisation du paiement');
        paymentId = body?.data?.transaction_id;
      } else {
        const response = await legacyApiRaw('/payments/stripe/create-intent', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: plan.price, currency: plan.currency }),
        });
        const body = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(body?.message ?? 'Échec de l\'initialisation du paiement');
        paymentId = body?.data?.intent_id;
      }

      await onSuccess({ provider: paymentMethod === 'mobile_money' ? 'mobile_money' : 'stripe', paymentId });
      setStep('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      setStep('error');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('details');
  };

  const handleConfirmPayment = () => {
    processPayment();
  };

  const resetAndClose = () => {
    setStep('method');
    setError('');
    setFormData({
      cardNumber: '',
      cardName: '',
      expiryDate: '',
      cvv: '',
      phoneNumber: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#16202e] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/10"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-br from-[#1a1a2e] to-[#16202e] border-b border-white/10 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-white text-2xl font-bold">Paiement sécurisé</h2>
              <p className="text-white/60 text-sm mt-1">
                {plan.name} - {plan.price.toLocaleString()} {plan.currency}/mois
              </p>
            </div>
            <button
              onClick={resetAndClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>

          <div className="p-6">
            {/* Step: Select Payment Method */}
            {step === 'method' && (
              <form onSubmit={handleSubmit}>
                <h3 className="text-white text-lg font-semibold mb-4">
                  Choisissez votre méthode de paiement
                </h3>
                <div className="space-y-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('mobile_money')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === 'mobile_money'
                        ? 'border-[#16BDA0] bg-[#16BDA0]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 text-[#16BDA0]" />
                    <div className="flex-1 text-left">
                      <div className="text-white font-semibold">Mobile Money</div>
                      <div className="text-white/60 text-sm">M-Pesa, Orange Money, Airtel Money</div>
                    </div>
                    {paymentMethod === 'mobile_money' && (
                      <Check className="w-6 h-6 text-[#16BDA0]" />
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                      paymentMethod === 'card'
                        ? 'border-[#16BDA0] bg-[#16BDA0]/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-[#16BDA0]" />
                    <div className="flex-1 text-left">
                      <div className="text-white font-semibold">Carte bancaire</div>
                      <div className="text-white/60 text-sm">Visa, Mastercard</div>
                    </div>
                    {paymentMethod === 'card' && (
                      <Check className="w-6 h-6 text-[#16BDA0]" />
                    )}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white py-3.5 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all"
                >
                  Continuer
                </button>
              </form>
            )}

            {/* Step: Payment Details */}
            {step === 'details' && (
              <div>
                <button
                  onClick={() => setStep('method')}
                  className="text-[#16BDA0] hover:text-[#0d9488] mb-4 text-sm"
                >
                  ← Changer de méthode
                </button>

                {paymentMethod === 'mobile_money' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium block mb-2">
                        Numéro de téléphone
                      </label>
                      <input
                        type="tel"
                        placeholder="+243 XXX XXX XXX"
                        value={formData.phoneNumber}
                        onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                      />
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                      <p className="text-blue-400 text-sm">
                        Vous recevrez une notification sur votre téléphone pour confirmer le paiement
                      </p>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-white text-sm font-medium block mb-2">
                        Numéro de carte
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        maxLength={19}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                      />
                    </div>
                    <div>
                      <label className="text-white text-sm font-medium block mb-2">
                        Nom sur la carte
                      </label>
                      <input
                        type="text"
                        placeholder="JOHN DOE"
                        value={formData.cardName}
                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white text-sm font-medium block mb-2">
                          Date d'expiration
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          value={formData.expiryDate}
                          onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                          maxLength={5}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                        />
                      </div>
                      <div>
                        <label className="text-white text-sm font-medium block mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          value={formData.cvv}
                          onChange={(e) => handleInputChange('cvv', e.target.value)}
                          maxLength={3}
                          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-[#16BDA0]"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleConfirmPayment}
                  className="w-full bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white py-3.5 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all mt-6"
                >
                  Confirmer le paiement
                </button>
              </div>
            )}

            {/* Step: Processing */}
            {step === 'processing' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 border-4 border-[#16BDA0]/30 border-t-[#16BDA0] rounded-full animate-spin mx-auto mb-6" />
                <h3 className="text-white text-xl font-semibold mb-2">
                  Traitement en cours...
                </h3>
                <p className="text-white/60">
                  Veuillez patienter pendant que nous traitons votre paiement
                </p>
              </div>
            )}

            {/* Step: Success */}
            {step === 'success' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">
                  Paiement réussi !
                </h3>
                <p className="text-white/60 mb-6">
                  Votre abonnement {plan.name} est maintenant actif
                </p>
                <button
                  onClick={resetAndClose}
                  className="bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all"
                >
                  Terminer
                </button>
              </div>
            )}

            {/* Step: Error */}
            {step === 'error' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="w-10 h-10 text-red-400" />
                </div>
                <h3 className="text-white text-2xl font-bold mb-2">
                  Paiement échoué
                </h3>
                <p className="text-white/60 mb-6">{error}</p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setStep('details')}
                    className="bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white px-8 py-3 rounded-lg font-semibold hover:from-[#c5002f] hover:to-[#e6153d] transition-all"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={resetAndClose}
                    className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
