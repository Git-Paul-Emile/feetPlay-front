import { useEffect, useMemo, useRef, useState } from 'react';
import { EventCard } from '../components/EventCard';
import EventsAPI, { type StreamingEvent } from '../services/api/EventsAPI';
import svgPaths from "../../imports/svg-z30khrsoqy";
import { firebaseClientErrorToUserMessage } from '../utils/firebaseUserFacingError';

function formatEventDate(date: string, time?: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) {
    return time ? `${date} - ${time}` : date;
  }

  const formatted = parsed.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return time ? `${formatted} - ${time}` : formatted;
}

function mapEventToCard(event: StreamingEvent) {
  return {
    id: event.id,
    image: event.image,
    title: event.title,
    location: event.channelName,
    date: formatEventDate(event.date, event.time),
    isFree: event.isFree,
    hasStreaming: true,
    isLive: event.isLive,
    price: event.price,
    category: event.category,
  };
}

export function EventList() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [events, setEvents] = useState<StreamingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    EventsAPI.getAll()
      .then((data) => {
        if (!mounted) return;
        setEvents(data);
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(firebaseClientErrorToUserMessage(err, 'Impossible de charger les evenements.'));
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cards = useMemo(() => events.map(mapEventToCard), [events]);
  const featuredCards = useMemo(() => cards.slice(0, 8), [cards]);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#080808] min-h-screen py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl md:text-3xl lg:text-4xl xl:text-[36px] leading-tight">
              Tous les evenements
            </h1>
            <p className="text-white/60 text-sm md:text-base mt-2">
              {loading ? 'Chargement en cours...' : `${cards.length} evenement(s) disponibles`}
            </p>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all"
              style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
              aria-label="Precedent"
            >
              <svg className="w-4 h-3 md:w-5 md:h-3 rotate-90" fill="none" viewBox="0 0 20.1716 12.1216">
                <path d={svgPaths.p22419180} fill="#B3B3B3" />
              </svg>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
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

        {error && (
          <div className="mb-8 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
            {error}
          </div>
        )}

        {!loading && featuredCards.length > 0 && (
          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth mb-16"
          >
            {featuredCards.map((event) => (
              <div key={event.id} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[309px]">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-16">
          <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl lg:text-3xl mb-8">
            Evenements recents
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-[456px] rounded-[17px] bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : cards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {cards.map((event) => (
                <EventCard key={event.id} {...event} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-12 text-center text-white/70">
              Aucun evenement disponible pour le moment.
            </div>
          )}
        </div>
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
