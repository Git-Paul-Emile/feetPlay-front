import { Star, ArrowRight, Users } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';

interface CreatorCardProps {
  id: string;
  name: string;
  category: string;
  followers: number;
  rating: number;
  image: string;
}

export function CreatorCard({ id, name, category, followers, rating, image }: CreatorCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-gradient-to-b from-[#2a2a2a] to-[#1a1a1a] rounded-2xl overflow-hidden border border-white/10 hover:border-[#CDFF71]/50 transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20">
          <span className="font-['Inter',sans-serif] text-white text-xs font-medium">
            {category}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-4 right-4 px-2.5 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-[#CDFF71] fill-[#CDFF71]" />
          <span className="font-['Inter',sans-serif] text-white text-xs font-semibold">
            {rating.toFixed(1)}
          </span>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-['Inter',sans-serif] text-white text-xl font-bold mb-1">
            {name}
          </h3>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#CDFF71]" />
            <p className="font-['Inter',sans-serif] text-white/70 text-sm">
              {followers.toLocaleString()} abonnés
            </p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <Link to={`/creator/${id}`}>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="absolute bottom-5 right-5 w-10 h-10 bg-[#CDFF71] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(205,255,113,0.6)] transition-all duration-300"
        >
          <ArrowRight className="w-5 h-5 text-black" strokeWidth={2.5} />
        </motion.button>
      </Link>
    </motion.div>
  );
}
