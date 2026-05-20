import { useRef } from "react";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CreatorCard } from "./CreatorCard";
import type { Creator } from "../../services/api/CreatorAPI";

interface CreatorCarouselProps {
  title: string;
  creators: Creator[];
  loading?: boolean;
}

export function CreatorCarousel({ title, creators, loading = false }: CreatorCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  }

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-4">
        <motion.h2
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-xl font-bold text-white"
        >
          {title}
        </motion.h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#DE0035] flex items-center justify-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#DE0035] flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="flex-none animate-pulse bg-white/5"
              style={{ width: 153, height: 153, borderRadius: 25 }}
            />
          ))}
        </div>
      ) : creators.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucun créateur disponible pour le moment.</p>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
          style={{ scrollbarWidth: "none" }}
        >
          {creators.map((creator, i) => (
            <div key={creator.id} className="flex-none">
              <CreatorCard creator={creator} index={i} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
