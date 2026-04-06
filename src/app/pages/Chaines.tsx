import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Users, Video } from 'lucide-react';
import ChannelsAPI, { type Channel } from '../services/api/ChannelsAPI';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export function Chaines() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    ChannelsAPI.getAll()
      .then((data) => {
        if (!mounted) return;
        setChannels(data);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Impossible de charger les chaines.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

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

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="aspect-[4/5] rounded-xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : channels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/70">
            Aucune chaine n est disponible pour le moment.
          </div>
        )}
      </div>
    </div>
  );
}
