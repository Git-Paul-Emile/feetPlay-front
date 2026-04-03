import { motion } from 'motion/react';
import { CalendarEventCard, CalendarEventCardProps } from './CalendarEventCard';

interface TimelineViewProps {
  events: CalendarEventCardProps[];
  selectedDate: Date;
  onEventPlay: (event: CalendarEventCardProps) => void;
}

export function TimelineView({ events, selectedDate, onEventPlay }: TimelineViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const formatDate = (date: Date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = [
      'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
      'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
    ];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const getEventsForHour = (hour: number) => {
    return events.filter(event => {
      const eventHour = parseInt(event.time.split('h')[0]);
      return eventHour === hour;
    });
  };

  const getCurrentTimePosition = () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate.toDateString() === today.toDateString()) {
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const position = (hours * 60 + minutes) / (24 * 60) * 100;
      return position;
    }
    return null;
  };

  const currentTimePosition = getCurrentTimePosition();

  return (
    <div className="bg-[#0D0D0D] border border-white/10 rounded-[16px] p-4 md:p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl mb-1">
          Timeline du jour
        </h3>
        <p className="font-['DM_Sans',sans-serif] text-white/60 text-[14px]">
          {formatDate(selectedDate)}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Current Time Indicator */}
        {currentTimePosition !== null && (
          <motion.div
            className="absolute left-0 right-0 z-20 flex items-center"
            style={{ top: `${currentTimePosition}%` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="flex items-center gap-2 w-full">
              <motion.div
                className="w-3 h-3 bg-[#DE0035] rounded-full"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
              <div className="flex-1 h-[2px] bg-[#DE0035]" />
              <span className="font-['Inter',sans-serif] font-semibold text-[#DE0035] text-[12px] whitespace-nowrap">
                {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        )}

        {/* Hours Grid */}
        <div className="space-y-0">
          {hours.map((hour) => {
            const hourEvents = getEventsForHour(hour);
            const hasEvents = hourEvents.length > 0;

            return (
              <div
                key={hour}
                className="relative min-h-[80px] border-b border-white/5 last:border-b-0"
              >
                <div className="flex gap-4">
                  {/* Time Label */}
                  <div className="w-16 flex-shrink-0 pt-2">
                    <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-[13px]">
                      {hour.toString().padStart(2, '0')}:00
                    </span>
                  </div>

                  {/* Events Column */}
                  <div className="flex-1 py-2">
                    {hasEvents ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {hourEvents.map((event, index) => (
                          <CalendarEventCard
                            key={`${event.id}-${index}`}
                            {...event}
                            onPlay={() => onEventPlay(event)}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="h-full flex items-center">
                        <span className="font-['DM_Sans',sans-serif] text-white/20 text-[12px] italic">
                          Aucun événement
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hour Line */}
                <div className="absolute left-16 top-0 bottom-0 w-[1px] bg-white/5" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center gap-6 text-[13px]">
          <div>
            <span className="text-white/60">Total événements : </span>
            <span className="font-bold text-[#CDFF71]">{events.length}</span>
          </div>
          <div>
            <span className="text-white/60">En live : </span>
            <span className="font-bold text-[#DE0035]">
              {events.filter(e => e.isLive).length}
            </span>
          </div>
          <div>
            <span className="text-white/60">Gratuits : </span>
            <span className="font-bold text-white">
              {events.filter(e => e.isFree).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
