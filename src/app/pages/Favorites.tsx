import { useState } from 'react';
import { motion } from 'motion/react';
import { useFavorites } from '../contexts/FavoritesContext';
import { CalendarEventCard } from '../components/CalendarEventCard';
import { EventPlayerModal } from '../components/EventPlayerModal';
import { Heart, Trash2, Calendar, Filter } from 'lucide-react';
import { SortFilter, SortOption } from '../components/SortFilter';

export function Favorites() {
  const { favorites, clearAllFavorites } = useFavorites();
  const [sortOption, setSortOption] = useState<SortOption>('date-desc');
  const [filterType, setFilterType] = useState<'all' | 'live' | 'upcoming' | 'free'>('all');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);

  // Sort and filter favorites
  const getSortedAndFilteredFavorites = () => {
    let filtered = [...favorites];

    // Apply filter
    switch (filterType) {
      case 'live':
        filtered = filtered.filter(f => f.isLive);
        break;
      case 'upcoming':
        filtered = filtered.filter(f => !f.isLive);
        break;
      case 'free':
        filtered = filtered.filter(f => f.isFree);
        break;
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-asc':
          return a.addedAt - b.addedAt;
        case 'date-desc':
          return b.addedAt - a.addedAt;
        case 'name-asc':
          return a.title.localeCompare(b.title);
        case 'name-desc':
          return b.title.localeCompare(a.title);
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const handleEventPlay = (event: any) => {
    setSelectedEvent(event);
    setIsPlayerOpen(true);
  };

  const handleClearAll = () => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer tous vos ${favorites.length} favoris ?`)) {
      clearAllFavorites();
    }
  };

  const sortedFavorites = getSortedAndFilteredFavorites();

  return (
    <div className="relative bg-[#080808] min-h-screen pt-20">
      {/* Header */}
      <div className="sticky top-16 md:top-20 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 py-6">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-br from-[#DE0035] to-[#FF1744] rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <div>
                  <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl md:text-3xl lg:text-4xl">
                    Mes Favoris
                  </h1>
                  <p className="font-['DM_Sans',sans-serif] text-white/60 text-[14px]">
                    {favorites.length} événement{favorites.length > 1 ? 's' : ''} sauvegardé{favorites.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>

            {/* Clear All Button */}
            {favorites.length > 0 && (
              <motion.button
                onClick={handleClearAll}
                className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-[12px] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Trash2 className="w-4 h-4 text-[#DE0035]" />
                <span className="font-['Inter',sans-serif] font-semibold text-white text-[14px]">
                  Tout supprimer
                </span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {favorites.length > 0 ? (
          <>
            {/* Filters & Sort */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              {/* Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full sm:w-auto">
                <div className="flex items-center gap-2 shrink-0">
                  <Filter className="w-4 h-4 text-white/60" />
                  <span className="font-['Inter',sans-serif] font-medium text-white/60 text-[13px]">
                    Filtrer:
                  </span>
                </div>
                
                {[
                  { value: 'all', label: 'Tous' },
                  { value: 'live', label: 'En direct' },
                  { value: 'upcoming', label: 'À venir' },
                  { value: 'free', label: 'Gratuits' },
                ].map((filter) => (
                  <motion.button
                    key={filter.value}
                    onClick={() => setFilterType(filter.value as any)}
                    className={`px-3 py-1.5 rounded-[8px] transition-colors shrink-0 ${
                      filterType === filter.value
                        ? 'bg-[#CDFF71] text-[#000441]'
                        : 'bg-white/5 text-white/70 hover:bg-white/10'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="font-['Inter',sans-serif] font-semibold text-[13px]">
                      {filter.label}
                    </span>
                  </motion.button>
                ))}
              </div>

              {/* Sort */}
              <SortFilter
                currentSort={sortOption}
                onSortChange={setSortOption}
              />
            </div>

            {/* Results Count */}
            <div className="mb-4">
              <p className="font-['Inter',sans-serif] text-white/60 text-[14px]">
                {sortedFavorites.length} résultat{sortedFavorites.length > 1 ? 's' : ''}
                {filterType !== 'all' && ` (filtre actif)`}
              </p>
            </div>

            {/* Favorites Grid */}
            {sortedFavorites.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {sortedFavorites.map((event) => (
                  <CalendarEventCard
                    key={event.id}
                    id={event.id}
                    image={event.image}
                    title={event.title}
                    location={event.location}
                    time={event.time || event.date}
                    duration={event.duration || '2h00'}
                    category={event.category}
                    isLive={event.isLive}
                    isFree={event.isFree}
                    price={event.price}
                    fullDate={event.fullDate}
                    onPlay={() => handleEventPlay(event)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Filter className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="font-['DM_Sans',sans-serif] text-white/40 text-[16px] mb-2">
                  Aucun événement ne correspond aux filtres sélectionnés
                </p>
                <motion.button
                  onClick={() => setFilterType('all')}
                  className="text-[#CDFF71] hover:underline text-[14px]"
                  whileHover={{ scale: 1.05 }}
                >
                  Réinitialiser les filtres
                </motion.button>
              </div>
            )}

            {/* Stats */}
            <div className="mt-8 p-6 bg-[#0D0D0D] border border-white/10 rounded-[16px]">
              <h3 className="font-['Inter',sans-serif] font-bold text-white text-lg mb-4">
                Statistiques
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-white/5 rounded-[12px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Heart className="w-4 h-4 text-[#DE0035]" />
                    <span className="font-['Inter',sans-serif] font-medium text-white/60 text-[12px]">
                      Total
                    </span>
                  </div>
                  <p className="font-['Inter',sans-serif] font-bold text-white text-2xl">
                    {favorites.length}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-[12px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-[#DE0035] rounded-full" />
                    <span className="font-['Inter',sans-serif] font-medium text-white/60 text-[12px]">
                      En direct
                    </span>
                  </div>
                  <p className="font-['Inter',sans-serif] font-bold text-[#DE0035] text-2xl">
                    {favorites.filter(f => f.isLive).length}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-[12px]">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="w-4 h-4 text-[#CDFF71]" />
                    <span className="font-['Inter',sans-serif] font-medium text-white/60 text-[12px]">
                      À venir
                    </span>
                  </div>
                  <p className="font-['Inter',sans-serif] font-bold text-[#CDFF71] text-2xl">
                    {favorites.filter(f => !f.isLive).length}
                  </p>
                </div>
                <div className="p-4 bg-white/5 rounded-[12px]">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 bg-white rounded-full" />
                    <span className="font-['Inter',sans-serif] font-medium text-white/60 text-[12px]">
                      Gratuits
                    </span>
                  </div>
                  <p className="font-['Inter',sans-serif] font-bold text-white text-2xl">
                    {favorites.filter(f => f.isFree).length}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-20">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="w-24 h-24 bg-gradient-to-br from-[#DE0035]/20 to-[#FF1744]/20 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Heart className="w-12 h-12 text-[#DE0035]" />
            </motion.div>
            <h2 className="font-['Inter',sans-serif] font-bold text-white text-2xl mb-3">
              Aucun favori pour le moment
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-white/60 text-[16px] mb-6 max-w-md mx-auto">
              Ajoutez des événements à vos favoris en cliquant sur l'icône ❤️ pour les retrouver facilement ici.
            </p>
            <motion.a
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#DE0035] hover:bg-[#DE0035]/90 text-white font-['Inter',sans-serif] font-bold text-[15px] rounded-[12px] transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Découvrir des événements
            </motion.a>
          </div>
        )}
      </div>

      {/* Event Player Modal */}
      <EventPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        event={selectedEvent}
      />

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
