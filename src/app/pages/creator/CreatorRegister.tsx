import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useCreatorAuth } from "../../contexts/CreatorAuthContext";

const CATEGORIES = [
  "Football", "Basketball", "Tennis", "Fitness", "MMA", "Rugby",
  "Natation", "Athlétisme", "Cyclisme", "Sports de combat", "Autre",
];

export function CreatorRegister() {
  const { register, isAuthenticated } = useCreatorAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    channelName: "",
    channelSlug: "",
    category: "",
    bio: "",
  });

  if (isAuthenticated) {
    navigate("/creator/dashboard", { replace: true });
    return null;
  }

  function handleChannelName(val: string) {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm({ ...form, channelName: val, channelSlug: slug });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setErrors({});
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        channelName: form.channelName,
        channelSlug: form.channelSlug,
        category: form.category,
        bio: form.bio || undefined,
      });
      navigate("/creator/dashboard");
    } catch (err: any) {
      if (err.errors) setErrors(err.errors);
      else setError(err.message ?? "Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold bg-gradient-to-r from-[#DE0035] to-[#CDFF71] bg-clip-text text-transparent">
            FéétiPlay
          </Link>
          <p className="text-gray-400 mt-2">Devenez Créateur</p>
        </div>

        <div className="rounded-2xl bg-[#111] border border-white/10 p-8">
          <h1 className="text-2xl font-bold text-white mb-6">Créer une chaîne</h1>

          {error && (
            <div className="mb-4 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-4 py-3 text-sm text-white">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Nom complet</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DE0035] transition-colors"
                  placeholder="Jean Dupont"
                />
                {errors.name && <p className="mt-1 text-xs text-[#DE0035]">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DE0035] transition-colors"
                  placeholder="vous@email.com"
                />
                {errors.email && <p className="mt-1 text-xs text-[#DE0035]">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Nom de la chaîne</label>
              <input
                type="text"
                required
                value={form.channelName}
                onChange={(e) => handleChannelName(e.target.value)}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DE0035] transition-colors"
                placeholder="Ma Chaîne Sport"
              />
              {form.channelSlug && (
                <p className="mt-1 text-xs text-gray-500">Slug : feetiplay.com/creators/{form.channelSlug}</p>
              )}
              {errors.channelName && <p className="mt-1 text-xs text-[#DE0035]">{errors.channelName}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Catégorie</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035] transition-colors"
              >
                <option value="">Choisir une catégorie</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#111]">{c}</option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-xs text-[#DE0035]">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Bio (optionnelle)</label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#DE0035] transition-colors resize-none"
                placeholder="Décrivez votre chaîne..."
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-[#DE0035] transition-colors"
                  placeholder="Min. 6 caractères"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-[#DE0035]">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#DE0035] hover:bg-[#DE0035]/80 text-white font-semibold py-3 flex items-center justify-center gap-2 transition-colors disabled:opacity-50 mt-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Créer ma chaîne
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Déjà créateur ?{" "}
            <Link to="/creator/login" className="text-[#CDFF71] hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
