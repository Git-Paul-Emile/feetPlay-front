import { useSearchParams, Link } from 'react-router';
import { EventCard } from '../components/EventCard';
import { SortFilter, SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import EventsAPI from '../services/api/EventsAPI';

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [filteredEvents, setFilteredEvents] = useState<Array<{ id: string; image: string; title: string; location: string; date: string; category: string; isLive?: boolean; isFree?: boolean; hasStreaming?: boolean }>>([]);
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');

  useEffect(() => {
    const request = query ? EventsAPI.search(query) : EventsAPI.getAll();
    request.then(events => setFilteredEvents(events.map(e => ({
      id: e.id,
      image: e.image,
      title: e.title,
      location: e.location ?? '',
      date: e.date,
      category: e.category,
      isLive: e.isLive,
      isFree: e.isFree,
      hasStreaming: true,
    })))).catch(() => {});
  }, [query]);

  return (
    <div className="min-h-screen bg-[#080808] py-8 md:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/">
          <motion.button
            className="flex items-center gap-2 text-white/70 hover:text-white mb-8 transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-['Inter',sans-serif] text-sm md:text-base">Retour</span>
          </motion.button>
        </Link>

        {/* Search Header */}
        <div className="mb-8 md:mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 md:w-7 md:h-7 text-[#CDFF71]" />
            <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl md:text-3xl lg:text-4xl">
              Résultats de recherche
            </h1>
          </div>
          
          {query && (
            <p className="font-['Inter',sans-serif] text-[#999999] text-base md:text-lg">
              {filteredEvents.length} résultat{filteredEvents.length > 1 ? 's' : ''} pour{' '}
              <span className="text-[#CDFF71] font-semibold">"{query}"</span>
            </p>
          )}
        </div>

        {/* Sort Filter */}
        <div className="mb-8 flex justify-end">
          <SortFilter
            currentSort={sortOption}
            onSortChange={setSortOption}
          />
        </div>

        {/* Results Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {sortEvents(filteredEvents, sortOption).map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <EventCard
                  image={event.image}
                  title={event.title}
                  location={event.location}
                  date={event.date}
                  isLive={event.isLive}
                  isFree={event.isFree}
                  hasStreaming={event.hasStreaming}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
                <Search className="w-10 h-10 text-white/30" />
              </div>
              <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl mb-3">
                Aucun résultat trouvé
              </h2>
              <p className="font-['Inter',sans-serif] text-[#999999] text-base mb-8">
                Essayez d'autres mots-clés ou parcourez nos événements
              </p>
              <Link to="/">
                <motion.button
                  className="px-6 py-3 bg-[#CDFF71] text-black font-['Inter',sans-serif] font-semibold rounded-full hover:bg-[#b8e663] transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Retour à l'accueil
                </motion.button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}