import { motion } from "motion/react";
import { Users, Video, BadgeCheck } from "lucide-react";
import { Link } from "react-router";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import type { Creator } from "../../services/api/CreatorAPI";

interface CreatorCardProps {
  creator: Creator;
  index?: number;
}

export function CreatorCard({ creator, index = 0 }: CreatorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group"
    >
      <Link to={`/creators/${creator.channelSlug}`} className="block">
        <div
          className="relative overflow-hidden bg-[#111] border border-white/10 hover:border-[#DE0035]/50 transition-all duration-300 cursor-pointer"
          style={{ borderRadius: 25, width: 153, height: 153 }}
        >
          {/* Cover / avatar */}
          <div className="absolute inset-0">
            <ImageWithFallback
              src={creator.coverImage || creator.avatar || ""}
              alt={creator.channelName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>

          {/* Avatar overlay */}
          <div className="absolute top-3 left-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#DE0035]">
              <ImageWithFallback
                src={creator.avatar || ""}
                alt={creator.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Verified badge */}
          {creator.isVerified && (
            <div className="absolute top-3 right-3">
              <BadgeCheck className="w-4 h-4 text-[#CDFF71]" />
            </div>
          )}

          {/* Info at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <p
              className="text-white font-semibold text-xs truncate"
              style={{ fontFamily: "Quicksand, sans-serif" }}
            >
              {creator.channelName}
            </p>
            <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {creator.subscriberCount.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                {creator.videoCount}
              </span>
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs text-[#CDFF71] text-center uppercase tracking-wide truncate w-[153px]">
          {creator.category}
        </p>
      </Link>
    </motion.div>
  );
}
