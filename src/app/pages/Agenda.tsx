import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { SortFilter, SortOption } from '../components/SortFilter';
import { CalendarView } from '../components/CalendarView';
import { TimelineView } from '../components/TimelineView';
import { CalendarEventCard, CalendarEventCardProps } from '../components/CalendarEventCard';
import { EventPlayerModal } from '../components/EventPlayerModal';
import { ReplayPlayerModal } from '../components/ReplayPlayerModal';
import { Calendar, List, Clock } from 'lucide-react';

// Import event images
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
import imgRectangle11251 from "figma:asset/0b78113e2fc57a1700c7a0cbfc24e9e1a03abf95.png";
import imgRectangle11252 from "figma:asset/72a3d9e3821c7ba6e8f40dc9be574e9f24b25fe0.png";

type ViewMode = 'calendar' | 'timeline' | 'list';

// Generate events data with full dates
const generateEvents = (): (CalendarEventCardProps & { fullDate: string })[] => {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  return [
    // Today's events
    { 
      id: '1',
      image: imgCardImg, 
      title: 'Yaye Padura', 
      location: 'Salle Savorgnon - IFC', 
      time: '19h00',
      duration: '2h30',
      category: 'Concert', 
      isLive: true, 
      price: 3000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    },
    { 
      id: '2',
      image: imgCardImg1, 
      title: 'Festival Mbote - Edition 2025', 
      location: 'Stade des Martyrs', 
      time: '14h00',
      duration: '6h00',
      category: 'Festival', 
      isLive: true, 
      isFree: true,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    },
    { 
      id: '3',
      image: imgCardImg2, 
      title: 'Concert Live Jazz', 
      location: 'Chez Ntemba', 
      time: '20h00',
      duration: '3h00',
      category: 'Concert', 
      isLive: false, 
      price: 8000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    },

    // Tomorrow
    { 
      id: '4',
      image: imgCardImg3, 
      title: 'Spectacle Comédie', 
      location: 'Pullman Hotel', 
      time: '21h00',
      duration: '2h00',
      category: 'Comedy', 
      isLive: false, 
      price: 12000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 1).padStart(2, '0')}`
    },
    { 
      id: '5',
      image: imgCardImg4, 
      title: 'Soirée Danse Afro', 
      location: 'Fleuve Congo Hotel', 
      time: '18h00',
      duration: '4h00',
      category: 'Danse', 
      isLive: false, 
      isFree: true,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 1).padStart(2, '0')}`
    },

    // In 2 days
    { 
      id: '6',
      image: imgImage16, 
      title: 'Concert Afrobeat Paris', 
      location: 'Paris Arena', 
      time: '22h00',
      duration: '3h00',
      category: 'Concert', 
      isLive: false, 
      price: 7500,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 2).padStart(2, '0')}`
    },
    { 
      id: '7',
      image: imgImage17, 
      title: 'Festival Amapiano Live', 
      location: 'Lyon Zenith', 
      time: '16h00',
      duration: '5h00',
      category: 'Festival', 
      isLive: false, 
      isFree: true,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 2).padStart(2, '0')}`
    },

    // In 3 days
    { 
      id: '8',
      image: imgImage18, 
      title: 'Soirée Rumba Congolaise', 
      location: 'Bruxelles Expo', 
      time: '19h30',
      duration: '3h30',
      category: 'Concert', 
      isLive: false, 
      price: 12000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 3).padStart(2, '0')}`
    },

    // In 5 days
    { 
      id: '9',
      image: imgImage19, 
      title: 'Nuit du Ndombolo', 
      location: 'Genève Arena', 
      time: '21h00',
      duration: '4h00',
      category: 'Danse', 
      isLive: false, 
      price: 9000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 5).padStart(2, '0')}`
    },
    { 
      id: '10',
      image: imgImage20, 
      title: 'Concert Gospel Live', 
      location: 'Lausanne Centre', 
      time: '17h00',
      duration: '2h30',
      category: 'Concert', 
      isLive: false, 
      isFree: true,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 5).padStart(2, '0')}`
    },

    // In 7 days
    { 
      id: '11',
      image: imgRectangle11251, 
      title: 'Concert Dadju Brazzaville', 
      location: 'Salle Savorgnon -IFC', 
      time: '20h00',
      duration: '3h00',
      category: 'Concert', 
      isLive: false, 
      price: 15000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 7).padStart(2, '0')}`
    },
    { 
      id: '12',
      image: imgRectangle11252, 
      title: 'Festival Afro Jembe Jaiye', 
      location: 'Palais des Sports', 
      time: '15h00',
      duration: '6h00',
      category: 'Festival', 
      isLive: false, 
      price: 5000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 7).padStart(2, '0')}`
    },

    // In 10 days
    { 
      id: '13',
      image: imgCardImg, 
      title: 'Fally Ipupa Live Show', 
      location: 'Stade des Martyrs', 
      time: '19h00',
      duration: '4h00',
      category: 'Concert', 
      isLive: false, 
      price: 20000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 10).padStart(2, '0')}`
    },

    // In 14 days
    { 
      id: '14',
      image: imgCardImg1, 
      title: 'Soirée Jazz Premium', 
      location: 'Centre Culturel Français', 
      time: '21h00',
      duration: '3h00',
      category: 'Concert', 
      isLive: false, 
      price: 10000,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 14).padStart(2, '0')}`
    },

    // In 20 days
    { 
      id: '15',
      image: imgCardImg2, 
      title: 'Festival Urbain Kinshasa', 
      location: 'Parc de la Vallée', 
      time: '16h00',
      duration: '8h00',
      category: 'Festival', 
      isLive: false, 
      isFree: true,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(today.getDate() + 20).padStart(2, '0')}`
    },
  ];
};

export function Agenda() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventCardProps | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isReplayOpen, setIsReplayOpen] = useState(false);

  const allEvents = generateEvents();

  // Filter events for selected date
  const getEventsForDate = (date: Date) => {
    return allEvents.filter(event => {
      const eventDate = new Date(event.fullDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  // Get all filtered events
  const getFilteredEvents = () => {
    let filtered = allEvents;

    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.fullDate + 'T' + a.time.replace('h', ':'));
      const dateB = new Date(b.fullDate + 'T' + b.time.replace('h', ':'));
      return sortOption === 'date-asc' 
        ? dateA.getTime() - dateB.getTime() 
        : dateB.getTime() - dateA.getTime();
    });

    return filtered;
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleEventPlay = (event: CalendarEventCardProps) => {
    setSelectedEvent(event);
    setIsPlayerOpen(true);
  };

  const handleEventReplay = (event: CalendarEventCardProps) => {
    setSelectedEvent(event);
    setIsReplayOpen(true);
  };

  const selectedDateEvents = getEventsForDate(selectedDate);
  const filteredEvents = getFilteredEvents();

  return (
    <div className="relative bg-[#080808] min-h-screen pt-20">
      {/* Header */}
      <div className="sticky top-16 md:top-20 z-40 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Title & View Mode Toggle */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl md:text-3xl lg:text-4xl mb-1">
                Agenda des événements
              </h1>
              <p className="font-['DM_Sans',sans-serif] text-white/60 text-[14px]">
                Planifiez vos événements favoris
              </p>
            </div>

            {/* View Mode Buttons */}
            <div className="flex items-center gap-2 bg-white/5 rounded-[12px] p-1">
              <motion.button
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-[8px] transition-colors ${
                  viewMode === 'calendar' 
                    ? 'bg-[#CDFF71] text-[#000441]' 
                    : 'text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Calendar className="w-4 h-4" />
                <span className="hidden md:inline font-['Inter',sans-serif] font-semibold text-[13px]">
                  Calendrier
                </span>
              </motion.button>

              <motion.button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-[8px] transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-[#CDFF71] text-[#000441]' 
                    : 'text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Clock className="w-4 h-4" />
                <span className="hidden md:inline font-['Inter',sans-serif] font-semibold text-[13px]">
                  Timeline
                </span>
              </motion.button>

              <motion.button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-[8px] transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-[#CDFF71] text-[#000441]' 
                    : 'text-white/60 hover:text-white'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <List className="w-4 h-4" />
                <span className="hidden md:inline font-['Inter',sans-serif] font-semibold text-[13px]">
                  Liste
                </span>
              </motion.button>
            </div>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder="Rechercher un événement..."
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Sort Filter */}
        <div className="mb-6 flex justify-end">
          <SortFilter
            currentSort={sortOption}
            onSortChange={setSortOption}
          />
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <CalendarView
                currentDate={currentDate}
                onDateSelect={setSelectedDate}
                onMonthChange={handleMonthChange}
                selectedDate={selectedDate}
                events={allEvents}
              />
            </div>

            {/* Events for Selected Date */}
            <div>
              <div className="bg-[#0D0D0D] border border-white/10 rounded-[16px] p-4 md:p-6">
                <h3 className="font-['Inter',sans-serif] font-bold text-white text-lg mb-4">
                  Événements du {selectedDate.getDate()}/{selectedDate.getMonth() + 1}
                </h3>
                
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3 max-h-[600px] overflow-y-auto scrollbar-hide">
                    {selectedDateEvents.map((event) => (
                      <CalendarEventCard
                        key={event.id}
                        {...event}
                        onPlay={() => handleEventPlay(event)}
                        onReplay={() => handleEventReplay(event)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="font-['DM_Sans',sans-serif] text-white/40 text-[14px]">
                      Aucun événement ce jour
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <TimelineView
            events={selectedDateEvents}
            selectedDate={selectedDate}
            onEventPlay={handleEventPlay}
          />
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div>
            <div className="mb-4">
              <p className="font-['Inter',sans-serif] text-white/60 text-[14px]">
                {filteredEvents.length} événement{filteredEvents.length > 1 ? 's' : ''} trouvé{filteredEvents.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredEvents.map((event) => (
                <CalendarEventCard
                  key={event.id}
                  {...event}
                  onPlay={() => handleEventPlay(event)}
                  onReplay={() => handleEventReplay(event)}
                />
              ))}
            </div>

            {filteredEvents.length === 0 && (
              <div className="text-center py-20">
                <List className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <p className="font-['DM_Sans',sans-serif] text-white/40 text-[16px]">
                  Aucun événement trouvé
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Player Modal */}
      <EventPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        event={selectedEvent}
      />

      {/* Replay Player Modal */}
      <ReplayPlayerModal
        isOpen={isReplayOpen}
        onClose={() => setIsReplayOpen(false)}
        replay={selectedEvent ? {
          title: selectedEvent.title,
          image: selectedEvent.image,
          location: selectedEvent.location,
          date: selectedEvent.fullDate || selectedEvent.time,
          duration: selectedEvent.duration,
          category: selectedEvent.category
        } : null}
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