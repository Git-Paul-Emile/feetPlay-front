import { ReplayCard } from '../components/ReplayCard';
import { ReplayPlayerModal } from '../components/ReplayPlayerModal';
import { SortFilter, SortOption } from '../components/SortFilter';
import { SearchBar } from '../components/SearchBar';
import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import categorySvgPaths from "../../imports/svg-ckb5lqxig6";
import svgPaths from "../../imports/svg-z30khrsoqy";
import EventsAPI, { type StreamingEvent } from '../services/api/EventsAPI';
import { format, isThisMonth, isLastMonth, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';

const categories = [
  {
    name: 'Tous', active: true,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d="M3 5h18M3 12h18M3 19h18" stroke="#000441" strokeLinecap="round" strokeWidth="1.3" />
      </svg>
    )
  },
  {
    name: 'Cinema', active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p1adf5980} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p2db0380} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p3e760100} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  {
    name: 'Concert', active: false,
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
    name: 'Art', active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p137f9d00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p36526000} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p1e724200} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  {
    name: 'Music', active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p8d41200} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d="M11.97 18V4" stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p17cba0f0} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
  {
    name: 'Sport', active: false,
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
    name: 'Festival', active: false,
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
    name: 'Business', active: false,
    icon: (
      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
        <path d={categorySvgPaths.p5c67700} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.pd4ca500} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
        <path d={categorySvgPaths.p32c69a00} stroke="#000441" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
      </svg>
    )
  },
];

/** Formate une date ISO en "SAM 20.12.2025" */
function formatReplayDate(dateStr: string): string {
  try {
    const d = parseISO(dateStr);
    const day = format(d, 'EEE', { locale: fr }).toUpperCase().replace('.', '');
    const date = format(d, 'dd.MM.yyyy');
    return `${day} ${date}`;
  } catch {
    return dateStr;
  }
}

/** Convertit un StreamingEvent en props ReplayCard */
function eventToCardProps(event: StreamingEvent) {
  return {
    id: event.id,
    image: event.image,
    title: event.title,
    location: event.location ?? event.channelName ?? '',
    date: formatReplayDate(event.date),
    duration: event.duration,
    category: event.category,
    streamUrl: event.streamUrl,
    progress: undefined as number | undefined,
  };
}

// Skeleton card pour le chargement
function ReplayCardSkeleton() {
  return (
    <div className="relative h-[236px] min-w-[320px] sm:min-w-[380px] md:min-w-[420px] lg:min-w-[464px] flex-shrink-0 bg-white/5 rounded-[12px] animate-pulse" />
  );
}

interface ReplaySection {
  label: string;
  events: StreamingEvent[];
}

export function Replay() {
  const [allReplays, setAllReplays] = useState<StreamingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState(0);
  const [selectedReplay, setSelectedReplay] = useState<StreamingEvent | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  const recentRef = useRef<HTMLDivElement>(null);
  const thisMonthRef = useRef<HTMLDivElement>(null);
  const lastMonthRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  // Fetch replays depuis le backend
  const fetchReplays = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await EventsAPI.getReplays();
      setAllReplays(data);
    } catch (err) {
      console.error('Erreur chargement replays:', err);
      setError('Impossible de charger les replays. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReplays();
  }, [fetchReplays]);

  // Filtre par catégorie + recherche
  const filtered = allReplays.filter(e => {
    const catName = categories[activeCategory].name;
    const matchCat = catName === 'Tous' || e.category.toLowerCase() === catName.toLowerCase();
    const matchSearch = !searchTerm ||
      e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (e.location ?? '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  // Groupement des sections
  const sections: ReplaySection[] = [
    {
      label: 'Les plus récents',
      events: [...filtered].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 10),
    },
    {
      label: 'Ce mois',
      events: filtered.filter(e => {
        try { return isThisMonth(parseISO(e.date)); } catch { return false; }
      }),
    },
    {
      label: 'Le mois dernier',
      events: filtered.filter(e => {
        try { return isLastMonth(parseISO(e.date)); } catch { return false; }
      }),
    },
    {
      label: 'Meilleurs replays du moment',
      events: [...filtered].sort((a, b) =>
        (b.viewerCount ?? 0) - (a.viewerCount ?? 0)
      ).slice(0, 10),
    },
  ];

  const sectionRefs = [recentRef, thisMonthRef, lastMonthRef, topRef];

  const scrollCarousel = (ref: { current: HTMLDivElement | null }, direction: 'left' | 'right') => {
    if (ref.current) {
      ref.current.scrollBy({ left: direction === 'left' ? -500 : 500, behavior: 'smooth' });
    }
  };

  const handleReplayClick = (event: StreamingEvent) => {
    setSelectedReplay(event);
    setIsPlayerOpen(true);
  };

  return (
    <div className="relative bg-[#080808] min-h-screen pt-20">
      {/* Search Bar et Catégories */}
      <div className="sticky top-16 md:top-20 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-4">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Rechercher un replay..."
            />
          </div>
          <div className="flex gap-2 md:gap-2.5 lg:gap-3 items-start overflow-x-auto pb-2 scrollbar-hide scroll-smooth">
            {categories.map((cat, index) => (
              <motion.button
                key={index}
                className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 lg:px-5 py-2 md:py-2.5 lg:py-3 rounded-[100px] shrink-0 transition-all ${
                  index === activeCategory ? 'bg-[#cdff71]' : 'bg-white border border-[#dfe1e4] border-[0.3px]'
                }`}
                onClick={() => setActiveCategory(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <div className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 flex-shrink-0">{cat.icon}</div>
                <span className="font-['Urbanist',sans-serif] font-semibold text-[#000441] text-[13px] md:text-[14px] lg:text-[15px] whitespace-nowrap">
                  {cat.name}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sort + compteur */}
        <div className="mb-6 flex items-center justify-between">
          {!loading && !error && (
            <p className="font-['Inter',sans-serif] text-white/50 text-sm">
              {filtered.length} replay{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
          <div className="ml-auto">
            <SortFilter currentSort={sortOption} onSortChange={setSortOption} />
          </div>
        </div>

        {/* État d'erreur */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <p className="font-['Inter',sans-serif] text-white/60 text-center">{error}</p>
            <button
              onClick={fetchReplays}
              className="px-6 py-2 bg-[#DE0035] text-white rounded-full font-['Inter',sans-serif] text-sm hover:bg-[#c5002f] transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* État vide (après chargement) */}
        {!loading && !error && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <svg className="w-16 h-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
            </svg>
            <p className="font-['Inter',sans-serif] text-white/40 text-lg">Aucun replay disponible</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-[#CDFF71] text-sm underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        )}

        {/* Sections */}
        {!error && sections.map((section, si) => {
          const ref = sectionRefs[si];
          const events = section.events;
          if (!loading && events.length === 0) return null;

          return (
            <section key={section.label} className="mb-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-['Inter',sans-serif] font-bold text-white text-lg md:text-xl lg:text-2xl">
                  {section.label}
                </h2>
                <div className="flex items-center gap-3 md:gap-6">
                  {[
                    { dir: 'left' as const, rotate: 'rotate-180', label: 'Précédent' },
                    { dir: 'right' as const, rotate: '', label: 'Suivant' },
                  ].map(({ dir, rotate, label }) => (
                    <button
                      key={dir}
                      onClick={() => scrollCarousel(ref, dir)}
                      className={`w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center ${rotate} hover:scale-110 hover:bg-white/10 active:scale-95 transition-all`}
                      style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255,255,255,0.3) 0%, rgba(32,11,11,0.3) 100%)" }}
                      aria-label={label}
                    >
                      <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                        <path d={svgPaths.p22419180} fill="#B3B3B3" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex gap-4 md:gap-5 lg:gap-6 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth"
                ref={ref}
              >
                {loading
                  ? Array.from({ length: 4 }).map((_, i) => (
                    <ReplayCardSkeleton key={i} />
                  ))
                  : events.map(event => (
                    <div key={event.id} className="flex-shrink-0">
                      <ReplayCard
                        {...eventToCardProps(event)}
                        onClick={() => handleReplayClick(event)}
                      />
                    </div>
                  ))
                }
              </div>
            </section>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <ReplayPlayerModal
        isOpen={isPlayerOpen}
        replay={selectedReplay}
        onClose={() => { setIsPlayerOpen(false); setSelectedReplay(null); }}
      />
    </div>
  );
}
