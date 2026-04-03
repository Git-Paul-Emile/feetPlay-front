import { useSearchParams, Link } from 'react-router';
import { EventCard } from '../components/EventCard';
import { SortFilter, SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import { ArrowLeft, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';

// Import event images
import imgImage14 from "figma:asset/8e5f3463a14418977bae5067abd0af0b3a184d6f.png";
import imgImage15 from "figma:asset/13c8f478c4ac182bcae3355ddc4fb0742396f2b3.png";
import imgImage16 from "figma:asset/af4f8497cd796b01f6c149bd2d388e5f991489ff.png";
import imgImage17 from "figma:asset/9b779636dff8669a8ebe0146669ac311e330cc4e.png";
import imgImage18 from "figma:asset/6a8c591a36a76b0ae46f649c9870fe44bce470e7.png";
import imgImage19 from "figma:asset/2bfa3e53c40b7bc1dddd06c6eaef1de790eeeb00.png";

const allEvents = [
  {
    id: 1,
    image: imgImage14,
    title: 'Dadju - concert Montreal',
    location: 'Salle Savorgnon - IFC',
    date: '20.12.2025',
    category: 'Concert',
    keywords: ['dadju', 'concert', 'montreal', 'musique', 'live'],
    isFree: true,
    hasStreaming: true,
  },
  {
    id: 2,
    image: imgImage15,
    title: 'Fally Ipupa - Live Paris',
    location: 'Accor Arena - Paris',
    date: '15.01.2026',
    category: 'Concert',
    keywords: ['fally', 'ipupa', 'paris', 'concert', 'musique'],
    isFree: true,
    hasStreaming: true,
  },
  {
    id: 3,
    image: imgImage16,
    title: 'Match Football - CAN 2026',
    location: 'Stade Omnisport - Yaoundé',
    date: '05.02.2026',
    category: 'Sport',
    keywords: ['football', 'can', 'sport', 'match', 'cameroun'],
    isLive: true,
    isFree: true,
    hasStreaming: true,
  },
  {
    id: 4,
    image: imgImage17,
    title: 'Werrason - Concert Kinshasa',
    location: 'Stade des Martyrs - Kinshasa',
    date: '28.02.2026',
    category: 'Concert',
    keywords: ['werrason', 'concert', 'kinshasa', 'rdc', 'musique'],
    isFree: true,
    hasStreaming: true,
  },
  {
    id: 5,
    image: imgImage18,
    title: 'Koffi Olomide - Show Live',
    location: 'Palais des Sports - Brazzaville',
    date: '12.03.2026',
    category: 'Concert',
    keywords: ['koffi', 'olomide', 'brazzaville', 'congo', 'show'],
    isFree: true,
    hasStreaming: true,
  },
  {
    id: 6,
    image: imgImage19,
    title: 'Festival Afro Beat',
    location: 'Parc de la Musique - Libreville',
    date: '25.03.2026',
    category: 'Festival',
    keywords: ['festival', 'afrobeat', 'gabon', 'musique', 'libreville'],
    isFree: true,
    hasStreaming: true,
  },
];

export function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  // Filter events based on search query
  const filteredEvents = query
    ? allEvents.filter((event) => {
        const searchLower = query.toLowerCase();
        return (
          event.title.toLowerCase().includes(searchLower) ||
          event.location.toLowerCase().includes(searchLower) ||
          event.category.toLowerCase().includes(searchLower) ||
          event.keywords.some((keyword) => keyword.includes(searchLower))
        );
      })
    : allEvents;

  // State for sorting
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');

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