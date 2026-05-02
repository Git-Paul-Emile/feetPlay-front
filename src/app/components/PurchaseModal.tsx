import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CreditCard, Smartphone, CheckCircle2 } from 'lucide-react';
import { backendGateway } from '../services/backend/gateway';

// Import SVG paths for the button
import svgPaths from '../../imports/svg-pirafvy7od';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8001';

// ─── API base URL (feetiPlay backend) ────────────────────────────────
export interface PurchaseData {
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventLocation: string;
  eventDate: string;
  eventTime: string;
  eventReference: string;
  eventPrice?: number;
  userName: string;
  userEmail: string;
  userPhone: string;
  userCity: string;
}

interface PurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchaseComplete: (data: PurchaseData) => void;
  event: {
    id: string;
    title: string;
    image: string;
    location: string;
    date: string;
    time?: string;
    reference: string;
    price?: number;
  };
}

type PaymentMethod = 'mobile-money' | 'card' | null;
type PurchaseStep = 'info' | 'payment' | 'processing';

export function PurchaseModal({ isOpen, onClose, onPurchaseComplete, event }: PurchaseModalProps) {
  const [step, setStep] = useState<PurchaseStep>('info');
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    userCity: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStep('payment');
  };

  const [mobileOperator, setMobileOperator] = useState<'mtn' | 'orange' | 'airtel'>('mtn');
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const handlePaymentSubmit = async () => {
    const isFreeEvent = !event.price || event.price === 0;

    if (!isFreeEvent && !paymentMethod) return;

    setLoading(true);
    setStep('processing');
    setPaymentError(null);

    try {
      await backendGateway.checkout.purchaseAccess({
        eventSource: 'feetiplay',
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time || '15:05',
        price: event.price,
        currency: 'FCFA',
        holderName: formData.userName,
        holderEmail: formData.userEmail,
        holderPhone: formData.userPhone,
        paymentMethod,
        mobileOperator,
      });

      const gatewayPurchaseData: PurchaseData = {
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image,
        eventLocation: event.location,
        eventDate: event.date,
        eventTime: event.time || '15:05',
        eventReference: event.reference,
        eventPrice: event.price,
        ...formData,
      };

      onPurchaseComplete(gatewayPurchaseData);
      return;
      // Déterminer le provider et obtenir un paymentId
      let paymentProvider: 'stripe' | 'mobile_money' | 'paystack' = 'stripe';
      let paymentId = `fp_sim_${Date.now()}`;

      if (paymentMethod === 'mobile-money') {
        paymentProvider = 'mobile_money';
        try {
          const mmRes = await fetch(`${API_BASE}/api/payments/mobile-money/initialize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              phone: formData.userPhone,
              provider: mobileOperator,
              amount: event.price || 0,
              currency: 'FCFA',
            }),
          });
          const mmData = await mmRes.json();
          paymentId = mmData?.data?.transaction_id || paymentId;
        } catch { /* simulation : continue */ }
      } else if (paymentMethod === 'card') {
        paymentProvider = 'stripe';
        try {
          const strRes = await fetch(`${API_BASE}/api/payments/stripe/create-intent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: event.price || 0, currency: 'FCFA' }),
          });
          const strData = await strRes.json();
          paymentId = strData?.data?.intent_id || paymentId;
        } catch { /* simulation : continue */ }
      }

      // Confirmer le paiement + créer l'accès streaming + envoyer email
      const confirmRes = await fetch(`${API_BASE}/api/payments/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventSource: 'feetiplay',
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time || '15:05',
          price: event.price,
          currency: 'FCFA',
          holderName: formData.userName,
          holderEmail: formData.userEmail,
          holderPhone: formData.userPhone,
          paymentProvider,
          paymentId,
        }),
      });

      if (!confirmRes.ok) {
        const errData = await confirmRes.json().catch(() => ({}));
        throw new Error((errData as any)?.message || 'Erreur lors du paiement');
      }

      const purchaseData: PurchaseData = {
        eventId: event.id,
        eventTitle: event.title,
        eventImage: event.image,
        eventLocation: event.location,
        eventDate: event.date,
        eventTime: event.time || '15:05',
        eventReference: event.reference,
        eventPrice: event.price,
        ...formData,
      };

      onPurchaseComplete(purchaseData);
    } catch (err: any) {
      setPaymentError(err?.message || 'Une erreur est survenue. Veuillez réessayer.');
      setStep('payment');
    } finally {
      setLoading(false);
      if (step !== 'payment') {
        // Reset pour la prochaine utilisation
        setStep('info');
        setPaymentMethod(null);
        setFormData({ userName: '', userEmail: '', userPhone: '', userCity: '' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBack = () => {
    if (step === 'payment') {
      setStep('info');
    }
  };

  const handleCloseModal = () => {
    setStep('info');
    setPaymentMethod(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
          onClick={handleCloseModal}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative bg-[rgba(255,255,255,0.1)] backdrop-blur-[50px] rounded-[12px] w-full max-w-[600px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 backdrop-blur-[5px] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Step Indicator */}
            <div className="p-6 pb-4">
              <div className="flex items-center justify-center gap-2">
                <div className={`h-2 w-2 rounded-full transition-all ${step === 'info' ? 'bg-[#cdff71] w-8' : 'bg-white/40'}`} />
                <div className={`h-2 w-2 rounded-full transition-all ${step === 'payment' ? 'bg-[#cdff71] w-8' : step === 'processing' ? 'bg-[#fcc434] w-8' : 'bg-white/40'}`} />
              </div>
            </div>

            {/* Content Based on Step */}
            <AnimatePresence mode="wait">
              {step === 'info' && (
                <motion.div
                  key="info"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 md:p-8 pt-2"
                >
                  {/* Event Summary */}
                  <div className="mb-8">
                    <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#fcc434] text-2xl md:text-3xl mb-4">
                      {event.title}
                    </h2>

                    {/* Event Info Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="font-['Inter',sans-serif] font-medium text-white/60 text-sm mb-1">Date</p>
                        <p className="font-['Inter',sans-serif] font-medium text-white/85 text-lg">{event.date}</p>
                      </div>
                      <div>
                        <p className="font-['Inter',sans-serif] font-medium text-white/60 text-sm mb-1">Heure</p>
                        <p className="font-['Inter',sans-serif] font-medium text-white/85 text-lg">{event.time || '15:05'}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="font-['Inter',sans-serif] font-medium text-white/60 text-sm mb-1">Référence</p>
                        <p className="font-['Inter',sans-serif] font-medium text-white/85 text-lg">{event.reference}</p>
                      </div>
                    </div>

                    <div className="h-px bg-white/20 mb-6" />

                    {/* User Information Section */}
                    <h3 className="font-['Inter',sans-serif] font-normal text-[#cdff71] text-base mb-4">
                      Vos informations utilisateur
                    </h3>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleInfoSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <div className="bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] p-4">
                        <label className="font-['Open_Sans',sans-serif] text-[#95989d] text-sm block mb-2">
                          Nom & Prénom :
                        </label>
                        <input
                          type="text"
                          name="userName"
                          value={formData.userName}
                          onChange={handleChange}
                          required
                          placeholder="Entrez votre nom complet"
                          className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <div className="bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] p-4">
                        <label className="font-['Open_Sans',sans-serif] text-[#95989d] text-sm block mb-2">
                          Votre adresse Email :
                        </label>
                        <input
                          type="email"
                          name="userEmail"
                          value={formData.userEmail}
                          onChange={handleChange}
                          required
                          placeholder="exemple@gmail.com"
                          className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    {/* Phone Field */}
                    <div>
                      <div className="bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] p-4">
                        <label className="font-['Open_Sans',sans-serif] text-[#95989d] text-sm block mb-2">
                          Votre numéro de téléphone :
                        </label>
                        <input
                          type="tel"
                          name="userPhone"
                          value={formData.userPhone}
                          onChange={handleChange}
                          required
                          placeholder="+242 06 654 00 00 00"
                          className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    {/* City Field */}
                    <div>
                      <div className="bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] p-4">
                        <label className="font-['Open_Sans',sans-serif] text-[#95989d] text-sm block mb-2">
                          Ville :
                        </label>
                        <input
                          type="text"
                          name="userCity"
                          value={formData.userCity}
                          onChange={handleChange}
                          required
                          placeholder="Brazzaville - Congo"
                          className="w-full bg-transparent text-white text-sm outline-none placeholder:text-white/30"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      className="relative w-full h-[66px] shadow-[0px_4px_4px_0px_rgba(22,190,161,0.25)] overflow-hidden group"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="absolute inset-0 bg-[rgba(146,128,253,0.8)] rounded-[14px]" />
                      
                      <motion.div 
                        className="absolute top-0 left-0 bottom-0 bg-[#cdff71] rounded-[14px]"
                        initial={{ width: '19.48%' }}
                        animate={{
                          width: ['19.48%', '100%', '19.48%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      <div className="relative flex items-center justify-between px-4 h-full">
                        <div className="relative w-[39px] h-[39px] flex-shrink-0">
                          <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 39">
                            <path d={svgPaths.p1e810100} fill="#C0E67B" />
                          </svg>
                          <div className="absolute inset-[32.35%]">
                            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7647 13.7647">
                              <path d={svgPaths.p3bc3d780} fill="white" opacity="0" />
                              <path d={svgPaths.p18cd5e00} fill="white" />
                            </svg>
                          </div>
                        </div>

                        <p className="font-['Mulish',sans-serif] font-bold text-white text-[15px] flex-1 text-center">
                          Continuer vers le paiement
                        </p>

                        <div className="w-[24px] h-[25px] flex-shrink-0">
                          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.3856 14.4998">
                            <path d={svgPaths.p362601c0} fill="white" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="p-6 md:p-8 pt-2"
                >
                  {/* Header */}
                  <div className="mb-8">
                    <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#fcc434] text-2xl md:text-3xl mb-2">
                      Récapitulatif & Paiement
                    </h2>
                    <p className="font-['Inter',sans-serif] text-white/60 text-sm">
                      Vérifiez vos informations et choisissez votre mode de paiement
                    </p>
                  </div>

                  {/* Order Summary */}
                  <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6 mb-6">
                    <h3 className="font-['Inter',sans-serif] font-semibold text-[#cdff71] text-lg mb-4">
                      Détails de la commande
                    </h3>
                    
                    {/* Event Info */}
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-['Inter',sans-serif] text-white/60 text-sm">Événement</p>
                          <p className="font-['Inter',sans-serif] font-medium text-white text-base">{event.title}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="font-['Inter',sans-serif] text-white/60 text-xs">Date</p>
                          <p className="font-['Inter',sans-serif] text-white text-sm">{event.date}</p>
                        </div>
                        <div>
                          <p className="font-['Inter',sans-serif] text-white/60 text-xs">Heure</p>
                          <p className="font-['Inter',sans-serif] text-white text-sm">{event.time || '15:05'}</p>
                        </div>
                      </div>

                      <div>
                        <p className="font-['Inter',sans-serif] text-white/60 text-xs">Lieu</p>
                        <p className="font-['Inter',sans-serif] text-white text-sm">{event.location}</p>
                      </div>
                    </div>

                    <div className="h-px bg-white/10 mb-4" />

                    {/* User Info */}
                    <div className="space-y-2 mb-6">
                      <p className="font-['Inter',sans-serif] text-white/60 text-xs">Bénéficiaire</p>
                      <p className="font-['Inter',sans-serif] text-white text-sm">{formData.userName}</p>
                      <p className="font-['Inter',sans-serif] text-white/80 text-xs">{formData.userEmail}</p>
                      <p className="font-['Inter',sans-serif] text-white/80 text-xs">{formData.userPhone}</p>
                    </div>

                    <div className="h-px bg-white/10 mb-4" />

                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <p className="font-['Inter',sans-serif] font-medium text-white text-base">Total à payer</p>
                      <div className="flex items-center gap-2">
                        {event.price ? (
                          <p className="font-['DM_Sans',sans-serif] font-bold text-[#cdff71] text-2xl">
                            {event.price.toLocaleString()} FCFA
                          </p>
                        ) : (
                          <p className="font-['DM_Sans',sans-serif] font-bold text-[#cdff71] text-xl">
                            GRATUIT
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Erreur paiement */}
                  {paymentError && (
                    <div className="mb-4 bg-red-500/20 border border-red-500/40 rounded-[8px] p-4">
                      <p className="font-['Inter',sans-serif] text-red-300 text-sm">{paymentError}</p>
                    </div>
                  )}

                  {/* Payment Methods */}
                  {event.price && event.price > 0 && (
                    <div className="mb-8">
                      <h3 className="font-['Inter',sans-serif] font-normal text-[#cdff71] text-base mb-4">
                        Choisissez votre moyen de paiement
                      </h3>

                      <div className="space-y-3">
                        {/* Mobile Money */}
                        <motion.button
                          type="button"
                          onClick={() => setPaymentMethod('mobile-money')}
                          className={`w-full bg-[rgba(255,255,255,0.1)] border rounded-[8px] p-4 flex items-center gap-4 transition-all ${
                            paymentMethod === 'mobile-money' 
                              ? 'border-[#cdff71] bg-[rgba(205,255,113,0.1)]' 
                              : 'border-[#62656a] hover:border-white/40'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === 'mobile-money' ? 'bg-[#cdff71]' : 'bg-white/10'
                          }`}>
                            <Smartphone className={`w-6 h-6 ${
                              paymentMethod === 'mobile-money' ? 'text-black' : 'text-white'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-['Inter',sans-serif] font-medium text-white text-base">Mobile Money</p>
                            <p className="font-['Inter',sans-serif] text-white/60 text-xs">MTN, Airtel, Orange Money</p>
                          </div>
                          {paymentMethod === 'mobile-money' && (
                            <CheckCircle2 className="w-6 h-6 text-[#cdff71]" />
                          )}
                        </motion.button>

                        {/* Opérateur Mobile Money */}
                        {paymentMethod === 'mobile-money' && (
                          <div className="flex gap-2 px-1">
                            {(['mtn', 'orange', 'airtel'] as const).map(op => (
                              <button
                                key={op}
                                type="button"
                                onClick={() => setMobileOperator(op)}
                                className={`flex-1 py-2 px-3 rounded-[6px] border text-sm font-medium transition-all ${
                                  mobileOperator === op
                                    ? 'border-[#cdff71] bg-[rgba(205,255,113,0.15)] text-[#cdff71]'
                                    : 'border-[#62656a] text-white/60 hover:border-white/40'
                                }`}
                              >
                                {op === 'mtn' ? 'MTN' : op === 'orange' ? 'Orange' : 'Airtel'}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Credit Card */}
                        <motion.button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className={`w-full bg-[rgba(255,255,255,0.1)] border rounded-[8px] p-4 flex items-center gap-4 transition-all ${
                            paymentMethod === 'card' 
                              ? 'border-[#cdff71] bg-[rgba(205,255,113,0.1)]' 
                              : 'border-[#62656a] hover:border-white/40'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            paymentMethod === 'card' ? 'bg-[#cdff71]' : 'bg-white/10'
                          }`}>
                            <CreditCard className={`w-6 h-6 ${
                              paymentMethod === 'card' ? 'text-black' : 'text-white'
                            }`} />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-['Inter',sans-serif] font-medium text-white text-base">Carte Bancaire</p>
                            <p className="font-['Inter',sans-serif] text-white/60 text-xs">Visa, Mastercard</p>
                          </div>
                          {paymentMethod === 'card' && (
                            <CheckCircle2 className="w-6 h-6 text-[#cdff71]" />
                          )}
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    {/* Pay Button */}
                    <motion.button
                      type="button"
                      onClick={handlePaymentSubmit}
                      disabled={(event.price ?? 0) > 0 && !paymentMethod}
                      className="relative w-full h-[66px] shadow-[0px_4px_4px_0px_rgba(22,190,161,0.25)] disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                      whileHover={!((event.price ?? 0) > 0 && !paymentMethod) ? { scale: 1.02 } : {}}
                      whileTap={!((event.price ?? 0) > 0 && !paymentMethod) ? { scale: 0.98 } : {}}
                    >
                      <div className="absolute inset-0 bg-[rgba(146,128,253,0.8)] rounded-[14px]" />
                      
                      <motion.div 
                        className="absolute top-0 left-0 bottom-0 bg-[#cdff71] rounded-[14px]"
                        initial={{ width: '19.48%' }}
                        animate={!((event.price ?? 0) > 0 && !paymentMethod) ? {
                          width: ['19.48%', '100%', '19.48%'],
                        } : {}}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />

                      <div className="relative flex items-center justify-between px-4 h-full">
                        <div className="relative w-[39px] h-[39px] flex-shrink-0">
                          <svg className="absolute inset-0 w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 39 39">
                            <path d={svgPaths.p1e810100} fill="#C0E67B" />
                          </svg>
                          <div className="absolute inset-[32.35%]">
                            <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 13.7647 13.7647">
                              <path d={svgPaths.p3bc3d780} fill="white" opacity="0" />
                              <path d={svgPaths.p18cd5e00} fill="white" />
                            </svg>
                          </div>
                        </div>

                        <p className="font-['Mulish',sans-serif] font-bold text-white text-[15px] flex-1 text-center">
                          {(event.price ?? 0) > 0 ? 'Confirmer le paiement' : 'Obtenir mon accès gratuit'}
                        </p>

                        <div className="w-[24px] h-[25px] flex-shrink-0">
                          <svg className="w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.3856 14.4998">
                            <path d={svgPaths.p362601c0} fill="white" />
                          </svg>
                        </div>
                      </div>
                    </motion.button>

                    {/* Back Button */}
                    <motion.button
                      type="button"
                      onClick={handleBack}
                      className="w-full py-3 text-white/60 hover:text-white transition-colors font-['Inter',sans-serif] text-sm"
                      whileHover={{ scale: 1.01 }}
                    >
                      ← Retour aux informations
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {step === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-6 md:p-8 py-16 flex flex-col items-center justify-center"
                >
                  <div className="w-20 h-20 border-4 border-[#cdff71]/30 border-t-[#cdff71] rounded-full animate-spin mb-6" />
                  <h3 className="font-['DM_Sans',sans-serif] font-bold text-white text-2xl mb-2 text-center">
                    Traitement en cours
                  </h3>
                  <p className="font-['Inter',sans-serif] text-white/60 text-sm text-center">
                    Veuillez patienter pendant que nous traitons votre paiement...
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
