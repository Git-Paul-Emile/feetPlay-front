import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router';
import { X, Mail, Phone, User as UserIcon } from 'lucide-react';
import svgPaths from "../../imports/svg-z30khrsoqy";
import { Footer } from '../components/Footer';

export function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Register attempt:', { firstName, lastName, email, phone });
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="relative w-full max-w-md my-8"
        >
          {/* Close Button */}
          <Link to="/">
            <button
              className="absolute -top-2 -right-2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#3a3a3a] rounded-full flex items-center justify-center hover:bg-[#4a4a4a] transition-colors group"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </Link>

          {/* Modal Content */}
          <div className="bg-black rounded-2xl p-8 md:p-10 max-h-[90vh] overflow-y-auto">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src="/logo blanc.png" alt="Fééti Play" className="h-10 w-auto object-contain" />
            </div>

            {/* Title */}
            <h2 className="font-['Inter',sans-serif] font-semibold text-white text-2xl md:text-[28px] text-center mb-2">
              S'inscrire
            </h2>

            {/* Subtitle */}
            <p className="font-['Inter',sans-serif] text-[#999999] text-sm md:text-base text-center mb-8">
              Entre tes prénom(s) et nom à l'état civil
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* First Name Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <UserIcon className="w-5 h-5 text-[#999999]" />
                </div>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Prénom(s)"
                  className="w-full h-[56px] bg-transparent border border-[#3a3a3a] rounded-full px-12 text-white placeholder:text-[#666666] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#CDFF71] transition-colors"
                  required
                />
              </div>

              {/* Last Name Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <UserIcon className="w-5 h-5 text-[#999999]" />
                </div>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Nom"
                  className="w-full h-[56px] bg-transparent border border-[#3a3a3a] rounded-full px-12 text-white placeholder:text-[#666666] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#CDFF71] transition-colors"
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Mail className="w-5 h-5 text-[#999999]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresse E-mail"
                  className="w-full h-[56px] bg-transparent border border-[#3a3a3a] rounded-full px-12 text-white placeholder:text-[#666666] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#CDFF71] transition-colors"
                  required
                />
              </div>

              {/* Phone Field */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Phone className="w-5 h-5 text-[#999999]" />
                </div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Numéro de téléphone"
                  className="w-full h-[56px] bg-transparent border border-[#3a3a3a] rounded-full px-12 text-white placeholder:text-[#666666] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#CDFF71] transition-colors"
                  required
                />
              </div>

              {/* Already Have Account Link */}
              <div className="text-right">
                <Link 
                  to="/login"
                  className="font-['Inter',sans-serif] text-sm"
                >
                  <span className="text-white">Vous avez déjà un compte ? </span>
                  <span className="text-[#de0035] hover:text-[#c5002f] underline transition-colors">Connectez-vous</span>
                </Link>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                className="w-full h-[56px] bg-[#e8e3ff] rounded-full font-['Inter',sans-serif] font-semibold text-black text-base hover:bg-[#d5ceff] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                S'inscrire
              </motion.button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#3a3a3a]" />
              <span className="font-['Inter',sans-serif] text-[#999999] text-sm">Ou</span>
              <div className="flex-1 h-px bg-[#3a3a3a]" />
            </div>

            {/* Social Registration */}
            <div>
              <p className="font-['Inter',sans-serif] text-[#999999] text-sm text-center mb-4">
                S'inscrire avec
              </p>
              <div className="flex items-center justify-center gap-4">
                {/* Facebook */}
                <button
                  onClick={() => handleSocialRegister('facebook')}
                  className="w-12 h-12 rounded-full bg-[#1877f2] flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="S'inscrire avec Facebook"
                >
                  <svg className="w-6 h-6" fill="white" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </button>

                {/* Google */}
                <button
                  onClick={() => handleSocialRegister('google')}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="S'inscrire avec Google"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                {/* X (Twitter) */}
                <button
                  onClick={() => handleSocialRegister('twitter')}
                  className="w-12 h-12 rounded-full bg-black border border-[#3a3a3a] flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="S'inscrire avec X"
                >
                  <svg className="w-5 h-5" fill="white" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}