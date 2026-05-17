import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(email, password);

    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Email ou mot de passe incorrect');
    }

    setLoading(false);
  };

  const credentials = [
    { role: 'Super Admin', email: 'superadmin@feetiplay.com', password: 'SuperAdmin2024!' },
    { role: 'Admin', email: 'admin@feetiplay.com', password: 'Admin2024!' },
    { role: 'Modérateur', email: 'moderator@feetiplay.com', password: 'Moderator2024!' },
    { role: 'Finance', email: 'finance@feetiplay.com', password: 'Finance2024!' },
    { role: 'Growth Marketing', email: 'growth@feetiplay.com', password: 'Growth2024!' },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#de0035]/20 via-black to-[#cdff71]/10" />
      
      {/* Animated circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#de0035]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#cdff71]/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-[rgba(255,255,255,0.05)] backdrop-blur-[50px] border border-white/10 rounded-[20px] p-8 md:p-12 w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-4xl text-white mb-2">
            FEETI <span className="text-[#de0035]">PLAY</span>
          </h1>
          <p className="font-['Inter',sans-serif] text-white/60 text-sm">
            Administration Dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="font-['Inter',sans-serif] text-white/80 text-sm block mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@feetiplay.com"
                className="w-full bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] pl-12 pr-4 py-3 text-white outline-none focus:border-[#cdff71] transition-colors placeholder:text-white/30"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="font-['Inter',sans-serif] text-white/80 text-sm block mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] pl-12 pr-12 py-3 text-white outline-none focus:border-[#cdff71] transition-colors placeholder:text-white/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#de0035]/20 border border-[#de0035]/50 rounded-[8px] p-3 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 text-[#de0035]" />
              <p className="font-['Inter',sans-serif] text-sm text-white">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#de0035] to-[#de0035]/80 hover:from-[#de0035]/90 hover:to-[#de0035]/70 text-white font-['Inter',sans-serif] font-semibold py-3 rounded-[8px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Connexion...</span>
              </div>
            ) : (
              'Se connecter'
            )}
          </motion.button>
        </form>

        {/* Demo Credentials Toggle */}
        <div className="mt-6">
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="w-full text-center text-[#cdff71] hover:text-[#cdff71]/80 font-['Inter',sans-serif] text-sm transition-colors"
          >
            {showCredentials ? 'Masquer' : 'Voir'} les identifiants de démo
          </button>

          {showCredentials && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 space-y-3"
            >
              {credentials.map((cred) => (
                <div
                  key={cred.email}
                  className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[8px] p-3"
                >
                  <p className="font-['Inter',sans-serif] font-semibold text-[#fcc434] text-sm mb-1">
                    {cred.role}
                  </p>
                  <p className="font-['Inter',sans-serif] text-white/80 text-xs mb-1">
                    📧 {cred.email}
                  </p>
                  <p className="font-['Inter',sans-serif] text-white/60 text-xs">
                    🔑 {cred.password}
                  </p>
                </div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="font-['Inter',sans-serif] text-white/40 text-xs">
            © 2026 Fééti Play , propulsé par Eroiste , Tous droits réservés.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
