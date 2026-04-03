import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import svgPaths from "../../imports/svg-s9aj5k89tw";
import imgRectangle42 from "figma:asset/31a63f55d67c21dfc7dd601b567f5841965a32bb.png";

// Banner slides data
const replaySlides = [
  {
    id: 1,
    image: imgRectangle42,
    title: 'Disponible en Replay actuellement !',
    subtitle: 'CONCERT LOREM IPSUM | SAM 19.09.25 |',
    location: 'Accor arena paris'
  },
  {
    id: 2,
    image: imgRectangle42,
    title: 'Disponible en Replay actuellement !',
    subtitle: 'CONCERT ORKIDA POUR | DIM 20.10.25 |',
    location: 'Stade de Kinshasa'
  },
  {
    id: 3,
    image: imgRectangle42,
    title: 'Disponible en Replay actuellement !',
    subtitle: 'FESTIVAL AFROBEAT | VEN 25.11.25 |',
    location: 'Palais du Peuple'
  },
  {
    id: 4,
    image: imgRectangle42,
    title: 'Disponible en Replay actuellement !',
    subtitle: 'CONCERT LIVE JAZZ | SAM 05.12.25 |',
    location: 'Centre Culturel'
  }
];

export function ReplayBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % replaySlides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentData = replaySlides[currentSlide];

  return (
    <div className="relative w-full h-[200px] md:h-[240px] lg:h-[280px] xl:h-[314px] overflow-hidden rounded-[20px] md:rounded-[25px] lg:rounded-[30px]">
      {/* Background Image */}
      <motion.img
        key={currentSlide}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        src={currentData.image}
        alt={currentData.title}
        className="absolute inset-0 w-full h-full object-cover rounded-[20px] md:rounded-[25px] lg:rounded-[30px]"
      />

      {/* Gradient Overlay */}
      <div 
        className="absolute inset-0 rounded-[20px] md:rounded-[25px] lg:rounded-[30px] opacity-72 mix-blend-multiply"
        style={{
          background: 'linear-gradient(90deg, #03033b 20.325%, #16bda0 45.393%, rgba(0,0,0,0) 70.461%)'
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex items-center px-4 md:px-6 lg:px-8 xl:px-12">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col gap-3 md:gap-4 lg:gap-5 max-w-[60%] md:max-w-[55%]"
        >
          {/* Title */}
          <div className="flex flex-col">
            <h2 className="font-['Inter',sans-serif] text-white text-[20px] md:text-[32px] lg:text-[44px] xl:text-[60px] leading-[1.05] tracking-[-0.02em]">
              <span className="font-medium">Disponible </span>
              <span className="font-medium">en </span>
              <span className="font-bold">Replay</span>
              <span className="font-medium"> actuellement !</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="font-['Inter',sans-serif] font-normal text-white text-[12px] md:text-[18px] lg:text-[24px] xl:text-[30px] leading-normal tracking-[-0.04em]">
            {currentData.subtitle}
          </p>

          {/* Location */}
          <div className="flex items-center gap-2 md:gap-3 lg:gap-[17px]">
            {/* Location Icon */}
            <div className="w-[14px] h-[14px] md:w-[18px] md:h-[18px] lg:w-[22px] lg:h-[22px] xl:w-[24px] xl:h-[24px] flex-shrink-0">
              <svg className="w-full h-full" fill="none" viewBox="0 0 23.2857 23.2857">
                <path d={svgPaths.pe9c7970} stroke="#16BDA0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p1638e680} stroke="#16BDA0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                <path d={svgPaths.p2d392000} stroke="#16BDA0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="font-['Inter',sans-serif] font-normal text-[#16bea1] text-[10px] md:text-[14px] lg:text-[17px] xl:text-[20px] tracking-[-0.04em]">
              {currentData.location}
            </p>
          </div>
        </motion.div>

        {/* Play Button */}
        <div className="absolute right-4 md:right-6 lg:right-12 xl:right-16 top-1/2 -translate-y-1/2 flex items-center gap-2 md:gap-3">
          {/* Play Icon Circle */}
          <motion.button
            className="relative w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-[#de0035] flex items-center justify-center hover:scale-110 transition-transform"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <svg className="w-3 h-4 md:w-4 md:h-5 lg:w-[16px] lg:h-[19px]" fill="none" viewBox="0 0 15.8974 18.5441">
              <path d={svgPaths.p3b3b0570} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
            </svg>
          </motion.button>

          {/* Text Button */}
          <motion.button
            className="hidden md:flex items-center justify-center bg-white px-3 py-2 md:px-4 md:py-2.5 hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="font-['Inter',sans-serif] font-medium text-black text-[12px] md:text-[13px] lg:text-[14px] leading-tight whitespace-nowrap">
              Voir la vidéo
            </span>
          </motion.button>
        </div>

        {/* Slider Toggles - Square */}
        <div className="absolute right-2 md:right-4 lg:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:gap-2.5 lg:gap-3">
          {replaySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 bg-[#292929] transition-all ${
                index === currentSlide ? 'border border-[#de0035]' : ''
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}