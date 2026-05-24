import { useParams, useNavigate, Link } from 'react-router';
import { motion } from 'motion/react';
import { X, Ticket, Heart, Calendar, Clock, Tag, MapPin, Users, Share2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useState } from 'react';
import { PurchaseModal, PurchaseData } from '../components/PurchaseModal';
import { DigitalTicket } from '../components/DigitalTicket';
import svgPaths from "../../imports/svg-z30khrsoqy";

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

interface EventDetailData {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time?: string;
  category: string;
  categories?: string[];
  description: string;
  reference: string;
  isLive?: boolean;
  isFree?: boolean;
  price?: number;
  duration?: string;
  organizer?: string;
  capacity?: string;
}

// Mock event data - En production, ces données viendraient d'une API
const eventsData: Record<string, EventDetailData> = {
  '1': {
    id: '1',
    title: 'Yaye Padura',
    image: imgCardImg,
    location: 'Salle Savorgnon - IFC, Brazzaville',
    date: '20 Nov',
    time: '19h00',
    category: 'Concert',
    categories: ['Concert', 'Musique Live', 'Rumba'],
    description: 'Découvrez Yaye Padura dans une soirée exceptionnelle de rumba congolaise. Un événement musical incontournable qui célèbre la richesse de notre patrimoine musical avec les plus grands artistes de la scène locale. Ambiance garantie et show spectaculaire au programme !',
    reference: 'F25L11-30',
    isLive: true,
    price: 3000,
    duration: '2h30',
    organizer: 'FÉÉTI Productions',
    capacity: '500 places'
  },
  '2': {
    id: '2',
    title: 'Festival Mbote - Edition 2025',
    image: imgCardImg1,
    location: 'Stade des Martyrs, Kinshasa',
    date: '25 Nov',
    time: '14h00',
    category: 'Festival',
    categories: ['Festival', 'Musique', 'Culture'],
    description: 'Le plus grand festival de musique d\'Afrique Centrale revient pour une édition mémorable ! Découvrez les meilleurs artistes de la scène africaine dans une ambiance festive et conviviale. Un événement gratuit et ouvert à tous, célébrant la diversité culturelle et musicale.',
    reference: 'F25M01-15',
    isLive: true,
    isFree: true,
    duration: '6h00',
    organizer: 'Festival Mbote Org',
    capacity: '10,000 places'
  },
  '3': {
    id: '3',
    title: 'Concert Live Jazz',
    image: imgCardImg2,
    location: 'Chez Ntemba, Kinshasa',
    date: '28 Nov',
    time: '20h00',
    category: 'Concert',
    categories: ['Jazz', 'Concert', 'Musique Live'],
    description: 'Soirée jazz intimiste dans le cadre élégant de Chez Ntemba. Les meilleurs musiciens de jazz de la région se réunissent pour une performance acoustique exceptionnelle. Un moment de pure élégance musicale à ne pas manquer.',
    reference: 'F25J02-08',
    price: 8000,
    duration: '3h00',
    organizer: 'Jazz Club Kinshasa',
    capacity: '150 places'
  },
  '4': {
    id: '4',
    title: 'Spectacle Comédie',
    image: imgCardImg3,
    location: 'Pullman Hotel, Kinshasa',
    date: '5 Dec',
    time: '21h00',
    category: 'Comedy',
    categories: ['Comédie', 'Humour', 'Stand-up'],
    description: 'Une soirée d\'humour et de rires avec les meilleurs comédiens de la ville ! Stand-up, sketchs et improvisation au programme. Venez vous détendre et profiter d\'un moment de pure comédie dans une ambiance chaleureuse.',
    reference: 'F25C03-12',
    price: 12000,
    duration: '2h00',
    organizer: 'Comedy Club 243',
    capacity: '200 places'
  },
  '5': {
    id: '5',
    title: 'Soirée Danse Afro',
    image: imgCardImg4,
    location: 'Fleuve Congo Hotel, Kinshasa',
    date: '10 Dec',
    time: '18h00',
    category: 'Danse',
    categories: ['Danse', 'Afro', 'Workshop'],
    description: 'Participez à une soirée danse afro exceptionnelle ! Ateliers de danse, performances et DJ sets afro pour une ambiance électrique. Événement gratuit ouvert à tous les passionnés de danse et de culture africaine.',
    reference: 'F25D04-20',
    isFree: true,
    duration: '4h00',
    organizer: 'Afro Dance Collective',
    capacity: '300 places'
  },
};

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [showTicket, setShowTicket] = useState(false);

  // Get event data
  const event = id ? eventsData[id] : null;

  if (!event) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Événement non trouvé</h1>
          <button
            onClick={() => navigate('/')}
            className="text-[#CDFF71] hover:underline"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const isInFavorites = isFavorite(event.id);

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: event.id,
      title: event.title,
      image: event.image,
      location: event.location,
      date: event.date,
      time: event.time,
      category: event.category,
      isLive: event.isLive,
      isFree: event.isFree,
      price: event.price,
    });
  };

  const handlePurchaseComplete = (data: PurchaseData) => {
    setPurchaseData(data);
    setIsPurchaseModalOpen(false);
    setShowTicket(true);
  };

  const handleOpenPurchaseModal = () => {
    setIsPurchaseModalOpen(true);
    setPurchaseData({
      eventId: event.id,
      eventName: event.title,
      eventImage: event.image,
      eventLocation: event.location,
      eventDate: event.date,
      eventTime: event.time,
      eventCategory: event.category,
      isLive: event.isLive,
      isFree: event.isFree,
      price: event.price,
    });
  };

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setPurchaseData(null);
  };

  return (
    <div className="relative bg-black min-h-screen">
      {/* Header with Background Image */}
      <div className="relative h-[400px] md:h-[600px] lg:h-[807px]">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <img
            src={event.image}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black opacity-70" />
        </div>

        {/* Close Button */}
        <motion.button
          onClick={() => navigate(-1)}
          className="absolute top-[100px] md:top-[120px] right-4 md:right-8 lg:right-16 z-50 w-12 h-12 backdrop-blur-[5px] rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%)" }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-5 h-5 text-white" />
        </motion.button>

        {/* Event Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 lg:px-24 pb-8 md:pb-12 lg:pb-16">
          <div className="max-w-[1211px]">
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-['DM_Sans',sans-serif] font-bold text-[#fcc434] text-2xl md:text-3xl lg:text-4xl leading-tight mb-6 md:mb-8"
            >
              {event.title}
            </motion.h1>

            {/* Categories */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-wrap gap-4 md:gap-6 mb-6 md:mb-8"
            >
              {event.categories?.map((cat, index) => (
                <div
                  key={index}
                  className="border border-white rounded-sm px-3 py-1"
                >
                  <span className="font-['Poppins',sans-serif] font-semibold text-white text-sm md:text-base">
                    {cat}
                  </span>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="font-['Poppins',sans-serif] text-white text-base md:text-lg max-w-[597px] mb-8 md:mb-10 leading-relaxed"
            >
              {event.description}
            </motion.p>

            {/* Event Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center gap-6 md:gap-8 mb-8 md:mb-10"
            >
              {/* Date */}
              <div className="flex flex-col">
                <span className="font-['Inter',sans-serif] font-medium text-white/60 text-sm md:text-base mb-2">
                  Date
                </span>
                <span className="font-['Inter',sans-serif] font-medium text-white/85 text-lg md:text-xl">
                  {event.date}
                </span>
              </div>

              {/* Divider */}
              <div className="h-16 md:h-[107px] w-px bg-white" />

              {/* Time */}
              <div className="flex flex-col">
                <span className="font-['Inter',sans-serif] font-medium text-white/60 text-sm md:text-base mb-2">
                  Heure
                </span>
                <span className="font-['Inter',sans-serif] font-medium text-white/85 text-lg md:text-xl">
                  {event.time || '15:05'}
                </span>
              </div>

              {/* Divider */}
              <div className="h-16 md:h-[107px] w-px bg-white" />

              {/* Reference */}
              <div className="flex flex-col">
                <span className="font-['Inter',sans-serif] font-medium text-white/60 text-sm md:text-base mb-2">
                  Référence
                </span>
                <span className="font-['Inter',sans-serif] font-medium text-white/85 text-lg md:text-xl">
                  {event.reference}
                </span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 md:gap-6"
            >
              {/* Buy Button */}
              {!event.isFree && (
                <motion.button
                  onClick={() => setIsPurchaseModalOpen(true)}
                  className="bg-[#de0035] hover:bg-[#de0035]/90 flex items-center gap-3 px-6 md:px-8 py-3 rounded-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Ticket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <span className="font-['SF_Pro',sans-serif] font-normal text-white text-base md:text-lg">
                    Achetez
                  </span>
                </motion.button>
              )}

              {/* View Announcement Button */}
              <motion.button
                className="bg-[#de0035] hover:bg-[#de0035]/90 flex items-center gap-3 px-6 md:px-8 py-3 rounded-sm transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Ticket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="font-['SF_Pro',sans-serif] font-normal text-white text-base md:text-lg">
                  Voir l'annonce
                </span>
              </motion.button>

              {/* Favorite Button */}
              <motion.button
                onClick={handleToggleFavorite}
                className="w-12 h-12 flex items-center justify-center hover:scale-110 transition-transform"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Heart
                  className={`w-7 h-7 md:w-8 md:h-8 transition-colors ${
                    isInFavorites ? 'fill-white text-white' : 'text-white'
                  }`}
                />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Additional Event Details Section */}
      <div className="bg-[#0D0D0D] px-4 md:px-8 lg:px-24 py-12 md:py-16 lg:py-20">
        <div className="max-w-[1211px]">
          <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl md:text-2xl mb-8">
            Détails de l'événement
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Location */}
            <div className="bg-white/5 rounded-[12px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-[#CDFF71]" />
                <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-sm">
                  Lieu
                </span>
              </div>
              <p className="font-['Inter',sans-serif] font-medium text-white text-base">
                {event.location}
              </p>
            </div>

            {/* Duration */}
            {event.duration && (
              <div className="bg-white/5 rounded-[12px] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-[#CDFF71]" />
                  <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-sm">
                    Durée
                  </span>
                </div>
                <p className="font-['Inter',sans-serif] font-medium text-white text-base">
                  {event.duration}
                </p>
              </div>
            )}

            {/* Price */}
            <div className="bg-white/5 rounded-[12px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <Tag className="w-5 h-5 text-[#CDFF71]" />
                <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-sm">
                  Prix
                </span>
              </div>
              <p className="font-['Inter',sans-serif] font-medium text-white text-base">
                {event.isFree ? 'GRATUIT' : `${event.price?.toLocaleString()} FCFA`}
              </p>
            </div>

            {/* Organizer */}
            {event.organizer && (
              <div className="bg-white/5 rounded-[12px] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-[#CDFF71]" />
                  <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-sm">
                    Organisateur
                  </span>
                </div>
                <p className="font-['Inter',sans-serif] font-medium text-white text-base">
                  {event.organizer}
                </p>
              </div>
            )}

            {/* Capacity */}
            {event.capacity && (
              <div className="bg-white/5 rounded-[12px] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-[#CDFF71]" />
                  <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-sm">
                    Capacité
                  </span>
                </div>
                <p className="font-['Inter',sans-serif] font-medium text-white text-base">
                  {event.capacity}
                </p>
              </div>
            )}

            {/* Share */}
            <div className="bg-white/5 rounded-[12px] p-6">
              <div className="flex items-center gap-3 mb-3">
                <Share2 className="w-5 h-5 text-[#DE0035]" />
                <span className="font-['Inter',sans-serif] font-semibold text-white/60 text-sm">
                  Partager
                </span>
              </div>
              <button className="font-['Inter',sans-serif] font-medium text-[#DE0035] text-base hover:underline">
                Partager cet événement
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onPurchaseComplete={handlePurchaseComplete}
        event={{
          id: event.id,
          title: event.title,
          image: event.image,
          location: event.location,
          date: event.date,
          time: event.time,
          reference: event.reference,
          price: event.price,
        }}
      />

      {/* Digital Ticket */}
      <DigitalTicket
        isOpen={showTicket}
        onClose={() => setShowTicket(false)}
        purchaseData={purchaseData}
      />
    </div>
  );
}