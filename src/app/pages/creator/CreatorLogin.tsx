import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useCreatorAuth } from "../../contexts/CreatorAuthContext";

export function CreatorLogin() {
  const { login, isAuthenticated } = useCreatorAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    navigate("/creator/dashboard", { replace: true });
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(form.email, form.password);
      navigate("/creator/dashboard");
    } catch (err: any) {
      setError(err.message ?? "Erreur de connexion");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-[#DE0035] to-[#CDFF71] bg-clip-text text-transparent">
            FéétiPlay
          </Link>
          <p className="text-gray-400 mt-2">Espace Créateur</p>
        </div>

        <div className="rounded-2xl bg-[#111] border border-white/10 p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Connexion Créateur</h1>

          {error && (
            <div className="mb-4 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-4 py-3 text-sm text-white">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DE0035] transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#DE0035] transition-colors"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#DE0035] hover:bg-[#DE0035]/80 text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Se connecter
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Pas encore créateur ?{" "}
            <Link to="/creator/register" className="text-[#CDFF71] hover:underline">
              Créer une chaîne
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
