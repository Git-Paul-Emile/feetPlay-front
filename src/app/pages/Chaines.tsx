import { motion } from 'motion/react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Play, Users, Video } from 'lucide-react';

// Import creator images from Figma
import imgRectangle14 from "figma:asset/ef1c7a84ffcc0c7ff81640c9a21f3b59c0f022a9.png";
import imgRectangle15 from "figma:asset/06b162c1f83a8666dc1db17b0575bdba3b090bc6.png";
import imgRectangle16 from "figma:asset/e0ae57a6b7e747b6f009c5d469f7f0870740e20b.png";
import imgRectangle17 from "figma:asset/f9729dab27554e3204cb7e326a0747a52f7461b2.png";
import imgRectangle18 from "figma:asset/8bf475b1baf942622ef73eae62f42443362a84c0.png";
import imgRectangle19 from "figma:asset/ab5fbf86c9ca0dd20e8190a5dcf0070bd643c38e.png";
import imgRectangle20 from "figma:asset/0d14b47da8f906a94e5fd4eda4e67f2d47d5690e.png";

const channelsData = [
  {
    id: 1,
    image: imgRectangle14,
    title: 'Life in a bubble',
    creator: 'The van',
    subscribers: 12500,
    videos: 45,
  },
  {
    id: 2,
    image: imgRectangle15,
    title: 'Mountain',
    creator: 'Krisx',
    subscribers: 8300,
    videos: 32,
  },
  {
    id: 3,
    image: imgRectangle16,
    title: 'Limits',
    creator: 'John Dillion',
    subscribers: 15700,
    videos: 58,
  },
  {
    id: 4,
    image: imgRectangle17,
    title: "Everything's black",
    creator: 'Ameed',
    subscribers: 9800,
    videos: 28,
  },
  {
    id: 5,
    image: imgRectangle18,
    title: 'Cancelled',
    creator: 'Enimen',
    subscribers: 22100,
    videos: 72,
  },
  {
    id: 6,
    image: imgRectangle19,
    title: 'Nomad',
    creator: 'Alex Rivers',
    subscribers: 6400,
    videos: 19,
  },
  {
    id: 7,
    image: imgRectangle20,
    title: 'Urban Stories',
    creator: 'Maria Santos',
    subscribers: 11200,
    videos: 41,
  },
];

export function Chaines() {
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
            <motion.div
              key={channel.id}
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
