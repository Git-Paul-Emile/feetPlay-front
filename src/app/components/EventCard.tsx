import { motion } from 'motion/react';
import { Heart, Video } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useNavigate } from 'react-router';
import listSvgPaths from "../../imports/svg-z1dvbaxtvj";

export interface EventCardProps {
  id?: string;
  image: string;
  title: string;
  location: string;
  date: string;
  category?: string;
  isLive?: boolean;
  isFree?: boolean;
  hasStreaming?: boolean;
  price?: number; // Prix en FCFA
  onClick?: () => void;
}

export function EventCard({ 
  id,
  image, 
  title, 
  location, 
  date, 
  category, 
  isLive, 
  isFree = true,
  hasStreaming = true,
  price,
  onClick 
}: EventCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const navigate = useNavigate();
  
  // Generate an ID if not provided
  const eventId = id || `event-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const isInFavorites = isFavorite(eventId);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite({
      id: eventId,
      image,
      title,
      location,
      date,
      category: category || 'Événement',
      isLive,
      isFree,
      price,
      hasStreaming,
    });
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (id) {
      // Navigate to event detail page
      navigate(`/event/${id}`);
    }
  };

  return (
    <motion.div
      className="relative group cursor-pointer rounded-[17px] overflow-hidden w-full aspect-[309/456]"
      whileHover={{ scale: 1.03 }}
      onClick={handleClick}
    >
      {/* Image Container - Réduit de 180px au total */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-[270px] rounded-[17px] overflow-hidden">
          <img
            src={image}
            alt={title}
            className="absolute w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[15.778%] from-[rgba(29,29,29,0)] to-[rgba(29,29,29,0.78)] rounded-[5px]" />
        </div>

        {/* Favorite Button */}
        <button
          onClick={handleToggleFavorite}
          className="absolute top-[14px] right-[14px] z-10"
        >
          <div className="backdrop-blur-[5px] w-[32px] h-[32px] rounded-[28px] flex items-center justify-center transition-all hover:scale-110"
            style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
          >
            <Heart 
              className={`w-3.5 h-3.5 transition-colors ${isInFavorites ? 'fill-[#de0035] text-[#de0035]' : 'text-[#F5F6F8]'}`}
            />
          </div>
        </button>

        {/* Top Left Badge - LIVE only */}
        {isLive && (
          <div className="absolute top-[14px] left-[14px] z-10">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-1 bg-[#CC3333] px-2.5 py-1 rounded-md shadow-lg"
            >
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              <span className="font-['Inter',sans-serif] font-semibold text-white text-[10px] uppercase tracking-wide">
                LIVE
              </span>
            </motion.div>
          </div>
        )}

        {/* Event Info - Position ajustée pour -180px */}
        <div className="absolute top-[294px] left-0 right-0 px-0 flex flex-col gap-[8px]">
          {/* Title - Taille optimisée pour compacité */}
          <div className="w-full px-0">
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-[#fcc434] text-[18px] leading-[1.1] line-clamp-2">
              {title}
            </h3>
          </div>

          {/* Badges Under Title */}
          <div className="flex flex-col gap-0.5">
            {/* Video Streaming Text */}
            {hasStreaming && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1"
              >
                <Video className="w-2.5 h-2.5 text-[#CDFF71]" strokeWidth={2.5} />
                <span className="font-['DM_Sans',sans-serif] font-medium text-[#CDFF71] text-[10px] leading-tight">
                  Video en live streaming
                </span>
              </motion.div>
            )}
            
            {/* Free Text */}
            {isFree && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-1"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#DE0035] to-[#FF1744] flex items-center justify-center">
                  <span className="text-white text-[7px] font-bold">✓</span>
                </div>
                <span className="font-['DM_Sans',sans-serif] font-bold text-white text-[10px] leading-tight">
                  100% Gratuit
                </span>
              </motion.div>
            )}
            
            {/* Price Text */}
            {price && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-1"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#DE0035] to-[#FF1744] flex items-center justify-center">
                  <span className="text-white text-[7px] font-bold">✓</span>
                </div>
                <span className="font-['DM_Sans',sans-serif] font-bold text-white text-[10px] leading-tight">
                  {price} FCFA
                </span>
              </motion.div>
            )}
          </div>

          {/* Location - Optimisé pour visibilité maximale */}
          <div className="flex items-center gap-[8px]">
            <div className="w-[10px] h-[14px] flex-shrink-0">
              <svg className="w-full h-full" fill="none" viewBox="0 0 17.2 21.2">
                <g>
                  <path d={listSvgPaths.p172cbb80} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d={listSvgPaths.pbf70600} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                </g>
              </svg>
            </div>
            <p className="font-['DM_Sans',sans-serif] font-medium text-white text-[11px] leading-[14px] line-clamp-1">
              {location}
            </p>
          </div>

          {/* Date - Optimisé pour visibilité maximale */}
          <div className="flex items-center gap-[8px]">
            <div className="w-[14px] h-[14px] flex-shrink-0">
              <svg className="w-full h-full" fill="none" viewBox="0 0 20 20">
                <g>
                  <path d="M6.66667 1.66667V4.16667" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.2" />
                  <path d="M13.3333 1.66667V4.16667" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.2" />
                  <path d="M2.91667 7.575H17.0833" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.2" />
                  <path d={listSvgPaths.p118ff00} stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.2" />
                  <path d="M13.0789 11.4167H13.0864" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M13.0789 13.9167H13.0864" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M9.99624 11.4167H10.0037" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M9.99624 13.9167H10.0037" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M6.91193 11.4167H6.91941" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                  <path d="M6.91193 13.9167H6.91941" stroke="#F2F2F2" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" />
                </g>
              </svg>
            </div>
            <p className="font-['DM_Sans',sans-serif] font-normal text-[#f2f2f2] text-[11px] leading-[12px]">
              {date}
            </p>
          </div>

          {/* En savoir + Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/event/${eventId}`);
            }}
            className="mt-3 w-full bg-[#de0035] hover:bg-[#de0035]/90 flex items-center justify-center gap-2 px-4 py-2.5 rounded-sm transition-all group"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-['Inter',sans-serif] font-semibold text-white text-[12px] uppercase tracking-wide">
              En savoir +
            </span>
            <svg className="w-3 h-3 text-white transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}