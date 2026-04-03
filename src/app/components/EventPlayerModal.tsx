import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, MapPin, Clock, DollarSign, Users, Share2 } from 'lucide-react';
import { CalendarEventCardProps } from './CalendarEventCard';

interface EventPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEventCardProps | null;
}

export function EventPlayerModal({ isOpen, onClose, event }: EventPlayerModalProps) {
  if (!event) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25 }}
          >
            <div
              className="relative bg-[#0D0D0D] border border-white/20 rounded-[20px] max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Video/Image Section */}
              <div className="relative h-[300px] md:h-[400px] bg-black rounded-t-[20px] overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />

                {/* Live Badge */}
                {event.isLive && (
                  <div className="absolute top-6 left-6 flex items-center gap-2 bg-[#DE0035] rounded-[30px] px-4 py-2">
                    <motion.div
                      className="w-3 h-3 bg-white rounded-full"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [1, 0.5, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <span className="font-['Work_Sans',sans-serif] font-bold text-white text-[14px] uppercase">
                      EN DIRECT
                    </span>
                  </div>
                )}

                {/* Play Button (if not live) */}
                {!event.isLive && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.button
                      className="w-20 h-20 bg-[#DE0035] rounded-full flex items-center justify-center group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </motion.button>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 md:p-8">
                {/* Title & Category */}
                <div className="mb-6">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h2 className="font-['Mulish',sans-serif] font-bold text-white text-2xl md:text-3xl leading-tight">
                      {event.title}
                    </h2>
                    <div className="bg-[#CDFF71] rounded-[8px] px-3 py-1 shrink-0">
                      <span className="font-['Inter',sans-serif] font-bold text-[#000441] text-[13px]">
                        {event.category}
                      </span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {event.isFree ? (
                      <span className="font-['Inter',sans-serif] font-bold text-[#CDFF71] text-xl">
                        GRATUIT
                      </span>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="font-['Inter',sans-serif] font-bold text-white text-2xl">
                          {event.price?.toLocaleString()}
                        </span>
                        <span className="font-['Inter',sans-serif] font-medium text-white/60 text-lg">
                          FCFA
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Time */}
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-[12px]">
                    <div className="w-10 h-10 bg-[#CDFF71]/20 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-[#CDFF71]" />
                    </div>
                    <div>
                      <p className="font-['DM_Sans',sans-serif] text-white/60 text-[12px] mb-0.5">
                        Heure
                      </p>
                      <p className="font-['Inter',sans-serif] font-semibold text-white text-[15px]">
                        {event.time} • {event.duration}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-3 p-4 bg-white/5 rounded-[12px]">
                    <div className="w-10 h-10 bg-[#DE0035]/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#DE0035]" />
                    </div>
                    <div>
                      <p className="font-['DM_Sans',sans-serif] text-white/60 text-[12px] mb-0.5">
                        Lieu
                      </p>
                      <p className="font-['Inter',sans-serif] font-semibold text-white text-[15px]">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6 p-4 bg-white/5 rounded-[12px]">
                  <h3 className="font-['Inter',sans-serif] font-bold text-white text-[16px] mb-3">
                    À propos de l'événement
                  </h3>
                  <p className="font-['DM_Sans',sans-serif] text-white/70 text-[14px] leading-relaxed">
                    Découvrez {event.title} dans une ambiance exceptionnelle. Un événement à ne pas manquer 
                    dans la catégorie {event.category}. {event.isLive ? 'Actuellement en direct !' : 'Replay disponible.'}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <motion.button
                    className="flex-1 bg-[#DE0035] hover:bg-[#DE0035]/90 text-white font-['Inter',sans-serif] font-bold text-[15px] py-4 rounded-[12px] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {event.isLive ? 'Regarder en direct' : 'Regarder le replay'}
                  </motion.button>
                  
                  <motion.button
                    className="sm:w-auto px-6 bg-white/10 hover:bg-white/20 text-white font-['Inter',sans-serif] font-semibold text-[15px] py-4 rounded-[12px] transition-colors flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Share2 className="w-5 h-5" />
                    <span>Partager</span>
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-6 text-[13px]">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-white/60" />
                    <span className="text-white/60">1,234 spectateurs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <span className="text-white/60">Ajouté par 456 personnes</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
