import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Users, Video, TrendingUp, Play, Plus, Eye } from "lucide-react";
import CreatorAPI, { type CreatorDashboardStats, type CreatorVideo } from "../../services/api/CreatorAPI";
import { useCreatorAuth } from "../../contexts/CreatorAuthContext";

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white/5 border border-white/10 p-5"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3`} style={{ background: color + "20" }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-sm text-gray-400 mt-0.5">{label}</p>
    </motion.div>
  );
}

export function CreatorDashboard() {
  const { creator } = useCreatorAuth();
  const [stats, setStats] = useState<CreatorDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<CreatorVideo[]>([]);

  useEffect(() => {
    Promise.all([
      CreatorAPI.getDashboard(),
      CreatorAPI.getMyVideos(),
    ])
      .then(([s, v]) => {
        setStats(s);
        setVideos(v);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">
          Bonjour, <span className="text-[#CDFF71]">{creator?.name}</span> 👋
        </h1>
        <p className="text-gray-400 mt-1">Voici un aperçu de votre chaîne <strong className="text-white">{creator?.channelName}</strong></p>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="rounded-2xl bg-white/5 border border-white/10 p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Users} label="Abonnés" value={(stats?.subscriberCount ?? 0).toLocaleString()} color="#DE0035" />
          <StatCard icon={Video} label="Vidéos publiées" value={stats?.videoCount ?? 0} color="#CDFF71" />
          <StatCard icon={TrendingUp} label="Revenus totaux" value={`${(stats?.totalRevenue ?? 0).toLocaleString()} FCFA`} color="#60a5fa" />
          <StatCard icon={Eye} label="Vues (top)" value={(stats?.topVideos?.[0]?.viewCount ?? 0).toLocaleString()} color="#a78bfa" />
        </div>
      )}

      {/* Top vidéos */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Mes vidéos</h2>
          <button className="flex items-center gap-2 rounded-lg bg-[#DE0035] hover:bg-[#DE0035]/80 px-3 py-1.5 text-sm text-white transition-colors">
            <Plus className="w-4 h-4" />
            Nouvelle vidéo
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-16 rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-12">
            <Play className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Aucune vidéo publiée pour le moment.</p>
            <p className="text-gray-500 text-sm mt-1">Ajoutez votre première vidéo pour commencer.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-4 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors"
              >
                <div className="w-14 h-10 rounded-lg bg-white/10 overflow-hidden flex-none">
                  {video.thumbnail
                    ? <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center"><Play className="w-4 h-4 text-gray-500" /></div>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{video.title}</p>
                  <p className="text-xs text-gray-400">{video.viewCount.toLocaleString()} vues</p>
                </div>
                <div className="flex items-center gap-2">
                  {video.isLive && (
                    <span className="text-xs bg-[#DE0035] text-white px-2 py-0.5 rounded-full">LIVE</span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${video.isPublished ? "bg-[#CDFF71]/20 text-[#CDFF71]" : "bg-white/10 text-gray-400"}`}>
                    {video.isPublished ? "Publié" : "Brouillon"}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Channel info */}
      <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
        <h2 className="text-lg font-semibold text-white mb-3">Informations de la chaîne</h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-400">Catégorie :</span>
            <span className="text-[#CDFF71] ml-2">{creator?.category}</span>
          </div>
          <div>
            <span className="text-gray-400">Slug :</span>
            <span className="text-white ml-2">{creator?.channelSlug}</span>
          </div>
          <div>
            <span className="text-gray-400">Statut :</span>
            <span className="text-green-400 ml-2">Active</span>
          </div>
          {creator?.isVerified && (
            <div>
              <span className="text-[#CDFF71]">✓ Chaîne vérifiée</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
