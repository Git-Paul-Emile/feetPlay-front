import { motion } from 'motion/react';
import { Play, Clock, Eye } from 'lucide-react';

export interface CreatorContentCardProps {
  image: string;
  title: string;
  date: string;
  duration: string;
  views: string;
  type: 'video' | 'podcast' | 'other';
  onClick?: () => void;
}

export function CreatorContentCard({
  image,
  title,
  date,
  duration,
  views,
  type,
  onClick
}: CreatorContentCardProps) {
  const getBadgeInfo = () => {
    switch (type) {
      case 'video':
        return { label: 'VIDÉO', color: '#DE0035' };
      case 'podcast':
        return { label: 'PODCAST', color: '#811AEC' };
      case 'other':
        return { label: 'CONTENU', color: '#16BDA0' };
    }
  };

  const badge = getBadgeInfo();

  return (
    <motion.div
      className="relative h-[280px] rounded-2xl overflow-hidden cursor-pointer group"
      onClick={onClick}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      </div>

      {/* Play Button - Center */}
      {type === 'video' && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-white/40"
            whileHover={{ scale: 1.15 }}
            transition={{ duration: 0.3 }}
          >
            <Play className="w-8 h-8 text-white fill-white ml-1" />
          </motion.div>

          {/* Pulse Animation */}
          <motion.div
            className="absolute inset-0 border-2 border-white rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              scale: [1, 1.4],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </div>
      )}

      {/* Badge - Top Right */}
      <div className="absolute right-4 top-4 px-3 py-1.5 rounded-full flex items-center gap-2"
           style={{ backgroundColor: badge.color }}
      >
        <span className="font-['Inter',sans-serif] font-semibold text-white text-xs uppercase">
          {badge.label}
        </span>
      </div>

      {/* Content - Bottom */}
      <div className="absolute left-0 right-0 bottom-0 p-6">
        {/* Title */}
        <h3 className="font-['Inter',sans-serif] font-bold text-white text-lg mb-3 line-clamp-2">
          {title}
        </h3>

        {/* Meta Info */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Duration */}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-white/70" />
            <span className="font-['Inter',sans-serif] text-white/70 text-sm">
              {duration}
            </span>
          </div>

          {/* Views */}
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-white/70" />
            <span className="font-['Inter',sans-serif] text-white/70 text-sm">
              {views}
            </span>
          </div>

          {/* Date */}
          <span className="font-['Inter',sans-serif] text-white/50 text-sm ml-auto">
            {date}
          </span>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div
        className="absolute inset-0 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{
          borderColor: badge.color,
          boxShadow: `0 0 20px ${badge.color}80`
        }}
      />
    </motion.div>
  );
}
