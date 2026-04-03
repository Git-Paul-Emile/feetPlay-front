import { EventCard } from '../components/EventCard';
import { SortFilter, SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import { SearchBar } from '../components/SearchBar';
import { ReplayBanner } from '../components/ReplayBanner';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import categorySvgPaths from "../../imports/svg-ckb5lqxig6";
import svgPaths from "../../imports/svg-z30khrsoqy";

// Import event images from Figma
import imgCardImg from "figma:asset/bfa6be3c8aeb7f6fbc82814faf0255da53e42d8a.png";
import imgCardImg1 from "figma:asset/441c73cde7747c7424dd532b5b0bf39c965feea3.png";
import imgCardImg2 from "figma:asset/eeb54bfeb7f715a11c3f77fa7d5f1a847fc8360e.png";
import imgCardImg3 from "figma:asset/879e9dd2c894a941eb3593ea43d7255c4e45bef8.png";
import imgCardImg4 from "figma:asset/47894590a720b34953c1f32b52b442f91508500b.png";
import imgImage16 from "figma:asset/49fa43eb1358f314a712031188cb5e36b4e29a94.png";
import imgImage17 from "figma:asset/275df41f1998ac5cd6aedaf66f372364c7dc51c8.png";
import imgImage18 from "figma:asset/ec899bdbbbe994047f36c763e04f1455d001377c.png";
import imgImage19 from "figma:asset/75045cfe4cb9a585ca1b0274032b51485c28f5f7.png";
import imgImage20 from "figma:asset/4fbcabd8a9fe9270a8dfafbfe0191ac3d1016beb.png";

// Categories identiques à la page d'accueil
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

const upcomingEvents = [
  { id: '1', image: imgCardImg, title: 'Yaye Padura', location: 'Salle Savorgnon - IFC', date: '19h', category: 'Concert', isLive: true, price: 3000, hasStreaming: true },
  { id: '2', image: imgCardImg1, title: 'Festival Mbote - Edition 2025', location: 'Stade des Martyrs', date: '14h', category: 'Festival', isLive: true, isFree: true, hasStreaming: true },
  { id: '3', image: imgCardImg2, title: 'Concert Live Jazz', location: 'Chez Ntemba', date: '20h', category: 'Concert', isLive: true, price: 8000, hasStreaming: true },
  { id: '4', image: imgCardImg3, title: 'Spectacle Comédie', location: 'Pullman Hotel', date: '21h', category: 'Comedy', isLive: true, price: 12000, hasStreaming: true },
  { id: '5', image: imgCardImg4, title: 'Soirée Danse Afro', location: 'Fleuve Congo Hotel', date: '18h', category: 'Danse', isLive: true, isFree: true, hasStreaming: true },
];

const currentMonthEvents = [
  { image: imgCardImg, title: 'Dadju - concert Montréal', location: 'Salle Savorgnon - IFC', date: '19h 30m', category: 'Concert', isLive: false, price: 5000, hasStreaming: true },
  { image: imgCardImg1, title: 'Fally Ipupa Live', location: 'Grand Hotel Kinshasa', date: '20h 00m', category: 'Concert', isLive: false, isFree: true, hasStreaming: true },
  { image: imgCardImg2, title: 'Koffi Olomide Show', location: 'Palais du Peuple', date: '21h 00m', category: 'Concert', isLive: false, price: 15000, hasStreaming: true },
  { image: imgCardImg3, title: 'Werrason Concert', location: 'Stade des Martyrs', date: '19h 00m', category: 'Concert', isLive: false, price: 10000, hasStreaming: true },
  { image: imgCardImg4, title: 'Innoss B - Mayangui', location: 'Chez Ntemba', date: '22h 00m', category: 'Concert', isLive: false, isFree: true, hasStreaming: true },
];

const nextMonthEvents = [
  { image: imgImage16, title: 'Concert Afrobeat Paris', location: 'Paris Arena', date: '05.04.2025', category: 'Concert', isLive: false, price: 7500, hasStreaming: true },
  { image: imgImage17, title: 'Festival Amapiano Live', location: 'Lyon Zenith', date: '10.04.2025', category: 'Festival', isLive: false, isFree: true, hasStreaming: true },
  { image: imgImage18, title: 'Soirée Rumba Congolaise', location: 'Bruxelles Expo', date: '15.04.2025', category: 'Concert', isLive: false, price: 12000, hasStreaming: true },
  { image: imgImage19, title: 'Nuit du Ndombolo', location: 'Genève Arena', date: '20.04.2025', category: 'Danse', isLive: false, price: 9000, hasStreaming: true },
  { image: imgImage20, title: 'Concert Gospel Live', location: 'Lausanne Centre', date: '25.04.2025', category: 'Concert', isLive: false, isFree: true, hasStreaming: true },
];

export function Live() {
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);

  // Refs for carousel scrolling
  const upcomingRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);
  const nextMonthRef = useRef<HTMLDivElement>(null);

  // Scroll functions for carousels
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
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
              placeholder="Rechercher un événement en live..."
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

        {/* À ne pas rater - Carousel Horizontal */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
              À ne pas rater
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button 
                onClick={() => scrollCarousel(upcomingRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(upcomingRef, 'right')}
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
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={upcomingRef}>
            {sortEvents(upcomingEvents, sortOption).map((event, index) => (
              <div key={index} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
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
                onClick={() => scrollCarousel(currentMonthRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(currentMonthRef, 'right')}
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
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={currentMonthRef}>
            {sortEvents(currentMonthEvents, sortOption).map((event, index) => (
              <div key={index} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </section>

        {/* Le mois prochain - Carousel Horizontal */}
        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
              Le mois prochain
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button 
                onClick={() => scrollCarousel(nextMonthRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button 
                onClick={() => scrollCarousel(nextMonthRef, 'right')}
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
          <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={nextMonthRef}>
            {sortEvents(nextMonthEvents, sortOption).map((event, index) => (
              <div key={index} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </section>

        {/* Disponible en Replay actuellement Banner */}
        <section className="mb-10">
          <ReplayBanner />
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
    </div>
  );
}