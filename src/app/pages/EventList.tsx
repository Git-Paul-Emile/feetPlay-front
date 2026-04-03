import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import svgPaths from "../../imports/svg-z30khrsoqy";

// Import event images
import imgImage14 from "figma:asset/8e5f3463a14418977bae5067abd0af0b3a184d6f.png";
import imgImage15 from "figma:asset/13c8f478c4ac182bcae3355ddc4fb0742396f2b3.png";
import imgImage16 from "figma:asset/af4f8497cd796b01f6c149bd2d388e5f991489ff.png";
import imgImage17 from "figma:asset/9b779636dff8669a8ebe0146669ac311e330cc4e.png";
import imgImage18 from "figma:asset/6a8c591a36a76b0ae46f649c9870fe44bce470e7.png";
import imgImage19 from "figma:asset/2bfa3e53c40b7bc1dddd06c6eaef1de790eeeb00.png";

const eventsData = [
  {
    image: imgImage14,
    title: 'Dadju- concert Montreal',
    location: 'Salle Savorgnon -IFC',
    date: '20.12.2025',
    isFree: true,
    hasStreaming: true,
  },
  {
    image: imgImage15,
    title: 'Dadju- concert Montreal',
    location: 'Salle Savorgnon -IFC',
    date: '20.12.2025',
    isLive: true,
    isFree: true,
    hasStreaming: true,
  },
  {
    image: imgImage16,
    title: 'Dadju- concert Montreal',
    location: 'Salle Savorgnon -IFC',
    date: '20.12.2025',
    isFree: true,
    hasStreaming: true,
  },
  {
    image: imgImage17,
    title: 'Dadju- concert Montreal',
    location: 'Salle Savorgnon -IFC',
    date: '20.12.2025',
    isFree: true,
    hasStreaming: true,
  },
  {
    image: imgImage18,
    title: 'Dadju- concert Montreal',
    location: 'Salle Savorgnon -IFC',
    date: '20.12.2025',
    isFree: true,
    hasStreaming: true,
  },
  {
    image: imgImage19,
    title: 'Dadju- concert Montreal',
    location: 'Salle Savorgnon -IFC',
    date: '20.12.2025',
    isFree: true,
    hasStreaming: true,
  },
];

export function EventList() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -500 : 500;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-[#080808] min-h-screen py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl md:text-3xl lg:text-4xl xl:text-[36px] leading-tight">
            Tous les événements
          </h1>
          <div className="flex items-center gap-3 md:gap-6">
            <button 
              onClick={() => scrollCarousel('left')}
              className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center rotate-180 hover:scale-110 hover:bg-white/10 active:scale-95 transition-all" 
              style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
              aria-label="Précédent"
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

        {/* Event Cards - Horizontal Scroll */}
        <div 
          ref={scrollRef}
          className="flex gap-4 md:gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth mb-16"
        >
          {eventsData.map((event, index) => (
            <div key={index} className="flex-shrink-0 w-[280px] sm:w-[300px] md:w-[309px]">
              <EventCard
                image={event.image}
                title={event.title}
                location={event.location}
                date={event.date}
                isFree={event.isFree}
                hasStreaming={event.hasStreaming}
                isLive={event.isLive}
              />
            </div>
          ))}
        </div>

        {/* Event Cards - Grid Layout */}
        <div className="mt-16">
          <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl lg:text-3xl mb-8">
            Événements récents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {eventsData.map((event, index) => (
              <EventCard
                key={index}
                image={event.image}
                title={event.title}
                location={event.location}
                date={event.date}
                isFree={event.isFree}
                hasStreaming={event.hasStreaming}
                isLive={event.isLive}
              />
            ))}
          </div>
        </div>
      </div>

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