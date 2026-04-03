import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  eventCount: number;
  hasLive: boolean;
}

interface CalendarViewProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: 'prev' | 'next') => void;
  selectedDate: Date;
  events: any[];
}

export function CalendarView({ 
  currentDate, 
  onDateSelect, 
  onMonthChange, 
  selectedDate,
  events 
}: CalendarViewProps) {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  
  const dayNames = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    const firstDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const daysInMonth = lastDay.getDate();
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        eventCount: getEventCountForDate(date),
        hasLive: hasLiveEventOnDate(date),
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const isToday = date.getTime() === today.getTime();
      days.push({
        date,
        isCurrentMonth: true,
        isToday,
        eventCount: getEventCountForDate(date),
        hasLive: hasLiveEventOnDate(date),
      });
    }

    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: false,
        eventCount: getEventCountForDate(date),
        hasLive: hasLiveEventOnDate(date),
      });
    }

    return days;
  };

  const getEventCountForDate = (date: Date): number => {
    return events.filter(event => {
      const eventDate = new Date(event.fullDate);
      return eventDate.toDateString() === date.toDateString();
    }).length;
  };

  const hasLiveEventOnDate = (date: Date): boolean => {
    return events.some(event => {
      const eventDate = new Date(event.fullDate);
      return eventDate.toDateString() === date.toDateString() && event.isLive;
    });
  };

  const isSelectedDate = (date: Date): boolean => {
    return date.toDateString() === selectedDate.toDateString();
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-[#0D0D0D] border border-white/10 rounded-[16px] p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        
        <div className="flex items-center gap-2">
          <motion.button
            onClick={() => onMonthChange('prev')}
            className="w-10 h-10 backdrop-blur-[5px] rounded-[12px] flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronLeft className="w-5 h-5 text-white" />
          </motion.button>
          <motion.button
            onClick={() => onMonthChange('next')}
            className="w-10 h-10 backdrop-blur-[5px] rounded-[12px] flex items-center justify-center hover:bg-white/10 transition-colors"
            style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ChevronRight className="w-5 h-5 text-white" />
          </motion.button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-3">
        {dayNames.map((day) => (
          <div key={day} className="text-center">
            <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-[13px]">
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {calendarDays.map((day, index) => {
          const isSelected = isSelectedDate(day.date);
          
          return (
            <motion.button
              key={index}
              onClick={() => day.isCurrentMonth && onDateSelect(day.date)}
              className={`
                relative aspect-square rounded-[8px] p-2 transition-all
                ${day.isCurrentMonth ? 'bg-white/5 hover:bg-white/10' : 'bg-transparent opacity-30'}
                ${isSelected ? 'bg-[#DE0035] hover:bg-[#DE0035]' : ''}
                ${day.isToday && !isSelected ? 'border-2 border-[#CDFF71]' : 'border border-white/10'}
              `}
              whileHover={day.isCurrentMonth ? { scale: 1.05 } : {}}
              whileTap={day.isCurrentMonth ? { scale: 0.95 } : {}}
              disabled={!day.isCurrentMonth}
            >
              {/* Date Number */}
              <div className={`
                font-['Inter',sans-serif] font-semibold text-[14px] mb-1
                ${isSelected ? 'text-white' : day.isToday ? 'text-[#CDFF71]' : 'text-white/90'}
              `}>
                {day.date.getDate()}
              </div>

              {/* Event Indicators */}
              {day.eventCount > 0 && (
                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                  {day.hasLive && (
                    <div className="w-1.5 h-1.5 bg-[#DE0035] rounded-full" />
                  )}
                  {day.eventCount > 1 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#CDFF71]'}`} />
                  )}
                  {day.eventCount > 2 && (
                    <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-white/60'}`} />
                  )}
                </div>
              )}

              {/* Event Count Badge */}
              {day.eventCount > 0 && (
                <div className="absolute top-1 right-1">
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold
                    ${isSelected ? 'bg-white text-[#DE0035]' : 'bg-[#CDFF71]/20 text-[#CDFF71]'}
                  `}>
                    {day.eventCount}
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap gap-4 text-[11px]">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-[#CDFF71] rounded" />
          <span className="text-white/70">Aujourd'hui</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#DE0035] rounded" />
          <span className="text-white/70">Date sélectionnée</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#DE0035] rounded-full" />
          <span className="text-white/70">Événement live</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#CDFF71] rounded-full" />
          <span className="text-white/70">Événement programmé</span>
        </div>
      </div>
    </div>
  );
}
