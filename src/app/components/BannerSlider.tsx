import { useRef } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight, Play, MapPin, Calendar, Clock } from 'lucide-react';

interface BannerContent {
  id: number;
  type: 'replay' | 'live' | 'upcoming' | 'promo';
  title: string;
  subtitle: string;
  description: string;
  location?: string;
  date?: string;
  time?: string;
  image: string;
  ctaText: string;
  ctaAction: () => void;
  gradient: string;
}

interface BannerSliderProps {
  banners: BannerContent[];
}

export function BannerSlider({ banners }: BannerSliderProps) {
  const sliderRef = useRef<Slider>(null);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    pauseOnHover: true,
    fade: true,
    cssEase: 'ease-in-out',
  };

  const renderBanner = (banner: BannerContent) => {
    return (
      <div key={banner.id} className="relative h-[500px] rounded-[30px] overflow-hidden">
        {/* Image de fond */}
        <div className="absolute inset-0">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 ${banner.gradient} mix-blend-multiply opacity-80`}
        />

        {/* Contenu */}
        <div className="absolute inset-0 flex flex-col justify-center px-12 lg:px-20">
          <div className="max-w-2xl">
            {/* Badge de type */}
            <div className="mb-4">
              {banner.type === 'live' && (
                <span className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  EN DIRECT
                </span>
              )}
              {banner.type === 'replay' && (
                <span className="inline-flex items-center gap-2 bg-[#16BDA0] text-white px-4 py-2 rounded-full text-sm font-semibold">
                  <Play className="w-4 h-4" />
                  REPLAY
                </span>
              )}
              {banner.type === 'upcoming' && (
                <span className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  <Calendar className="w-4 h-4" />
                  À VENIR
                </span>
              )}
              {banner.type === 'promo' && (
                <span className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  ⭐ PROMOTION
                </span>
              )}
            </div>

            {/* Titre */}
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              {banner.title}
            </h2>

            {/* Sous-titre */}
            <p className="text-2xl lg:text-3xl text-white mb-4 font-medium">
              {banner.subtitle}
            </p>

            {/* Description */}
            <p className="text-lg text-white/90 mb-6">
              {banner.description}
            </p>

            {/* Informations supplémentaires */}
            <div className="flex flex-wrap gap-4 mb-8 text-white">
              {banner.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#16BDA0]" />
                  <span className="text-lg">{banner.location}</span>
                </div>
              )}
              {banner.date && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-[#16BDA0]" />
                  <span className="text-lg">{banner.date}</span>
                </div>
              )}
              {banner.time && (
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#16BDA0]" />
                  <span className="text-lg">{banner.time}</span>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <button
              onClick={banner.ctaAction}
              className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-md font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              {banner.type === 'replay' || banner.type === 'live' ? (
                <Play className="w-5 h-5 fill-current" />
              ) : null}
              {banner.ctaText}
            </button>
          </div>
        </div>

        {/* Indicateurs de slide (petits carrés) */}
        <div className="absolute bottom-8 right-8 flex flex-col gap-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => sliderRef.current?.slickGoTo(index)}
              className={`w-7 h-7 border-2 transition-all ${
                index === banner.id - 1
                  ? 'bg-[#DE0035] border-[#DE0035]'
                  : 'bg-[#292929] border-transparent hover:border-white/50'
              }`}
              aria-label={`Aller au slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="relative mb-12">
      {/* Navigation Arrows */}
      <button
        onClick={() => sliderRef.current?.slickPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        aria-label="Slide précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={() => sliderRef.current?.slickNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
        aria-label="Slide suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slider */}
      <Slider ref={sliderRef} {...settings}>
        {banners.map(renderBanner)}
      </Slider>

      <style>{`
        .slick-dots {
          bottom: 30px;
          left: 50px;
          text-align: left;
          width: auto;
        }
        .slick-dots li {
          margin: 0 4px;
          width: 40px;
          height: 4px;
        }
        .slick-dots li button {
          width: 100%;
          height: 4px;
          padding: 0;
        }
        .slick-dots li button:before {
          content: '';
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          border-radius: 2px;
        }
        .slick-dots li.slick-active button:before {
          background: #16BDA0;
          opacity: 1;
        }
      `}</style>
    </div>
  );
}
