import { ReplayCard } from '../components/ReplayCard';
import { ReplayPlayerModal } from '../components/ReplayPlayerModal';
import { SortFilter, SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import { SearchBar } from '../components/SearchBar';
import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import categorySvgPaths from "../../imports/svg-ckb5lqxig6";
import svgPaths from "../../imports/svg-z30khrsoqy";

// Import replay event images from Figma
import imgRectangle11251 from "figma:asset/0b78113e2fc57a1700c7a0cbfc24e9e1a03abf95.png";
import imgRectangle11252 from "figma:asset/72a3d9e3821c7ba6e8f40dc9be574e9f24b25fe0.png";
import imgRectangle11253 from "figma:asset/0bdd20e3e0a5e16ef1bbfdf1cdb0db3ee4a7decd.png";
import imgImage24 from "figma:asset/b7764b71e5f0ef42cb32c74e2fd1e93cd69c7cef.png";
import imgImage25 from "figma:asset/29ab1dde6e04a60ebbb47b1aabf78ba1f8809b49.png";
import imgCardImg from "figma:asset/bfa6be3c8aeb7f6fbc82814faf0255da53e42d8a.png";
import imgCardImg1 from "figma:asset/441c73cde7747c7424dd532b5b0bf39c965feea3.png";
import imgCardImg2 from "figma:asset/eeb54bfeb7f715a11c3f77fa7d5f1a847fc8360e.png";
import imgCardImg3 from "figma:asset/879e9dd2c894a941eb3593ea43d7255c4e45bef8.png";
import imgCardImg4 from "figma:asset/47894590a720b34953c1f32b52b442f91508500b.png";
import imgImage16 from "figma:asset/49fa43eb1358f314a712031188cb5e36b4e29a94.png";
import imgImage17 from "figma:asset/275df41f1998ac5cd6aedaf66f372364c7dc51c8.png";

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

// Replay events data - Les plus récents
const recentReplays = [
  { image: imgRectangle11251, title: 'Concert Dadju Brazzaville', location: 'Salle Savorgnon -IFC', date: 'SAM 20.12.2025', duration: '2h30', category: 'Concert' },
  { image: imgRectangle11252, title: 'Festival Afro Jembe Jaiye', location: 'Palais des Sports', date: 'VEN 15.11.2025', duration: '4h00', category: 'Festival' },
  { image: imgRectangle11253, title: 'Soirée Jazz Live', location: 'Centre Culturel Français', date: 'DIM 08.12.2025', duration: '3h15', category: 'Concert' },
  { image: imgImage24, title: 'Concert Fally Ipupa', location: 'Stade des Martyrs', date: 'SAM 14.12.2025', duration: '3h00', category: 'Concert' },
  { image: imgImage25, title: 'Nuit du Ndombolo', location: 'Fleuve Congo Hotel', date: 'VEN 22.11.2025', duration: '5h00', category: 'Spectacle' },
];

// Ce mois - Replays
const thisMonthReplays = [
  { image: imgCardImg, title: 'Dadju - concert Montréal', location: 'Salle Savorgnon - IFC', date: 'SAM 07.12.2025', duration: '2h45', category: 'Concert' },
  { image: imgCardImg1, title: 'Festival Mbote - Edition 2024', location: 'Stade des Martyrs', date: 'DIM 01.12.2025', duration: '6h00', category: 'Festival' },
  { image: imgCardImg2, title: 'Concert Live Jazz Premium', location: 'Chez Ntemba', date: 'VEN 13.12.2025', duration: '3h30', category: 'Jazz' },
  { image: imgCardImg3, title: 'Spectacle Comédie Africaine', location: 'Pullman Hotel', date: 'MER 11.12.2025', duration: '2h00', category: 'Comédie' },
  { image: imgCardImg4, title: 'Soirée Danse Afro Moderne', location: 'Fleuve Congo Hotel', date: 'JEU 05.12.2025', duration: '4h30', category: 'Danse' },
  { image: imgImage16, title: 'Concert Gospel Night', location: 'Cathédrale de Kinshasa', date: 'DIM 08.12.2025', duration: '2h30', category: 'Gospel' },
];

// Le mois dernier - Replays
const lastMonthReplays = [
  { image: imgImage17, title: 'Festival Amapiano Live 2024', location: 'Palais du Peuple', date: 'SAM 23.11.2025', duration: '5h00', category: 'Festival' },
  { image: imgRectangle11251, title: 'Soirée Rumba Congolaise', location: 'Grand Hotel Kinshasa', date: 'VEN 15.11.2025', duration: '3h00', category: 'Rumba' },
  { image: imgRectangle11252, title: 'Nuit du Ndombolo Premium', location: 'Marina Club', date: 'SAM 30.11.2025', duration: '4h00', category: 'Ndombolo' },
  { image: imgRectangle11253, title: 'Concert Afrobeat Paris Live', location: 'Institut Français', date: 'DIM 17.11.2025', duration: '3h15', category: 'Afrobeat' },
  { image: imgCardImg, title: 'Festival Urbain Brazza', location: 'Berges du Fleuve', date: 'SAM 09.11.2025', duration: '6h30', category: 'Festival' },
  { image: imgCardImg1, title: 'Soirée Jazz & Soul', location: 'Chez Ntemba', date: 'VEN 22.11.2025', duration: '3h45', category: 'Jazz' },
];

// Meilleurs replays du moment
const topReplays = [
  { image: imgImage24, title: 'Concert Fally Ipupa Live', location: 'Stade des Martyrs', date: 'SAM 02.11.2025', duration: '3h30', category: 'Concert' },
  { image: imgImage25, title: 'Werrason Show Exceptionnel', location: 'Palais du Peuple', date: 'DIM 10.11.2025', duration: '4h00', category: 'Spectacle' },
  { image: imgCardImg2, title: 'Innoss B - Mayangui Tour', location: 'Grand Hotel', date: 'VEN 01.11.2025', duration: '2h30', category: 'Concert' },
  { image: imgCardImg3, title: 'Koffi Olomide Méga Concert', location: 'Stade des Martyrs', date: 'SAM 16.11.2025', duration: '3h00', category: 'Concert' },
  { image: imgCardImg4, title: 'Festival Hip Hop Kinshasa', location: 'Parc de la Vallée', date: 'DIM 24.11.2025', duration: '5h30', category: 'Hip Hop' },
];

export function Replay() {
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedReplay, setSelectedReplay] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

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