import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Users, Video } from 'lucide-react';
import ChannelsAPI, { type Channel } from '../services/api/ChannelsAPI';
import CreatorAPI, { type Creator } from '../services/api/CreatorAPI';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { CreatorCarousel } from '../components/creator/CreatorCarousel';
import { firebaseClientErrorToUserMessage } from '../utils/firebaseUserFacingError';

export function Chaines() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [allCreators, setAllCreators] = useState<Creator[]>([]);
  const [creatorsLoading, setCreatorsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    ChannelsAPI.getAll()
      .then((data) => { if (!mounted) return; setChannels(data); setError(null); })
      .catch((err) => { if (!mounted) return; setError(firebaseClientErrorToUserMessage(err, 'Impossible de charger les chaines.')); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    CreatorAPI.getAll()
      .then((data) => { if (mounted) setAllCreators(data); })
      .catch(() => {})
      .finally(() => { if (mounted) setCreatorsLoading(false); });
    return () => { mounted = false; };
  }, []);

  const contentCreators = allCreators.filter((c) =>
    ["Football", "Basketball", "Tennis", "Fitness", "MMA", "Rugby"].includes(c.category)
  );
  const recommendedCreators = [...allCreators].sort((a, b) => b.subscriberCount - a.subscriberCount).slice(0, 12);
  const newCreators = [...allCreators].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#DE0035] to-[#CDFF71] bg-clip-text text-transparent">
              Chaines disponibles
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            {loading ? 'Chargement des chaines...' : `${channels.length} chaine(s) actives sur FeetiPlay`}
          </p>
        </motion.div>

        {error && (
          <div className="mb-8 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
            {error}
          </div>
        )}

        {/* ── Chaînes officielles ───────────────────────────────────────────────── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="aspect-[4/5] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : channels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
            {channels.map((channel, index) => (
              <motion.div
                key={channel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#DE0035]/50 transition-all duration-300">
                  <div className="relative aspect-video overflow-hidden">
                    <ImageWithFallback
                      src={channel.coverImage || channel.logo || ''}
                      alt={channel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 rounded-full bg-[#DE0035] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 text-white fill-white ml-1" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#DE0035] transition-colors">
                      {channel.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{channel.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{channel.subscriberCount.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        <span>{channel.eventCount} evenements</span>
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] uppercase tracking-wide text-[#CDFF71]">
                      {channel.category}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/70 mb-16">
            Aucune chaine n est disponible pour le moment.
          </div>
        )}

        {/* ── Chaînes Créateurs Content ──────────────────────────────────────────── */}
        <div className="border-t border-white/10 pt-12 mb-4">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Chaînes <span className="text-[#DE0035]">Créateurs</span> Content
            </h2>
            <p className="text-gray-400">Des créateurs passionnés de sport qui partagent leurs contenus exclusifs</p>
          </motion.div>
          <CreatorCarousel
            title="Créateurs par discipline"
            creators={contentCreators.length > 0 ? contentCreators : allCreators.slice(0, 10)}
            loading={creatorsLoading}
          />
        </div>

        {/* ── Créateurs Recommandés ─────────────────────────────────────────────── */}
        <CreatorCarousel
          title="Créateurs Recommandés"
          creators={recommendedCreators}
          loading={creatorsLoading}
        />

        {/* ── Nouveaux Créateurs ────────────────────────────────────────────────── */}
        <CreatorCarousel
          title="Nouveaux Créateurs"
          creators={newCreators}
          loading={creatorsLoading}
        />

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-block px-6 py-3 rounded-lg bg-white/5 backdrop-blur-sm border border-white/10">
            <p className="text-gray-400">
              Plus de chaînes bientôt disponibles ! 🎬
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
