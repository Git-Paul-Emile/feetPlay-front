import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import svgPaths from "../../imports/svg-z30khrsoqy";
import { PurchaseData } from './PurchaseModal';

interface DigitalTicketProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseData: PurchaseData | null;
}

export function DigitalTicket({ isOpen, onClose, purchaseData }: DigitalTicketProps) {
  if (!purchaseData) return null;

  // Generate unique order ID
  const orderId = `${Math.floor(Math.random() * 9000000000) + 1000000000}`;
  
  // Generate access code for QR
  const accessCode = `FP${purchaseData.eventReference}-${orderId.slice(-6)}`;

  // QR Code data - includes event ID and access code for verification
  const qrCodeData = JSON.stringify({
    eventId: purchaseData.eventId,
    accessCode: accessCode,
    orderId: orderId,
    userName: purchaseData.userName,
    eventDate: purchaseData.eventDate,
  });

  const handleDownload = () => {
    // In production, this would trigger a PDF download
    alert('Fonctionnalité de téléchargement du ticket à venir !');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Ticket - ${purchaseData.eventTitle}`,
          text: `Mon ticket pour ${purchaseData.eventTitle}\nCode d'accès: ${accessCode}`,
        });
      } catch (err) {
        console.log('Partage annulé');
      }
    } else {
      alert('Fonctionnalité de partage non disponible sur ce navigateur');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-[500px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute -top-12 right-0 w-10 h-10 backdrop-blur-[5px] rounded-full flex items-center justify-center hover:scale-110 transition-transform z-10"
              style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
            >
              <X className="w-5 h-5 text-white" />
            </button>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-['Inter',sans-serif] font-bold text-white text-2xl md:text-3xl text-center mb-6"
            >
              Votre accès au live
            </motion.h2>

            {/* Ticket Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-[12px] overflow-hidden shadow-2xl"
            >
              {/* Event Image */}
              <div className="relative h-[200px] overflow-hidden">
                <img
                  src={purchaseData.eventImage}
                  alt={purchaseData.eventTitle}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30" />
              </div>

              {/* Ticket Content */}
              <div className="p-6">
                {/* Feeti Logo & Access Code */}
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-dashed border-gray-300">
                  <div className="h-8 w-32">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 156 39">
                      <g>
                        <path d={svgPaths.p142ece80} fill="#0a0a0a" />
                        <path d={svgPaths.p28ea7700} fill="#811AEC" />
                        <path d={svgPaths.p34f09600} fill="#F1C519" />
                        <path d={svgPaths.p261cd780} fill="#E43962" />
                        <path d={svgPaths.p3768dd00} fill="#16BDA0" />
                        <path d={svgPaths.p5a83700} fill="#811AEC" />
                        <path d={svgPaths.p1116dfc0} fill="#F1C519" />
                        <path d={svgPaths.p3f6ce800} fill="#E43962" />
                        <path d={svgPaths.p206aab00} fill="#16BDA0" />
                      </g>
                      <g transform="translate(44, 3)">
                        <path d={svgPaths.p2d591880} fill="#0a0a0a" />
                        <path d={svgPaths.p3aaf32c0} fill="#0a0a0a" />
                        <path d={svgPaths.p87ab6f0} fill="#0a0a0a" />
                        <path d={svgPaths.p20a2e100} fill="#0a0a0a" />
                        <path d={svgPaths.p66cf900} fill="#0a0a0a" />
                      </g>
                    </svg>
                  </div>
                  <div className="text-right">
                    <p className="font-['Inter',sans-serif] text-gray-600 text-xs mb-1">Code d'accès :</p>
                    <p className="font-['Inter',sans-serif] font-bold text-gray-900 text-lg">{accessCode}</p>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex justify-center mb-6">
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                    <QRCodeSVG
                      value={qrCodeData}
                      size={200}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>

                {/* Order ID */}
                <div className="text-center mb-6 pb-6 border-b border-dashed border-gray-300">
                  <p className="font-['Inter',sans-serif] text-gray-600 text-sm">
                    Order ID: <span className="font-semibold text-gray-900">{orderId}</span>
                  </p>
                </div>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div>
                    <p className="font-['Inter',sans-serif] text-gray-600 text-xs mb-1">Événement</p>
                    <p className="font-['Inter',sans-serif] font-semibold text-gray-900 text-base">
                      {purchaseData.eventTitle}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="font-['Inter',sans-serif] text-gray-600 text-xs mb-1">Date</p>
                      <p className="font-['Inter',sans-serif] font-medium text-gray-900 text-sm">
                        {purchaseData.eventDate}
                      </p>
                    </div>
                    <div>
                      <p className="font-['Inter',sans-serif] text-gray-600 text-xs mb-1">Heure</p>
                      <p className="font-['Inter',sans-serif] font-medium text-gray-900 text-sm">
                        {purchaseData.eventTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-['Inter',sans-serif] text-gray-600 text-xs mb-1">Lieu</p>
                    <p className="font-['Inter',sans-serif] font-medium text-gray-900 text-sm">
                      {purchaseData.eventLocation}
                    </p>
                  </div>

                  <div>
                    <p className="font-['Inter',sans-serif] text-gray-600 text-xs mb-1">Titulaire</p>
                    <p className="font-['Inter',sans-serif] font-medium text-gray-900 text-sm">
                      {purchaseData.userName}
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-['Inter',sans-serif] text-gray-700 text-xs leading-relaxed">
                    <span className="font-semibold">Instructions:</span> Présentez ce QR code ou votre code d'accès pour accéder au streaming en direct de l'événement. Conservez ce ticket jusqu'à la fin de l'événement.
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleDownload}
                    className="bg-gray-900 hover:bg-gray-800 text-white font-['Inter',sans-serif] font-semibold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger
                  </button>
                  <button
                    onClick={handleShare}
                    className="bg-[#CDFF71] hover:bg-[#BDEE61] text-gray-900 font-['Inter',sans-serif] font-semibold text-sm py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Success Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-6 text-center"
            >
              <p className="font-['Inter',sans-serif] text-[#CDFF71] text-sm">
                ✓ Achat confirmé ! Un email de confirmation a été envoyé à {purchaseData.userEmail}
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
