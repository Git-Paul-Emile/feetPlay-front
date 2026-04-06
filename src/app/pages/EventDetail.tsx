import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { X, Ticket, Heart, Clock, Tag, MapPin, Users, Share2, ExternalLink } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useState, useEffect } from 'react';
import { PurchaseModal, PurchaseData } from '../components/PurchaseModal';
import { DigitalTicket } from '../components/DigitalTicket';
import svgPaths from "../../imports/svg-z30khrsoqy";
import EventsAPI from '../services/api/EventsAPI';
import Feeti2EventsAPI, { type Feeti2Event } from '../services/api/Feeti2EventsAPI';
import { getPreferredFeeti2BaseUrl } from '../utils/serviceConfig';

const FEETI2_URL = getPreferredFeeti2BaseUrl();


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
  source?: 'feetiplay' | 'feeti2';
  feeti2EventId?: string;
}


function mapFeeti2ToDetail(e: Feeti2Event): EventDetailData {
  return {
    id: e.id,
    title: e.title,
    image: e.image,
    location: e.country ?? 'En ligne',
    date: e.date,
    time: e.time,
    category: e.category,
    categories: [e.category],
    description: e.description,
    reference: `FP-${e.id.slice(-6).toUpperCase()}`,
    isLive: e.isLive,
    isFree: e.isFree,
    price: e.price,
    duration: e.duration,
    organizer: e.channelName,
    source: 'feeti2',
    feeti2EventId: e.id,
  };
}

export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [apiEvent, setApiEvent] = useState<EventDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  // Essaie de charger l'événement depuis l'API (feetiPlay puis feeti2)
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const load = async () => {
      try {
        // 1. Essai depuis feetiPlay
        const fpEvent = await EventsAPI.getById(id);
        if (fpEvent) {
          setApiEvent({
            id: fpEvent.id,
            title: fpEvent.title,
            image: fpEvent.image,
            location: fpEvent.location ?? fpEvent.channelName,
            date: fpEvent.date,
            time: fpEvent.time,
            category: fpEvent.category,
            categories: fpEvent.tags?.length ? fpEvent.tags : [fpEvent.category],
            description: fpEvent.description,
            reference: `FP-${fpEvent.id.slice(-6).toUpperCase()}`,
            isLive: fpEvent.isLive,
            isFree: fpEvent.isFree,
            price: fpEvent.price,
            duration: fpEvent.duration,
            organizer: fpEvent.channelName,
            source: 'feetiplay',
          });
          return;
        }
      } catch { /* non trouvé sur feetiPlay */ }
      try {
        // 2. Essai depuis feeti2 via intégration
        const f2Events = await Feeti2EventsAPI.getStreamingEvents();
        const found = f2Events.find(e => e.id === id);
        if (found) setApiEvent(mapFeeti2ToDetail(found));
      } catch { /* non trouvé non plus */ }
    };
    load().finally(() => setLoading(false));
  }, [id]);

  // Priorité : API > mock
  const event = apiEvent;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#CDFF71] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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

              {/* Lien vers feeti2 si l'événement vient de feeti2 */}
              {event.source === 'feeti2' && event.feeti2EventId && (
                <motion.a
                  href={`${FEETI2_URL}/events/${event.feeti2EventId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#4f46e5] hover:bg-[#4f46e5]/90 flex items-center gap-3 px-6 md:px-8 py-3 rounded-sm transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ExternalLink className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  <span className="font-['SF_Pro',sans-serif] font-normal text-white text-base md:text-lg">
                    Acheter sur Féeti
                  </span>
                </motion.a>
              )}

              {/* Bouton voir annonce (événements feetiPlay uniquement) */}
              {event.source !== 'feeti2' && (
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
              )}

              {/* Favorite Button — feeti2 events can't be favorited in FeetiPlay */}
              {event.source !== 'feeti2' && (
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
              )}
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
