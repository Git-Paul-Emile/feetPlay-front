import { useRef, useState, useEffect, type CSSProperties } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PromoContent {
  id: number;
  icon: 'star' | 'gift' | 'zap';
  title: string;
  discount: string;
  description: string;
  validUntil: string;
  backgroundColor: string;
  accentColor: string;
  ctaText: string;
  ctaAction: () => void;
}

interface PromoSliderProps {
  promos: PromoContent[];
}

// Nombre de cartes visibles selon la largeur de l'écran.
// On pilote `slidesToShow` directement via un état React plutôt que via
// l'option `responsive` de react-slick, dont la détection de breakpoint
// s'avère peu fiable (cartes tassées sur mobile).
function getSlidesToShow(width: number): number {
  if (width < 768) return 1;   // mobile
  if (width < 1280) return 2;  // tablette
  return 3;                    // desktop
}

// Les couleurs des promos viennent de la base (anciennes valeurs en dégradé
// « bg-gradient-to-br from-[#16BDA0] to-[#0d9488] ») : on n'en garde que la
// première couleur, appliquée en aplat.
function solidBackground(value: string | undefined): { className: string; style?: CSSProperties } {
  if (!value) return { className: 'bg-[#1a1a1a]' };
  if (!/gradient|linear-to|from-/.test(value)) return { className: value };
  const hex = value.match(/from-\[(#[0-9a-fA-F]{3,8})\]/)?.[1];
  const rest = value
    .split(/\s+/)
    .filter((t) => !/^(bg-(gradient|linear)-to-|from-|via-|to-)/.test(t))
    .join(' ');
  return { className: rest, style: { backgroundColor: hex ?? '#1a1a1a' } };
}

export function PromoSlider({ promos }: PromoSliderProps) {
  const sliderRef = useRef<Slider>(null);

  const [slidesToShow, setSlidesToShow] = useState<number>(() =>
    typeof window !== 'undefined' ? getSlidesToShow(window.innerWidth) : 1,
  );

  useEffect(() => {
    const handleResize = () => setSlidesToShow(getSlidesToShow(window.innerWidth));
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // On ne montre jamais plus de cartes qu'il n'y en a, et l'infini n'a de sens
  // que s'il y a plus de cartes que de slots visibles.
  const visibleSlides = Math.max(1, Math.min(slidesToShow, promos.length));

  const settings = {
    dots: true,
    infinite: promos.length > visibleSlides,
    speed: 500,
    slidesToShow: visibleSlides,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    pauseOnHover: true,
  };

  const renderPromo = (promo: PromoContent) => {
    const background = solidBackground(promo.backgroundColor);
    return (
      <div key={promo.id} className="px-3 py-2">
        <div className="group relative">

          <div style={background.style} className={`relative ${background.className} rounded-3xl p-4 sm:p-5 md:p-6 min-h-[280px] sm:min-h-[300px] md:min-h-[320px] flex flex-col border border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300 transform group-hover:scale-[1.02] group-hover:border-transparent`}>

            {/* Badge de réduction - redesigné */}
            <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 z-10">
              <div className="relative">
                <div className={`${promo.accentColor} bg-white/30 backdrop-blur-md px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-black text-xl sm:text-2xl shadow-2xl border-2 border-white/30 transform rotate-12 group-hover:rotate-6 transition-transform duration-300`}>
                  {promo.discount}
                </div>
              </div>
            </div>

            {/* Contenu - flex-1 pour pousser le footer en bas */}
            <div className="flex-1 relative z-10 mb-3 sm:mb-4 min-h-0">
              <h3 className="text-white text-lg sm:text-xl md:text-2xl font-black mb-1.5 sm:mb-2 leading-tight group-hover:text-[#CDFF71] transition-colors duration-300">
                {promo.title}
              </h3>
              <p className="text-white/90 text-xs sm:text-sm leading-relaxed line-clamp-2">
                {promo.description}
              </p>
            </div>

            {/* Footer avec validité et CTA - toujours en bas */}
            <div className="relative z-10 space-y-2 sm:space-y-3 mt-auto">
              {/* Barre de validité stylisée */}
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg border border-white/10">
                <div className="w-1.5 h-1.5 bg-[#CDFF71] rounded-full animate-pulse flex-shrink-0"></div>
                <p className="text-white/80 text-[10px] sm:text-xs font-medium truncate">
                  Jusqu'au {promo.validUntil}
                </p>
              </div>

              {/* CTA Button amélioré */}
              <button
                onClick={promo.ctaAction}
                className="relative w-full bg-white text-black font-bold py-2.5 sm:py-3 rounded-lg sm:rounded-xl hover:shadow-2xl hover:shadow-white/50 transition-all duration-300 overflow-hidden group/btn text-sm sm:text-base"
              >
                <span className="relative z-10 flex items-center justify-center gap-1.5 sm:gap-2">
                  {promo.ctaText}
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover/btn:translate-x-1 transition-transform flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-[#CDFF71] opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Titre de la section - amélioré */}
      <div className="flex items-start sm:items-center justify-between mb-6 sm:mb-8 md:mb-10 gap-3">
        <div className="flex-1 min-w-0">
          <h2 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black mb-1 sm:mb-2 leading-tight">
            Offres spéciales
          </h2>
          <p className="text-white/60 text-xs sm:text-sm md:text-base truncate">Ne manquez pas ces promotions exceptionnelles</p>
        </div>
        <div className="flex gap-2 sm:gap-3 flex-shrink-0">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="group p-2 sm:p-3 bg-white/10 hover:bg-[#16BDA0] backdrop-blur-sm border border-white/20 hover:border-[#16BDA0] text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg"
            aria-label="Promo précédente"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="group p-2 sm:p-3 bg-white/10 hover:bg-[#16BDA0] backdrop-blur-sm border border-white/20 hover:border-[#16BDA0] text-white rounded-lg sm:rounded-xl transition-all duration-300 shadow-lg"
            aria-label="Promo suivante"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {promos.map(renderPromo)}
      </Slider>

      <style>{`
        .slick-dots {
          bottom: -40px;
          display: flex !important;
          justify-content: center;
          gap: 6px;
        }
        @media (min-width: 640px) {
          .slick-dots {
            bottom: -50px;
            gap: 8px;
          }
        }
        .slick-dots li {
          margin: 0;
          width: auto;
        }
        .slick-dots li button {
          width: 10px;
          height: 10px;
          padding: 0;
        }
        @media (min-width: 640px) {
          .slick-dots li button {
            width: 12px;
            height: 12px;
          }
        }
        .slick-dots li button:before {
          content: '';
          width: 10px;
          height: 10px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          opacity: 1;
          transition: all 0.3s ease;
        }
        @media (min-width: 640px) {
          .slick-dots li button:before {
            width: 12px;
            height: 12px;
          }
        }
        .slick-dots li.slick-active button:before {
          background: #16BDA0;
          width: 24px;
          border-radius: 5px;
        }
        @media (min-width: 640px) {
          .slick-dots li.slick-active button:before {
            width: 32px;
            border-radius: 6px;
          }
        }
        .slick-dots li:hover button:before {
          background: rgba(205, 255, 113, 0.5);
          transform: scale(1.2);
        }

        @keyframes tilt {
          0%, 100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(1deg);
          }
          75% {
            transform: rotate(-1deg);
          }
        }

        .animate-tilt {
          animation: tilt 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
