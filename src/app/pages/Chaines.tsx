import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Play, Users, Video } from 'lucide-react';
import ChannelsAPI from '../services/api/ChannelsAPI';

export function Chaines() {
  const [channelsData, setChannelsData] = useState<Array<{ id: string; image: string; title: string; creator: string; subscribers: number; videos: number }>>([]);
  useEffect(() => {
    ChannelsAPI.getAll().then(list => setChannelsData(list.map(c => ({
      id: c.id,
      image: c.logo || c.coverImage || '',
      title: c.name,
      creator: c.slug,
      subscribers: c.subscriberCount,
      videos: c.eventCount,
    })))).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-[#DE0035] to-[#CDFF71] bg-clip-text text-transparent">
              Chaînes Sportives
            </span>
          </h1>
          <p className="text-gray-400 text-lg">
            Découvrez les meilleures chaînes de contenus sportifs
          </p>
        </motion.div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {channelsData.map((channel, index) => (
            <Link key={channel.id} to={`/chaines/${channel.creator}`}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-[#DE0035]/50 transition-all duration-300">
                {/* Channel Image */}
                <div className="relative aspect-video overflow-hidden">
                  <ImageWithFallback
                    src={channel.image}
                    alt={channel.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play Button on Hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-[#DE0035] flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                      <Play className="w-8 h-8 text-white fill-white ml-1" />
                    </div>
                  </div>
                </div>

                {/* Channel Info */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[#DE0035] transition-colors">
                    {channel.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{channel.creator}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{channel.subscribers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Video className="w-4 h-4" />
                      <span>{channel.videos} vidéos</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </Link>
          ))}
        </div>

        {/* Coming Soon Message */}
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
