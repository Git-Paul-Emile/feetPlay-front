import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Copy, Check, Loader2, RefreshCw, Radio } from "lucide-react";
import CreatorAPI, { type CreatorStreamConfig } from "../../services/api/CreatorAPI";
import { useCreatorAuth } from "../../contexts/CreatorAuthContext";

const CATEGORIES = [
  "Football", "Basketball", "Tennis", "Fitness", "MMA", "Rugby",
  "Natation", "Athlétisme", "Cyclisme", "Sports de combat", "Autre",
];

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div>
      <label className="block text-sm text-gray-400 mb-1.5">{label}</label>
      <div className="flex gap-2">
        <input
          readOnly
          value={value}
          className="flex-1 rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white text-sm font-mono"
        />
        <button
          type="button"
          onClick={copy}
          className="rounded-xl bg-white/10 hover:bg-white/15 px-4 text-white transition-colors"
          title="Copier"
        >
          {copied ? <Check className="w-4 h-4 text-[#CDFF71]" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

export function CreatorSettings() {
  const { creator, updateProfile } = useCreatorAuth();
  const [form, setForm] = useState({
    name: "",
    channelName: "",
    channelSlug: "",
    category: "",
    bio: "",
    avatar: "",
    coverImage: "",
  });
  const [streamConfig, setStreamConfig] = useState<CreatorStreamConfig | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [streamLoading, setStreamLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (creator) {
      setForm({
        name: creator.name ?? "",
        channelName: creator.channelName ?? "",
        channelSlug: creator.channelSlug ?? "",
        category: creator.category ?? "",
        bio: creator.bio ?? "",
        avatar: creator.avatar ?? "",
        coverImage: creator.coverImage ?? "",
      });
    }
  }, [creator]);

  useEffect(() => {
    CreatorAPI.getStreamConfig()
      .then(setStreamConfig)
      .catch((err) => setError(err.message))
      .finally(() => setStreamLoading(false));
  }, []);

  function handleChannelName(val: string) {
    const slug = val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    setForm({ ...form, channelName: val, channelSlug: slug });
  }

  async function handleProfileSubmit(e: React.FormEvent) {
    e.preventDefault();
    setProfileLoading(true);
    setMessage(null);
    setError(null);
    try {
      await updateProfile({
        name: form.name,
        channelName: form.channelName,
        channelSlug: form.channelSlug,
        category: form.category,
        bio: form.bio || null,
        avatar: form.avatar || null,
        coverImage: form.coverImage || null,
      });
      setMessage("Profil de chaîne mis à jour.");
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de la mise à jour");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handleRegenerateKey() {
    if (!window.confirm("Régénérer la clé de stream ? Vous devrez reconfigurer OBS.")) return;
    setRegenerating(true);
    setError(null);
    try {
      const config = await CreatorAPI.regenerateStreamKey();
      setStreamConfig(config);
      setMessage("Nouvelle clé de stream générée.");
    } catch (err: any) {
      setError(err.message ?? "Impossible de régénérer la clé");
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Paramètres de la chaîne</h1>
        <p className="text-gray-400 mt-1">Configurez votre chaîne et votre logiciel de capture (OBS, Streamlabs…)</p>
      </div>

      {message && (
        <div className="mb-4 rounded-lg bg-[#CDFF71]/10 border border-[#CDFF71]/30 px-4 py-3 text-sm text-[#CDFF71]">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-4 py-3 text-sm text-white">
          {error}
        </div>
      )}

      {/* Configuration streaming */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-[#DE0035]/20 flex items-center justify-center">
            <Radio className="w-5 h-5 text-[#DE0035]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Configuration streaming</h2>
            <p className="text-sm text-gray-400">Utilisez ces informations dans OBS Studio ou Streamlabs</p>
          </div>
        </div>

        {streamLoading ? (
          <div className="h-32 rounded-xl bg-white/5 animate-pulse" />
        ) : streamConfig ? (
          <div className="space-y-4">
            <CopyField label="URL RTMP (Serveur)" value={streamConfig.rtmpUrl} />
            <CopyField label="Clé de stream (Stream Key)" value={streamConfig.streamKey} />
            {streamConfig.hint && (
              <p className="text-xs text-gray-500 bg-white/5 rounded-lg p-3">{streamConfig.hint}</p>
            )}
            <button
              type="button"
              onClick={handleRegenerateKey}
              disabled={regenerating}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              {regenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Régénérer la clé de stream
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-sm">Configuration streaming indisponible. Contactez le support.</p>
        )}
      </motion.div>

      {/* Profil chaîne */}
      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        onSubmit={handleProfileSubmit}
        className="rounded-2xl bg-white/5 border border-white/10 p-6 space-y-4"
      >
        <h2 className="text-lg font-semibold text-white mb-2">Informations de la chaîne</h2>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Nom complet</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Nom de la chaîne</label>
          <input
            required
            value={form.channelName}
            onChange={(e) => handleChannelName(e.target.value)}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
          />
          {form.channelSlug && (
            <p className="mt-1 text-xs text-gray-500">URL : /chaines/{form.channelSlug}</p>
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Slug URL</label>
          <input
            required
            pattern="[a-z0-9-]+"
            value={form.channelSlug}
            onChange={(e) => setForm({ ...form, channelSlug: e.target.value.toLowerCase() })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-[#DE0035]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Catégorie principale</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="bg-[#111]">{c}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Bio</label>
          <textarea
            rows={4}
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white resize-none focus:outline-none focus:border-[#DE0035]"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Photo de couverture (URL)</label>
          <input
            type="url"
            value={form.coverImage}
            onChange={(e) => setForm({ ...form, coverImage: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
          />
          {form.coverImage && (
            <img src={form.coverImage} alt="Couverture" className="mt-2 w-full h-32 object-cover rounded-xl" />
          )}
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1.5">Avatar (URL)</label>
          <input
            type="url"
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value })}
            placeholder="https://..."
            className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
          />
        </div>

        <button
          type="submit"
          disabled={profileLoading}
          className="w-full rounded-xl bg-[#CDFF71] hover:bg-[#CDFF71]/80 text-black font-semibold py-3 flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {profileLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          Enregistrer les modifications
        </button>
      </motion.form>
    </div>
  );
}
