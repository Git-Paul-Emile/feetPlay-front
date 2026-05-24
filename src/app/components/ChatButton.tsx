import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function ChatButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Button - Floating */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-[#DE0035] to-[#FF1744] rounded-full flex items-center justify-center shadow-2xl hover:shadow-[0_0_30px_rgba(222,0,53,0.6)] transition-all duration-300 group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 md:w-7 md:h-7 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative"
            >
              <MessageCircle className="w-6 h-6 md:w-7 md:h-7 text-white" />
              {/* Notification Badge */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#CDFF71] rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="fixed bottom-24 md:bottom-28 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Chat Header */}
            <div className="bg-gradient-to-r from-[#DE0035] to-[#FF1744] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-['Inter',sans-serif] font-semibold text-white text-base">
                    Support FeetiPlay
                  </h3>
                  <p className="font-['Inter',sans-serif] text-white/80 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-[#CDFF71] rounded-full animate-pulse" />
                    En ligne
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="p-4 space-y-3 h-64 overflow-y-auto">
              <div className="flex gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-[#DE0035] to-[#FF1744] rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-xs font-bold">F</span>
                </div>
                <div className="bg-white/10 rounded-xl rounded-tl-none p-3 max-w-[80%]">
                  <p className="font-['Inter',sans-serif] text-white text-sm">
                    Bonjour ! 👋 Comment puis-je vous aider aujourd'hui ?
                  </p>
                  <span className="font-['Inter',sans-serif] text-white/50 text-xs mt-1 block">
                    Maintenant
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2 pt-2">
                <p className="font-['Inter',sans-serif] text-white/70 text-xs">Questions fréquentes :</p>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-3 text-left transition-colors">
                  <p className="font-['Inter',sans-serif] text-white text-sm">
                    Comment acheter un ticket ?
                  </p>
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-3 text-left transition-colors">
                  <p className="font-['Inter',sans-serif] text-white text-sm">
                    Problème de lecture vidéo
                  </p>
                </button>
                <button className="w-full bg-white/5 hover:bg-white/10 border border-white/20 rounded-lg p-3 text-left transition-colors">
                  <p className="font-['Inter',sans-serif] text-white text-sm">
                    Gérer mon abonnement
                  </p>
                </button>
              </div>
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  className="flex-1 bg-white/10 border border-white/20 rounded-full px-4 py-2 text-white placeholder:text-white/50 font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#CDFF71] focus:ring-2 focus:ring-[#CDFF71]/30 transition-all"
                />
                <button className="w-10 h-10 bg-gradient-to-r from-[#DE0035] to-[#FF1744] rounded-full flex items-center justify-center hover:shadow-lg transition-all">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
