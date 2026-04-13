import { ReplayBanner } from '../components/ReplayBanner';
import { EventCard, EventCardProps } from '../components/EventCard';
import { SortFilter, SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import { ReplayCard, ReplayCardProps } from '../components/ReplayCard';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router';
import EventsAPI, { StreamingEvent } from '../services/api/EventsAPI';

// Import SVG paths
import svgPaths from "../../imports/svg-on6vk22quy";
import categorySvgPaths from "../../imports/svg-s9aj5k89tw";

// ── Types locaux ─────────────────────────────────────────────────────────────

interface HeroSlide {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string;
  description: string;
  price?: number;
  isFree: boolean;
  streamUrl?: string;
}

interface UpcomingEvent {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string; // format "NOV 20"
  isFree: boolean;
  price?: number;
}

// ── Helpers de formatage de dates ─────────────────────────────────────────────

const FR_DAYS = ['DIM', 'LUN', 'MAR', 'MER', 'JEU', 'VEN', 'SAM'];
const FR_MONTHS = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatHeroDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dayName = FR_DAYS[d.getDay()];
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${dayName}.${day} - ${month} - ${d.getFullYear()}`;
}

function formatCardDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return `${FR_MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function formatReplayDate(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const dayName = FR_DAYS[d.getDay()];
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${dayName} ${day}.${month}.${d.getFullYear()}`;
}

// ── Mappers StreamingEvent → types locaux ─────────────────────────────────────

function mapToHeroSlide(e: StreamingEvent): HeroSlide {
  return {
    id: e.id,
    image: e.image,
    title: e.title,
    location: e.channelName,
    date: formatHeroDate(e.date),
    description: e.description,
    price: e.isFree ? undefined : e.price,
    isFree: e.isFree,
    streamUrl: e.streamUrl,
  };
}

function mapToUpcoming(e: StreamingEvent): UpcomingEvent {
  return {
    id: e.id,
    image: e.image,
    title: e.title,
    location: e.channelName,
    date: formatCardDate(e.date),
    isFree: e.isFree,
    price: e.isFree ? undefined : e.price,
  };
}

function mapToEventCard(e: StreamingEvent): EventCardProps {
  return {
    id: e.id,
    image: e.image,
    title: e.title,
    location: e.channelName,
    date: e.time,
    category: e.category,
    isLive: e.isLive,
    isFree: e.isFree,
    hasStreaming: true,
    price: e.isFree ? undefined : e.price,
  };
}

function mapToReplayCard(e: StreamingEvent): ReplayCardProps {
  return {
    image: e.image,
    title: e.title,
    location: e.channelName,
    date: formatReplayDate(e.date),
    duration: e.duration,
    category: e.category,
  };
}

// ── Catégories (UI statique) ──────────────────────────────────────────────────

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

// ── Composant principal ───────────────────────────────────────────────────────

export function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeCategory, setActiveCategory] = useState(0);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  // Données depuis l'API
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [liveStreamingEvents, setLiveStreamingEvents] = useState<EventCardProps[]>([]);
  const [freeEvents, setFreeEvents] = useState<EventCardProps[]>([]);
  const [replayEvents, setReplayEvents] = useState<ReplayCardProps[]>([]);

  // Refs for carousel scrolling
  const upcomingRef = useRef<HTMLDivElement>(null);
  const liveStreamRef = useRef<HTMLDivElement>(null);
  const freeEventsRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLDivElement>(null);

  // Chargement des données depuis l'API
  useEffect(() => {
    (async () => {
      try {
        const [all, liveData, replays] = await Promise.all([
          EventsAPI.getAll(),
          EventsAPI.getLive(),
          EventsAPI.getReplays(),
        ]);

        const featured = all.filter(e => e.isFeatured);
        const heroSource = (featured.length > 0 ? featured : all).slice(0, 4);
        setHeroSlides(heroSource.map(mapToHeroSlide));
        setUpcomingEvents(all.filter(e => !e.isLive && !e.isReplay).map(mapToUpcoming));
        setLiveStreamingEvents(liveData.map(mapToEventCard));
        setFreeEvents(all.filter(e => e.isFree).map(mapToEventCard));
        setReplayEvents(replays.map(mapToReplayCard));
      } catch (err) {
        console.error('Erreur chargement events:', err);
      }
    })();
  }, []);

  // Auto-play slider (redémarre quand heroSlides change)
  useEffect(() => {
    if (heroSlides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Scroll functions for carousels
  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const navigate = useNavigate();
  const currentHero = heroSlides[currentSlide];

  return (
    <div className="relative bg-[#080808] min-h-screen">
      {/* Hero Section - Active Slider */}
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] lg:h-[800px] xl:h-[930px] w-full overflow-hidden">
        {/* Slider Images */}
        {currentHero && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
            >
              <img
                src={currentHero.image}
                alt={currentHero.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808] from-[29.365%] via-[rgba(8,8,8,0.51)] via-[58.6%] to-[rgba(8,8,8,0)] to-[82.52%] mix-blend-multiply opacity-50" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,8,0.69)] from-[29.365%] via-[rgba(8,8,8,0.35)] via-[58.6%] to-[rgba(8,8,8,0)] to-[82.52%] mix-blend-multiply opacity-84" />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Hero Content */}
        {currentHero && (
          <div className="relative h-full flex items-end pb-16 sm:pb-20 md:pb-24 lg:pb-32">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-[75px] w-full">
              <div className="max-w-[1287px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -30 }}
                    transition={{ duration: 0.5 }}
                  >
                    {/* Title */}
                    <h1 className="font-['Montserrat',sans-serif] font-semibold text-white text-[36px] sm:text-[44px] md:text-[52px] lg:text-[64px] xl:text-[76px] leading-[1.1] mb-3 md:mb-4 lg:mb-6">
                      {currentHero.title}
                    </h1>

                    {/* Location and Date */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 md:gap-3 lg:gap-[14px] mb-3 md:mb-4 lg:mb-6">
                      {/* Location */}
                      <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">
                        <div className="h-5 w-4 md:h-6 md:w-5 lg:h-7 lg:w-6 flex-shrink-0">
                          <svg className="w-full h-full" fill="none" viewBox="0 0 30 40">
                            <g>
                              <path d={svgPaths.p185cb180} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                              <path d={svgPaths.p188be600} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                            </g>
                          </svg>
                        </div>
                        <p className="font-['DM_Sans',sans-serif] font-normal text-[#dfe1e4] text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] xl:text-[24px] leading-normal">
                          {currentHero.location}
                        </p>
                      </div>

                      <div className="hidden sm:block bg-[rgba(255,255,255,0.6)] h-7 md:h-8 lg:h-9 w-[2px]" />

                      {/* Calendar and Date */}
                      <div className="flex items-center gap-2 md:gap-2.5 lg:gap-3">
                        <div className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 flex-shrink-0">
                          <svg className="w-full h-full" fill="none" viewBox="0 0 31 34">
                            <path d={svgPaths.p23bf7380} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                          </svg>
                        </div>
                        <p className="font-['DM_Sans',sans-serif] font-normal text-[#dfe1e4] text-[15px] sm:text-[17px] md:text-[19px] lg:text-[21px] xl:text-[24px] leading-normal">
                          {currentHero.date}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-5 md:mb-6 lg:mb-8 max-w-[1100px]">
                      <p className="font-['Montserrat',sans-serif] font-normal text-white text-[13px] sm:text-[15px] md:text-[17px] lg:text-[19px] xl:text-[22px] leading-[1.5] line-clamp-2">
                        {currentHero.description}
                      </p>
                    </div>

                    {/* Price Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="mb-5 md:mb-6 lg:mb-7"
                    >
                      {currentHero.isFree ? (
                        <div className="inline-flex items-center gap-2 md:gap-2.5 bg-gradient-to-r from-[#DE0035] to-[#FF1744] px-4 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-full">
                          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white flex items-center justify-center">
                            <span className="text-[#DE0035] text-xs md:text-sm lg:text-base font-bold"></span>
                          </div>
                          <span className="font-['DM_Sans',sans-serif] font-bold text-white text-sm md:text-base lg:text-lg xl:text-xl">
                            100% Gratuit
                          </span>
                        </div>
                      ) : currentHero.price ? (
                        <div className="inline-flex items-center gap-2 md:gap-2.5 bg-gradient-to-r from-[#DE0035] to-[#FF1744] px-4 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 rounded-full">
                          <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-white flex items-center justify-center">
                            <span className="text-[#DE0035] text-xs md:text-sm lg:text-base font-bold">₣</span>
                          </div>
                          <span className="font-['DM_Sans',sans-serif] font-bold text-white text-sm md:text-base lg:text-lg xl:text-xl">
                            {currentHero.price.toLocaleString()} FCFA
                          </span>
                        </div>
                      ) : null}
                    </motion.div>

                    {/* CTA Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 md:gap-3 lg:gap-4">
                      {/* En savoir + Button */}
                      <motion.button
                        onClick={() => navigate(`/event/${currentHero.id}`)}
                        className="bg-[#de0035] flex items-center justify-center gap-2 md:gap-2.5 lg:gap-3 h-[48px] md:h-[52px] lg:h-[56px] px-5 md:px-6 lg:px-8 rounded-none hover:bg-[#c5002f] transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span className="font-['SF_Pro',sans-serif] font-normal text-white text-[16px] md:text-[18px] lg:text-[20px] leading-[1.4]">
                          En savoir +
                        </span>
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        )}

        {/* Slider Indicators - Enhanced */}
        {heroSlides.length > 0 && (
          <div className="absolute bottom-6 md:bottom-7 lg:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-3 md:gap-4 lg:gap-5 z-10">
            {heroSlides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`transition-all duration-300 rounded-[30px] ${
                  index === currentSlide
                    ? 'bg-[#cdff71] w-[20px] md:w-[24px] lg:w-[28px] h-[10px] md:h-[12px] lg:h-[14px]'
                    : 'bg-white opacity-60 hover:opacity-80 w-[10px] md:w-[12px] lg:w-[14px] h-[10px] md:h-[12px] lg:h-[14px] rounded-full'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Main Content */}
      <div className="relative">
        {/* Category Filter */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-8 lg:pt-12 pb-3 md:pb-4 lg:pb-6">
          <div className="flex gap-2 md:gap-2.5 lg:gap-3 items-start overflow-x-auto pb-2 scrollbar-hide scroll-smooth" ref={categoryRef}>
            {categories.map((cat, index) => (
              <motion.button
                key={index}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 rounded-[100px] shrink-0 transition-all ${
                  index === activeCategory
                    ? 'bg-[#cdff71]'
                    : 'bg-white border-[0.3px] border-[#dfe1e4]'
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

        {/* A ne pas rater Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl lg:text-3xl xl:text-[36px] leading-tight">
              A ne pas rater
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

          {/* Event Cards Carousel */}
          <div className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={upcomingRef}>
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                onClick={() => navigate(`/event/${event.id}`)}
                className="relative flex-shrink-0 w-[280px] sm:w-[320px] md:w-[380px] lg:w-[440px] xl:w-[477px] h-[320px] sm:h-[360px] md:h-[400px] lg:h-[450px] group cursor-pointer rounded-lg overflow-hidden"
                whileHover={{ scale: 1.03 }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="absolute w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black from-[6.808%] to-[rgba(0,0,0,0)] to-[74.883%]" />

                  {/* Date Badge */}
                  <div className="absolute left-4 md:left-6 lg:left-12 top-16 md:top-20 lg:top-28 flex flex-col items-center gap-1">
                    <p className="font-['DM_Sans',sans-serif] font-bold text-[#de0035] text-base md:text-lg lg:text-[22px] text-center">
                      {event.date.split(' ')[0]}
                    </p>
                    <p className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl lg:text-[48px]">
                      {event.date.split(' ')[1]}
                    </p>
                  </div>

                  {/* Price Badge */}
                  <div className="absolute right-4 md:right-6 top-16 md:top-20 lg:top-28">
                    {event.isFree ? (
                      <div className="bg-gradient-to-r from-[#DE0035] to-[#FF1744] px-3 md:px-4 py-2 rounded-full">
                        <span className="font-['DM_Sans',sans-serif] font-bold text-white text-xs md:text-sm">
                          GRATUIT
                        </span>
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-[#DE0035] to-[#FF1744] px-3 md:px-4 py-2 rounded-full">
                        <span className="font-['DM_Sans',sans-serif] font-bold text-white text-xs md:text-sm">
                          {event.price?.toLocaleString()} FCFA
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Event Info */}
                  <div className="absolute left-4 md:left-6 lg:left-12 bottom-6 md:bottom-8 lg:bottom-11 right-4">
                    <h3 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl md:text-2xl lg:text-3xl xl:text-[43px] leading-tight mb-2">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="w-3 h-4 md:w-[13px] md:h-[18px] flex-shrink-0">
                        <svg className="w-full h-full" fill="none" viewBox="0 0 15 20">
                          <g>
                            <path d={svgPaths.p2d9fe400} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                            <path d={svgPaths.p307f9a00} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                          </g>
                        </svg>
                      </div>
                      <p className="font-['DM_Sans',sans-serif] font-normal text-[#dfe1e4] text-sm md:text-base lg:text-lg truncate">
                        {event.location}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Video en live streaming Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl lg:text-3xl xl:text-[36px] leading-tight">
              Video en live streaming
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => scrollCarousel(liveStreamRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all"
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(liveStreamRef, 'right')}
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

          {/* Live Event Cards with EventCard component */}
          <div className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={liveStreamRef}>
            {liveStreamingEvents.map((event, index) => (
              <div key={index} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </section>

        {/* Disponible en Replay actuellement Banner */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <ReplayBanner />
        </section>

        {/* 100% Gratuit Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl lg:text-3xl xl:text-[36px] leading-tight">
              100% Gratuit
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => scrollCarousel(freeEventsRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all"
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(freeEventsRef, 'right')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-110 hover:bg-white/10 active:scale-95 transition-all"
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
                aria-label="Suivant"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex gap-3 md:gap-4 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={freeEventsRef}>
            {freeEvents.map((event, index) => (
              <div key={index} className="flex-shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </section>

        {/* Disponible en Replay actuellement Banner 2 */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <ReplayBanner />
        </section>

        {/* Replay Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 pb-16 md:pb-24">
          <div className="flex items-center justify-between mb-6 md:mb-12">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl lg:text-3xl xl:text-[36px] leading-tight">
              Replay
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => scrollCarousel(replayRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all"
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Précédent"
              >
                <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
              <button
                onClick={() => scrollCarousel(replayRef, 'right')}
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

          {/* Replay Cards Carousel */}
          <div className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth" ref={replayRef}>
            {replayEvents.map((event, index) => (
              <div key={index} className="flex-shrink-0">
                <ReplayCard {...event} />
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Video Modal Popup */}
      <AnimatePresence>
        {videoModalOpen && currentHero && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-md z-50"
              onClick={() => setVideoModalOpen(false)}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 50 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 lg:p-8 pointer-events-none"
            >
              <div className="relative w-full max-w-5xl bg-[#1a1a1a] rounded-xl overflow-hidden shadow-2xl pointer-events-auto">
                {/* Close Button */}
                <button
                  onClick={() => setVideoModalOpen(false)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 md:w-12 md:h-12 bg-[#de0035] rounded-full flex items-center justify-center hover:bg-[#c5002f] transition-colors group"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Video Player */}
                <div className="relative w-full aspect-video bg-black">
                  <video
                    className="w-full h-full"
                    controls
                    autoPlay
                    poster={currentHero.image}
                  >
                    {currentHero.streamUrl && <source src={currentHero.streamUrl} type="video/mp4" />}
                    Votre navigateur ne supporte pas la lecture de vidéos.
                  </video>
                </div>

                {/* Video Info */}
                <div className="p-4 md:p-6 lg:p-8">
                  <h3 className="font-['Montserrat',sans-serif] font-semibold text-white text-xl md:text-2xl lg:text-3xl mb-2">
                    {currentHero.title}
                  </h3>
                  <p className="font-['DM_Sans',sans-serif] text-[#dfe1e4] text-sm md:text-base mb-4">
                    {currentHero.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-5" fill="none" viewBox="0 0 30 40">
                        <g>
                          <path d={svgPaths.p185cb180} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                          <path d={svgPaths.p188be600} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                        </g>
                      </svg>
                      <span className="font-['DM_Sans',sans-serif] text-white text-sm md:text-base">
                        {currentHero.location}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 31 34">
                        <path d={svgPaths.p23bf7380} stroke="#DE0035" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
                      </svg>
                      <span className="font-['DM_Sans',sans-serif] text-white text-sm md:text-base">
                        {currentHero.date}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
