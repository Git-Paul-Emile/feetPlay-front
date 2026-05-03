import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { ReplayBanner } from '../components/ReplayBanner';
import { EventCard } from '../components/EventCard';
import { SortFilter, type SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import EventsAPI, { type StreamingEvent } from '../services/api/EventsAPI';
import Feeti2EventsAPI, { type Feeti2Event } from '../services/api/Feeti2EventsAPI';
import { getPreferredFeeti2BaseUrl } from '../utils/serviceConfig';
import categorySvgPaths from "../../imports/svg-ckb5lqxig6";
import svgPaths from "../../imports/svg-z30khrsoqy";
import { firebaseClientErrorToUserMessage } from '../utils/firebaseUserFacingError';

const FEETI2_URL = getPreferredFeeti2BaseUrl();

const categories = [
  {
    name: 'Cinema',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p1adf5980} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p2db0380} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p3e760100} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    name: 'Concert',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d="M3 8.25V15.75" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M7.5 5.75V18.25" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M12 3.25V20.75" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M16.5 5.75V18.25" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M21 8.25V15.75" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    name: 'Art',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p137f9d00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p36526000} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p1e724200} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    name: 'Sport',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.pe124f80} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p32c1af80} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p7b2c300} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M15 11H9" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    ),
  },
  {
    name: 'Business',
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p5c67700} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.pd4ca500} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p32c69a00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    ),
  },
];

function formatCardDate(date: string, time?: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return time ? `${date} ${time}` : date;
  const formatted = parsed.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  return time ? `${formatted} ${time}` : formatted;
}

function mapToCard(event: StreamingEvent) {
  return {
    id: event.id,
    image: event.image,
    title: event.title,
    location: event.channelName,
    date: formatCardDate(event.date, event.time),
    category: event.category,
    isLive: event.isLive,
    isFree: event.isFree,
    hasStreaming: true,
    price: event.price ?? undefined,
  };
}

function matchesFilters(event: StreamingEvent, searchTerm: string, selectedCategory: string | null) {
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const matchesSearch = !normalizedSearch || [
    event.title,
    event.description,
    event.channelName,
    event.category,
  ].some((value) => value.toLowerCase().includes(normalizedSearch));

  const matchesCategory = !selectedCategory
    || event.category.toLowerCase() === selectedCategory.toLowerCase();

  return matchesSearch && matchesCategory;
}

function isSameMonth(date: string, baseDate: Date) {
  const parsed = new Date(date);
  return !Number.isNaN(parsed.getTime())
    && parsed.getMonth() === baseDate.getMonth()
    && parsed.getFullYear() === baseDate.getFullYear();
}

function isNextMonth(date: string, baseDate: Date) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;
  const nextMonth = new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, 1);
  return parsed.getMonth() === nextMonth.getMonth() && parsed.getFullYear() === nextMonth.getFullYear();
}

export function Live() {
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [events, setEvents] = useState<StreamingEvent[]>([]);
  const [feeti2LiveEvents, setFeeti2LiveEvents] = useState<Feeti2Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const liveRef = useRef<HTMLDivElement>(null);
  const upcomingRef = useRef<HTMLDivElement>(null);
  const currentMonthRef = useRef<HTMLDivElement>(null);
  const nextMonthRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let mounted = true;

    Promise.all([
      EventsAPI.getAll(),
      Feeti2EventsAPI.getLiveEvents(),
    ])
      .then(([eventsData, feeti2Data]) => {
        if (!mounted) return;
        setEvents(eventsData);
        setFeeti2LiveEvents(feeti2Data);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(firebaseClientErrorToUserMessage(err, 'Impossible de charger les donnees live.'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const filteredEvents = useMemo(
    () => events.filter((event) => matchesFilters(event, searchTerm, selectedCategory)),
    [events, searchTerm, selectedCategory],
  );

  const now = useMemo(() => new Date(), []);

  const liveEvents = useMemo(
    () => filteredEvents.filter((event) => event.isLive),
    [filteredEvents],
  );

  const upcomingCards = useMemo(
    () => sortEvents(
      filteredEvents
        .filter((event) => !event.isReplay && !event.isLive)
        .filter((event) => new Date(event.date).getTime() >= now.getTime())
        .map(mapToCard)
        .slice(0, 12),
      sortOption,
    ),
    [filteredEvents, now, sortOption],
  );

  const currentMonthCards = useMemo(
    () => sortEvents(
      filteredEvents
        .filter((event) => !event.isReplay && isSameMonth(event.date, now))
        .map(mapToCard),
      sortOption,
    ),
    [filteredEvents, now, sortOption],
  );

  const nextMonthCards = useMemo(
    () => sortEvents(
      filteredEvents
        .filter((event) => !event.isReplay && isNextMonth(event.date, now))
        .map(mapToCard),
      sortOption,
    ),
    [filteredEvents, now, sortOption],
  );

  const feeti2FilteredLive = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    return feeti2LiveEvents.filter((event) => {
      const matchesSearch = !normalizedSearch || [
        event.title,
        event.description,
        event.channelName,
        event.category,
      ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesCategory = !selectedCategory
        || event.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [feeti2LiveEvents, searchTerm, selectedCategory]);

  const scrollCarousel = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#080808] min-h-screen pt-20">
      <div className="sticky top-16 md:top-20 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Rechercher un evenement en live..."
            />
          </div>

          <div className="flex gap-2 md:gap-2.5 lg:gap-3 items-start overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
            {categories.map((cat) => {
              const active = selectedCategory === cat.name;
              return (
                <motion.button
                  key={cat.name}
                  className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 rounded-[100px] shrink-0 transition-all ${
                    active ? 'bg-[#cdff71]' : 'bg-white border-[0.3px] border-[#dfe1e4]'
                  }`}
                  onClick={() => setSelectedCategory((prev) => (prev === cat.name ? null : cat.name))}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 shrink-0">
                    {cat.icon}
                  </div>
                  <span className="font-['Urbanist',sans-serif] font-semibold text-[#000441] text-[13px] md:text-[14px] lg:text-[15px] whitespace-nowrap">
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-white/60 text-sm">
            {loading ? 'Chargement des flux...' : `${filteredEvents.length} evenement(s) FeetiPlay correspondent aux filtres`}
          </p>
          <SortFilter currentSort={sortOption} onSortChange={setSortOption} />
        </div>

        {error && (
          <div className="mb-8 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
            {error}
          </div>
        )}

        {(liveEvents.length > 0 || feeti2FilteredLive.length > 0) && (
          <section className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
                  En Direct Maintenant
                </h2>
                <span className="bg-[#DE0035] text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  LIVE {liveEvents.length + feeti2FilteredLive.length}
                </span>
              </div>
              <button
                onClick={() => liveRef.current?.scrollBy({ left: 500, behavior: 'smooth' })}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-110 hover:bg-white/10 active:scale-95 transition-all"
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255,255,255,0.3) 0%, rgba(32,11,11,0.3) 100%)" }}
              >
                <svg className="w-4 h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                  <path d={svgPaths.p22419180} fill="#B3B3B3" />
                </svg>
              </button>
            </div>
            <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth" ref={liveRef}>
              {liveEvents.map((event) => (
                <motion.div
                  key={`fp-${event.id}`}
                  className="shrink-0 w-[240px] sm:w-[260px] md:w-[280px] cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  <div className="relative rounded-xl overflow-hidden bg-white/5">
                    <img src={event.image} alt={event.title} className="w-full h-[160px] object-cover" />
                    <div className="absolute top-2 left-2 bg-[#DE0035] text-white text-xs font-bold px-2 py-0.5 rounded-full">LIVE</div>
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm truncate">{event.title}</p>
                      <p className="text-white/60 text-xs mt-1">{event.channelName}</p>
                      <p className="text-[#CDFF71] text-xs font-bold mt-1">
                        {event.isFree ? 'Gratuit' : `${event.price?.toLocaleString()} ${event.currency}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {feeti2FilteredLive.map((event) => (
                <motion.div
                  key={`f2-${event.id}`}
                  className="shrink-0 w-[240px] sm:w-[260px] md:w-[280px] cursor-pointer"
                  whileHover={{ scale: 1.03 }}
                  onClick={() => navigate(`/event/${event.id}`)}
                >
                  <div className="relative rounded-xl overflow-hidden bg-white/5">
                    <img src={event.image} alt={event.title} className="w-full h-[160px] object-cover" />
                    <div className="absolute top-2 left-2 bg-[#DE0035] text-white text-xs font-bold px-2 py-0.5 rounded-full">LIVE</div>
                    <div className="absolute top-2 right-2 bg-[#4f46e5] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">Feeti</div>
                    <div className="p-3">
                      <p className="text-white font-semibold text-sm truncate">{event.title}</p>
                      <p className="text-white/60 text-xs mt-1">{event.channelName}</p>
                      <div className="flex items-center justify-between mt-1 gap-3">
                        <p className="text-[#CDFF71] text-xs font-bold">
                          {event.isFree ? 'Gratuit' : `${event.price?.toLocaleString()} ${event.currency}`}
                        </p>
                        <a
                          href={`${FEETI2_URL}/events/${event.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(ev) => ev.stopPropagation()}
                          className="text-[10px] text-[#4f46e5] hover:underline"
                        >
                          Voir sur Feeti -
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
              A ne pas rater
            </h2>
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={() => scrollCarousel(upcomingRef, 'left')}
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all"
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
                aria-label="Precedent"
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
            {upcomingCards.map((event) => (
              <div key={event.id} className="shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </section>

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
                aria-label="Precedent"
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
            {currentMonthCards.map((event) => (
              <div key={event.id} className="shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </section>

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
                aria-label="Precedent"
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
            {nextMonthCards.map((event) => (
              <div key={event.id} className="shrink-0 w-[240px] sm:w-[260px] md:w-[280px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <ReplayBanner />
        </section>
      </div>

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
