import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router';
import { Loader2, X, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Footer } from '../components/Footer';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { login, startGoogleAuth, loginFromFeeti2SSO, isAuthenticated, isLoading, user, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const redirectTo = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  useEffect(() => {
    const ssoToken = searchParams.get('sso_token');
    if (!ssoToken || isLoading || isAuthenticated) return;

    loginFromFeeti2SSO(ssoToken)
      .then(() => navigate(redirectTo, { replace: true }))
      .catch(() => {});
  }, [searchParams, isLoading, isAuthenticated, loginFromFeeti2SSO, navigate, redirectTo]);

  useEffect(() => {
    if (isLoading) return;

    if (window.sessionStorage.getItem('feetiplay_google_pending_token')) {
      navigate('/register/google-complete', { replace: true });
    }
  }, [isLoading, navigate]);

  const handleLogoutAndStay = async () => {
    await logout();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(email, password);
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');

    try {
      const result = await startGoogleAuth();
      if (result.requiresCompletion) {
        navigate('/register/google-complete', { state: { prefill: result.prefill }, replace: true });
        return;
      }
      if (!result.user) return;
      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      setError((err as Error)?.message ?? 'Connexion Google impossible');
    } finally {
      setGoogleLoading(false);
    }
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
          <Link to="/">
            <button
              className="absolute -top-2 -right-2 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#3a3a3a] rounded-full flex items-center justify-center hover:bg-[#4a4a4a] transition-colors group"
              aria-label="Fermer"
            >
              <X className="w-5 h-5 text-white group-hover:rotate-90 transition-transform duration-300" />
            </button>
          </Link>

          <div className="bg-black rounded-2xl p-8 md:p-10">
            <div className="flex justify-center mb-8">
              <img src="/logo blanc.png" alt="Fééti Play" className="h-10 w-auto object-contain" />
            </div>

            <h2 className="font-['Inter',sans-serif] font-semibold text-white text-2xl md:text-[28px] text-center mb-2">
              Se connecter
            </h2>

            <p className="font-['Inter',sans-serif] text-[#999999] text-sm md:text-base text-center mb-8">
              Entre tes identifiants de connexion
            </p>

            {!isLoading && isAuthenticated && user ? (
              <div className="space-y-4 mb-6 rounded-2xl border border-[#CDFF71]/30 bg-[#CDFF71]/10 px-4 py-4 text-center">
                <p className="text-sm text-white">
                  Vous êtes déjà connecté en tant que <span className="font-semibold">{user.name}</span>.
                </p>
                <div className="flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(redirectTo, { replace: true })}
                    className="w-full h-12 rounded-full bg-[#CDFF71] font-semibold text-black"
                  >
                    Continuer vers l'accueil
                  </button>
                  <button
                    type="button"
                    onClick={handleLogoutAndStay}
                    className="w-full h-12 rounded-full border border-[#3a3a3a] text-white hover:bg-[#1a1a1a]"
                  >
                    Se déconnecter pour changer de compte
                  </button>
                </div>
              </div>
            ) : null}

            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#CDFF71]" />
              </div>
            ) : !isAuthenticated ? (
            <>
            <form onSubmit={handleSubmit} className="space-y-5">
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

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <Lock className="w-5 h-5 text-[#999999]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full h-[56px] bg-transparent border border-[#3a3a3a] rounded-full px-12 text-white placeholder:text-[#666666] font-['Inter',sans-serif] text-sm focus:outline-none focus:border-[#CDFF71] transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-[#999999] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="text-right">
                <Link
                  to="/register"
                  className="font-['Inter',sans-serif] text-[#de0035] text-sm hover:text-[#c5002f] transition-colors"
                >
                  Vous n'êtes pas compté ? <span className="underline">S'inscrire</span>
                </Link>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-[#de0035]/40 bg-[#de0035]/10 px-4 py-3 text-sm text-white"
                >
                  {error}
                </motion.div>
              )}

              <motion.button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full h-[56px] bg-[#CDFF71] rounded-full font-['Inter',sans-serif] font-semibold text-black text-base hover:bg-[#b8e663] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Connexion...' : 'Se connecter'}
              </motion.button>
            </form>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-[#3a3a3a]" />
              <span className="font-['Inter',sans-serif] text-[#999999] text-sm">Ou</span>
              <div className="flex-1 h-px bg-[#3a3a3a]" />
            </div>

            <div>
              <p className="font-['Inter',sans-serif] text-[#999999] text-sm text-center mb-4">
                Se connecter avec
              </p>
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || googleLoading}
                  className="w-12 h-12 rounded-full bg-white flex items-center justify-center hover:scale-110 transition-transform disabled:opacity-60"
                  aria-label="Se connecter avec Google"
                >
                  {googleLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                  ) : (
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            </>
            ) : null}
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
