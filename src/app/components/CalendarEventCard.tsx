import { motion } from 'motion/react';
import { Clock, MapPin, Heart, Play } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router';

export interface CalendarEventCardProps {
  id: string;
  image: string;
  title: string;
  location: string;
  time: string;
  duration: string;
  category: string;
  isLive?: boolean;
  isFree?: boolean;
  price?: number;
  onPlay?: () => void;
  onReplay?: () => void;
  fullDate?: string;
}

export function CalendarEventCard({ 
  id,
  image, 
  title, 
  location, 
  time, 
  duration,
  category,
  isLive = false,
  isFree = false,
  price,
  onPlay,
  onReplay,
  fullDate
}: CalendarEventCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  const isInFavorites = isFavorite(id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({
      id,
      image,
      title,
      location,
      time,
      duration,
      category,
      isLive,
      isFree,
      price,
      fullDate,
      date: time,
    });
  };

  const handleClick = () => {
    if (onPlay) {
      onPlay();
    } else {
      // Navigate to event detail page
      navigate(`/event/${id}`);
    }
  };

  return (
    <motion.div
      className="relative bg-[#0D0D0D] border border-white/10 rounded-[12px] overflow-hidden cursor-pointer group hover:border-[#DE0035]/50 transition-all"
      onClick={handleClick}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image Section */}
      <div className="relative h-[120px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent" />

        {/* Live Badge */}
        {isLive && (
          <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-[#DE0035] rounded-[30px] px-2.5 py-1">
            <motion.div
              className="w-2 h-2 bg-white rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <span className="font-['Work_Sans',sans-serif] font-medium text-[11px] text-white uppercase">
              LIVE
            </span>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm rounded-[6px] px-2 py-0.5">
          <span className="font-['Inter',sans-serif] font-medium text-[10px] text-white/90">
            {category}
          </span>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
          <motion.div
            className="w-12 h-12 bg-[#DE0035] rounded-full flex items-center justify-center"
            whileHover={{ scale: 1.1 }}
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-3">
        {/* Title */}
        <h3 className="font-['Mulish',sans-serif] font-bold text-white text-[14px] leading-[18px] mb-2 line-clamp-2 min-h-[36px]">
          {title}
        </h3>

        {/* Time */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <Clock className="w-3.5 h-3.5 text-[#CDFF71]" />
          <span className="font-['DM_Sans',sans-serif] font-normal text-[#f2f2f2] text-[11px]">
            {time} • {duration}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1.5 mb-3">
          <MapPin className="w-3.5 h-3.5 text-white/70" />
          <span className="font-['DM_Sans',sans-serif] font-normal text-white/70 text-[11px] truncate">
            {location}
          </span>
        </div>

        {/* Footer - Price & Reminder */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          {/* Price */}
          <div>
            {isFree ? (
              <span className="font-['Inter',sans-serif] font-bold text-[#CDFF71] text-[13px]">
                GRATUIT
              </span>
            ) : (
              <span className="font-['Inter',sans-serif] font-semibold text-white text-[13px]">
                {price?.toLocaleString()} FCFA
              </span>
            )}
          </div>

          {/* Reminder Button */}
          <motion.button
            onClick={handleToggleFavorite}
            className={`p-1.5 rounded-full transition-colors ${
              isInFavorites 
                ? 'bg-[#CDFF71] text-[#000441]' 
                : 'bg-white/10 text-white/60 hover:bg-white/20'
            }`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isInFavorites ? (
              <Heart className="w-4 h-4" fill="currentColor" />
            ) : (
              <Heart className="w-4 h-4" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Hover Glow */}
      <div 
        className="absolute inset-0 rounded-[12px] border-2 border-[#DE0035] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{ boxShadow: '0 0 20px rgba(222, 0, 53, 0.3)' }}
      />
    </motion.div>
  );
}