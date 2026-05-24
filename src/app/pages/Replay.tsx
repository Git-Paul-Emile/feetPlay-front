import { ReplayCard } from '../components/ReplayCard';
import { ReplayPlayerModal } from '../components/ReplayPlayerModal';
import { SortFilter, SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import { SearchBar } from '../components/SearchBar';
import { useState, useRef, useEffect } from 'react';
import EventsAPI from '../services/api/EventsAPI';
import { motion } from 'motion/react';
import categorySvgPaths from "../../imports/svg-ckb5lqxig6";
import svgPaths from "../../imports/svg-z30khrsoqy";


// Categories identiques à la page Live
const categories = [
  { 
    name: 'Cinema', 
    active: true,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p1adf5980} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p2db0380} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p3e760100} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Concert', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d="M3 8.25V15.75" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M7.5 5.75V18.25" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M12 3.25V20.75" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M16.5 5.75V18.25" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M21 8.25V15.75" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    )
  },
  { 
    name: 'Art', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p137f9d00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p36526000} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p1e724200} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Music', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p8d41200} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M11.97 18V4" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p17cba0f0} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Sport', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.pe124f80} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p32c1af80} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p7b2c300} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M15 11H9" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Brunches', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p75c9200} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M12 5.49V20.49" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M7.75 8.49H5.5" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M8.5 11.49H5.5" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Business', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p5c67700} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.pd4ca500} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p32c69a00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Technology', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p4025b00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p2a720700} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M8.01 4V2" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Fashion', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p32bdf280} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M6.5 22H17.5" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M9.5 14H14.5" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Outdoor', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p3052a800} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p7564c00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M12 22V18" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  { 
    name: 'Education', 
    active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p75c9200} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M12 5.49V20.49" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
];


type ReplayCardData = { image: string; title: string; location: string; date: string; duration: string; category: string };

export function Replay() {
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedReplay, setSelectedReplay] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const [recentReplays, setRecentReplays] = useState<ReplayCardData[]>([]);
  const [thisMonthReplays, setThisMonthReplays] = useState<ReplayCardData[]>([]);
  const [lastMonthReplays, setLastMonthReplays] = useState<ReplayCardData[]>([]);
  const [topReplays, setTopReplays] = useState<ReplayCardData[]>([]);

  useEffect(() => {
    EventsAPI.getReplays().then(events => {
      const mapped = events.map(e => ({
        image: e.image,
        title: e.title,
        location: e.location ?? '',
        date: e.date,
        duration: e.duration,
        category: e.category,
      }));
      setRecentReplays(mapped.slice(0, 5));
      setThisMonthReplays(mapped.slice(5, 11));
      setLastMonthReplays(mapped.slice(11, 17));
      setTopReplays(mapped.slice(0, 5));
    }).catch(() => {});
  }, []);

  // Refs for carousel scrolling
  const recentRef = useRef<HTMLDivElement>(null);
  const thisMonthRef = useRef<HTMLDivElement>(null);
  const lastMonthRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Scroll functions for carousels
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleReplayClick = (replay: any) => {
    setSelectedReplay(replay);
    setIsPlayerOpen(true);
  };
  
  return (
    <div className="relative bg-[#080808] min-h-screen pt-20">
      {/* Search Bar et Catégories - Juste après la navbar */}
      <div className="sticky top-16 md:top-20 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="mb-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Rechercher un replay..."
            />
          </div>

          {/* Category Buttons - Same as Home */}
          <div className="flex gap-2 md:gap-2.5 lg:gap-3 items-start overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
            {categories.map((cat, index) => (
              <motion.button
                key={index}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 rounded-[100px] shrink-0 transition-all ${
                  index === activeCategory
                    ? 'bg-[#cdff71]'
                    : 'bg-white border border-[#dfe1e4] border-[0.3px]'
                }`}
                onClick={() => setActiveCategory(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0">
                  {cat.icon}
                </div>
                <span className="font-['Urbanist',sans-serif] font-semibold text-[#000441] text-[13px] md:text-[14px] lg:text-[15px] whitespace-nowrap">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sort Filter */}
        <div className="mb-6 flex justify-end">
          <SortFilter
            currentSort={sortOption}
            onSortChange={setSortOption}
          />
        </div>

        {/* Les plus récents - Carousel Horizontal */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
              Les plus récents
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button 
                onClick={() => scrollCarousel(recentRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(recentRef, 'right')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Suivant"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={recentRef}>
            {recentReplays.map((event, index) => (
              <div key={index} className="flex-shrink-0">
                <ReplayCard {...event} onClick={() => handleReplayClick(event)} />
              </div>
            ))}
          </div>
        </section>

        {/* Ce mois - Carousel Horizontal */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
              Ce mois
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button 
                onClick={() => scrollCarousel(thisMonthRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(thisMonthRef, 'right')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Suivant"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={thisMonthRef}>
            {thisMonthReplays.map((event, index) => (
              <div key={index} className="flex-shrink-0">
                <ReplayCard {...event} onClick={() => handleReplayClick(event)} />
              </div>
            ))}
          </div>
        </section>

        {/* Le mois dernier - Carousel Horizontal */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
              Le mois dernier
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button 
                onClick={() => scrollCarousel(lastMonthRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(lastMonthRef, 'right')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Suivant"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={lastMonthRef}>
            {lastMonthReplays.map((event, index) => (
              <div key={index} className="flex-shrink-0">
                <ReplayCard {...event} onClick={() => handleReplayClick(event)} />
              </div>
            ))}
          </div>
        </section>

        {/* Meilleurs replays du moment - Carousel Horizontal */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
              Meilleurs replays du moment
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button 
                onClick={() => scrollCarousel(topRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(topRef, 'right')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Suivant"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={topRef}>
            {topReplays.map((event, index) => (
              <div key={index} className="flex-shrink-0">
                <ReplayCard {...event} onClick={() => handleReplayClick(event)} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Replay Player Modal */}
      <ReplayPlayerModal
        isOpen={isPlayerOpen}
        replay={selectedReplay}
        onClose={() => setIsPlayerOpen(false)}
      />
    </div>
  );
}