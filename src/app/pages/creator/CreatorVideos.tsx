import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Pencil, Trash2, Play, Radio, X, Loader2 } from "lucide-react";
import CreatorAPI, { type CreatorVideo, type CreatorVideoInput } from "../../services/api/CreatorAPI";

const CATEGORIES = [
  "Football", "Basketball", "Tennis", "Fitness", "MMA", "Rugby",
  "Natation", "Athlétisme", "Cyclisme", "Sports de combat", "Autre",
];

const emptyForm: CreatorVideoInput = {
  title: "",
  description: "",
  thumbnail: "",
  videoUrl: "",
  duration: "",
  category: "",
  isPublished: false,
  isLive: false,
  isReplay: false,
  requiresSubscription: false,
  subscriptionPrice: 5000,
};

export function CreatorVideos() {
  const [videos, setVideos] = useState<CreatorVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<CreatorVideo | null>(null);
  const [form, setForm] = useState<CreatorVideoInput>(emptyForm);
  const [error, setError] = useState<string | null>(null);

  function loadVideos() {
    setLoading(true);
    CreatorAPI.getMyVideos()
      .then(setVideos)
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    loadVideos();
  }, []);

  function openCreate(type: "live" | "replay" | "draft") {
    setEditing(null);
    setForm({
      ...emptyForm,
      isLive: type === "live",
      isReplay: type === "replay",
      isPublished: type !== "draft",
    });
    setError(null);
    setModalOpen(true);
  }

  function openEdit(video: CreatorVideo) {
    setEditing(video);
    setForm({
      title: video.title,
      description: video.description ?? "",
      thumbnail: video.thumbnail ?? "",
      videoUrl: video.videoUrl ?? "",
      duration: video.duration ?? "",
      category: video.category ?? "",
      isPublished: video.isPublished,
      isLive: video.isLive,
      isReplay: video.isReplay ?? false,
      requiresSubscription: (video as any).requiresSubscription ?? false,
      subscriptionPrice: (video as any).subscriptionPrice ?? 5000,
    });
    setError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: CreatorVideoInput = {
        ...form,
        thumbnail: form.thumbnail || undefined,
        videoUrl: form.videoUrl || undefined,
        description: form.description || undefined,
        duration: form.duration || undefined,
        category: form.category || undefined,
      };
      if (editing) {
        await CreatorAPI.updateVideo(editing.id, payload);
      } else {
        await CreatorAPI.createVideo(payload);
      }
      setModalOpen(false);
      loadVideos();
    } catch (err: any) {
      setError(err.message ?? "Erreur lors de l'enregistrement");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(video: CreatorVideo) {
    if (!window.confirm(`Supprimer « ${video.title} » ?`)) return;
    try {
      await CreatorAPI.deleteVideo(video.id);
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } catch (err: any) {
      alert(err.message ?? "Erreur lors de la suppression");
    }
  }

  async function togglePublish(video: CreatorVideo) {
    try {
      const updated = await CreatorAPI.updateVideo(video.id, { isPublished: !video.isPublished });
      setVideos((prev) => prev.map((v) => (v.id === video.id ? updated : v)));
    } catch (err: any) {
      alert(err.message ?? "Erreur");
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Mes diffusions</h1>
          <p className="text-gray-400 mt-1">Créez, publiez et gérez vos directs et replays</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openCreate("live")}
            className="flex items-center gap-2 rounded-xl bg-[#DE0035] hover:bg-[#DE0035]/80 px-4 py-2.5 text-sm text-white transition-colors"
          >
            <Radio className="w-4 h-4" />
            Nouveau direct
          </button>
          <button
            onClick={() => openCreate("replay")}
            className="flex items-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 px-4 py-2.5 text-sm text-white transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un replay
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="rounded-2xl bg-white/5 border border-white/10 p-16 text-center">
          <Play className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400">Aucune diffusion pour le moment.</p>
          <p className="text-gray-500 text-sm mt-1">Créez votre premier direct ou replay pour commencer.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl bg-white/5 border border-white/10 p-4"
            >
              <div className="w-full sm:w-24 h-14 rounded-xl bg-white/10 overflow-hidden flex-none">
                {video.thumbnail ? (
                  <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-gray-500" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate">{video.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {video.viewCount.toLocaleString()} vues · {new Date(video.createdAt).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {video.isLive && (
                  <span className="text-xs bg-[#DE0035] text-white px-2 py-0.5 rounded-full">LIVE</span>
                )}
                {video.isReplay && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">Replay</span>
                )}
                <span className={`text-xs px-2 py-0.5 rounded-full ${video.isPublished ? "bg-[#CDFF71]/20 text-[#CDFF71]" : "bg-white/10 text-gray-400"}`}>
                  {video.isPublished ? "Publié" : "Brouillon"}
                </span>
                <button
                  onClick={() => togglePublish(video)}
                  className="text-xs text-gray-400 hover:text-white px-2 py-1 rounded-lg hover:bg-white/5"
                >
                  {video.isPublished ? "Dépublier" : "Publier"}
                </button>
                <button onClick={() => openEdit(video)} className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(video)} className="p-2 rounded-lg text-gray-400 hover:text-[#DE0035] hover:bg-[#DE0035]/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
            onClick={() => !saving && setModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-[#111] border border-white/10 p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editing ? "Modifier la diffusion" : form.isLive ? "Nouveau direct" : "Nouvelle vidéo"}
                </h2>
                <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {error && (
                <div className="mb-4 rounded-lg bg-[#DE0035]/10 border border-[#DE0035]/30 px-4 py-3 text-sm text-white">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Titre *</label>
                  <input
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white resize-none focus:outline-none focus:border-[#DE0035]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Catégorie</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
                    >
                      <option value="" className="bg-[#111]">—</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c} className="bg-[#111]">{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">Durée</label>
                    <input
                      value={form.duration}
                      onChange={(e) => setForm({ ...form, duration: e.target.value })}
                      placeholder="1h30"
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Miniature (URL)</label>
                  <input
                    type="url"
                    value={form.thumbnail}
                    onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
                  />
                </div>
                {!form.isLive && (
                  <div>
                    <label className="block text-sm text-gray-400 mb-1.5">URL vidéo / replay</label>
                    <input
                      type="url"
                      value={form.videoUrl}
                      onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                      className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-white focus:outline-none focus:border-[#DE0035]"
                    />
                  </div>
                )}
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isLive}
                      onChange={(e) => setForm({ ...form, isLive: e.target.checked, isReplay: e.target.checked ? false : form.isReplay })}
                      className="rounded"
                    />
                    Diffusion en direct
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isReplay}
                      onChange={(e) => setForm({ ...form, isReplay: e.target.checked, isLive: e.target.checked ? false : form.isLive })}
                      className="rounded"
                    />
                    Replay
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isPublished}
                      onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                      className="rounded"
                    />
                    Publier immédiatement
                  </label>
                </div>

                {/* Subscription access */}
                <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-3">
                  <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.requiresSubscription ?? false}
                      onChange={(e) => setForm({ ...form, requiresSubscription: e.target.checked })}
                      className="rounded"
                    />
                    <span className="font-medium text-white">Réservé aux abonnés premium</span>
                  </label>
                  {form.requiresSubscription && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Prix d'abonnement mensuel (FCFA)</label>
                      <input
                        type="number"
                        min={500}
                        step={500}
                        value={form.subscriptionPrice ?? 5000}
                        onChange={(e) => setForm({ ...form, subscriptionPrice: Number(e.target.value) })}
                        className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2.5 text-white focus:outline-none focus:border-[#CDFF71] text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Les abonnés paieront ce montant pour accéder à vos contenus exclusifs.
                      </p>
                    </div>
                  )}
                </div>
                {form.isLive && (
                  <p className="text-xs text-gray-500">
                    Configurez OBS avec votre clé de stream dans Paramètres → Configuration streaming.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-xl bg-[#DE0035] hover:bg-[#DE0035]/80 text-white font-semibold py-3 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? "Enregistrer" : "Créer"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
