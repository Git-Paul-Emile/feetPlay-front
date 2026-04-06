import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SearchBar } from '../components/SearchBar';
import { SortFilter, SortOption } from '../components/SortFilter';
import { CalendarView } from '../components/CalendarView';
import { TimelineView } from '../components/TimelineView';
import { CalendarEventCard, CalendarEventCardProps } from '../components/CalendarEventCard';
import { EventPlayerModal } from '../components/EventPlayerModal';
import { ReplayPlayerModal } from '../components/ReplayPlayerModal';
import { Calendar, List, Clock } from 'lucide-react';
import EventsAPI from '../services/api/EventsAPI';

type ViewMode = 'calendar' | 'timeline' | 'list';
type AgendaEvent = CalendarEventCardProps & { fullDate: string };

function mapToAgendaEvent(e: {
  id: string;
  image: string;
  title: string;
  channelName: string;
  location?: string;
  time: string;
  duration: string;
  category: string;
  isLive: boolean;
  isFree: boolean;
  price?: number;
  date: string;
}): AgendaEvent {
  return {
    id: e.id,
    image: e.image,
    title: e.title,
    location: e.location ?? e.channelName,
    time: e.time,
    duration: e.duration,
    category: e.category,
    isLive: e.isLive,
    isFree: e.isFree,
    price: e.price,
    fullDate: e.date,
  };
}

export function Agenda() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEventCardProps | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [isReplayOpen, setIsReplayOpen] = useState(false);
  const [allEvents, setAllEvents] = useState<AgendaEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    EventsAPI.getAll()
      .then(events => setAllEvents(events.map(mapToAgendaEvent)))
      .catch(() => setAllEvents([]))
      .finally(() => setLoading(false));
  }, []);

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

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-2 border-[#CDFF71] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Content */}
      {!loading && (
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
      )}

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
          date: (selectedEvent as AgendaEvent).fullDate || selectedEvent.time,
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
