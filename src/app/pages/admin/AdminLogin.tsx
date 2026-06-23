import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (err) {
      setError('Une erreur est survenue lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  const credentials = [
    { role: 'Super Admin', email: 'superadmin@feetiplay.com', password: 'Super@123' },
    { role: 'Admin', email: 'admin@feetiplay.com', password: 'Admin@123' },
    { role: 'Finance', email: 'finance@feetiplay.com', password: 'Finance@123' },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#de0035]/20 via-black to-[#cdff71]/10" />
      
      {/* Animated circles */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-[#de0035]/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#cdff71]/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <ShieldCheck className="w-12 h-12 text-[#cdff71]" />
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl">
              FÉÉTI PLAY
            </h1>
          </div>
          <p className="font-['Inter',sans-serif] text-white/60 text-sm">
            Espace d'administration sécurisé
          </p>
        </motion.div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[50px] rounded-[16px] p-8 border border-white/10"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="font-['Inter',sans-serif] text-white/80 text-sm block mb-2">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@feetiplay.com"
                  className="w-full bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] pl-12 pr-4 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#cdff71] transition-colors"
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
                  className="w-full bg-[rgba(255,255,255,0.1)] border border-[#62656a] rounded-[8px] pl-12 pr-12 py-3 text-white placeholder:text-white/30 outline-none focus:border-[#cdff71] transition-colors"
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

            {/* Error message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#de0035]/20 border border-[#de0035]/40 rounded-[8px] p-3 text-[#de0035] text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#cdff71] to-[#a8e34f] text-black font-['Inter',sans-serif] font-semibold py-3 rounded-[8px] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!loading ? { scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.98 } : {}}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Connexion en cours...
                </div>
              ) : (
                'Se connecter'
              )}
            </motion.button>
          </form>

          {/* Demo credentials button */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => setShowCredentials(!showCredentials)}
              className="w-full text-white/60 hover:text-white/80 text-sm font-['Inter',sans-serif] transition-colors"
            >
              {showCredentials ? '▼ Masquer' : '▶ Voir'} les accès de démo
            </button>
            
            {showCredentials && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 space-y-2"
              >
                {credentials.map((cred, index) => (
                  <div
                    key={index}
                    className="bg-[rgba(255,255,255,0.05)] rounded-[6px] p-3 text-xs font-['Courier_New',monospace]"
                  >
                    <div className="text-[#cdff71] font-semibold mb-1">{cred.role}</div>
                    <div className="text-white/60">Email: {cred.email}</div>
                    <div className="text-white/60">Pass: {cred.password}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center text-white/40 text-xs mt-6 font-['Inter',sans-serif]"
        >
          © 2025 FÉÉTI PLAY - Tous droits réservés
        </motion.p>
      </div>
    </div>
  );
}
