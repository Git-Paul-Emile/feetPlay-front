import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { X, Ticket, Heart, Calendar, Clock, Tag, MapPin, Users, Share2 } from 'lucide-react';
import { useFavorites } from '../contexts/FavoritesContext';
import { useAuth } from '../contexts/AuthContext';
import { PurchaseModal, PurchaseData } from '../components/PurchaseModal';
import { DigitalTicket } from '../components/DigitalTicket';
import { MuxPlayer } from '../components/MuxPlayer';
import StreamingAPI from '../services/api/StreamingAPI';
import EventsAPI from '../services/api/EventsAPI';
import type { StreamingEvent } from '../services/api/EventsAPI';
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

type EventDetailData = StreamingEvent & {
  reference?: string;
};



export function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const { isAuthenticated } = useAuth();
  const [eventData, setEventData] = useState<EventDetailData | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [purchaseData, setPurchaseData] = useState<PurchaseData | null>(null);
  const [showTicket, setShowTicket] = useState(false);
  const [isWatchOpen, setIsWatchOpen] = useState(false);
  const [watchLoading, setWatchLoading] = useState(false);
  const [watchError, setWatchError] = useState<string | null>(null);
  const [muxPlaybackId, setMuxPlaybackId] = useState<string | null>(null);
  const [muxToken, setMuxToken] = useState<string | null>(null);
  const [watchStartTime, setWatchStartTime] = useState<number | undefined>(undefined);

  const resolvedEvent = eventData;
  const event = resolvedEvent;

  useEffect(() => {
    if (!id) return;

    let canceled = false;
    setIsFetching(true);
    setFetchError(null);

    EventsAPI.getById(id)
      .then((data) => {
        if (canceled) return;
        if (data) {
          setEventData({ ...data, reference: data.reference ?? data.id });
        } else {
          setFetchError('Événement introuvable.');
        }
      })
      .catch(() => {
        if (canceled) return;
        setFetchError('Événement introuvable.');
      })
      .finally(() => {
        if (!canceled) setIsFetching(false);
      });

    return () => {
      canceled = true;
    };
  }, [id]);

  if (isFetching && !resolvedEvent) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <div className="h-6 w-48 mx-auto mb-4 bg-white/10 rounded-full animate-pulse" />
          <p className="text-white/60">Chargement de l'événement...</p>
        </div>
      </div>
    );
  }

  if (!resolvedEvent) {
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

  const isInFavorites = isFavorite(resolvedEvent.id);

  const handleToggleFavorite = () => {
    toggleFavorite({
      id: resolvedEvent.id,
      title: resolvedEvent.title,
      image: resolvedEvent.image,
      location: resolvedEvent.location,
      date: resolvedEvent.date,
      time: resolvedEvent.time,
      category: resolvedEvent.category,
      isLive: resolvedEvent.isLive,
      isFree: resolvedEvent.isFree,
      price: resolvedEvent.price,
    });
  };

  const handlePurchaseComplete = (data: PurchaseData) => {
    setPurchaseData(data);
    setIsPurchaseModalOpen(false);
    setShowTicket(true);
  };

  const handleOpenPurchaseModal = () => {
    setIsPurchaseModalOpen(true);
  };

  const handleClosePurchaseModal = () => {
    setIsPurchaseModalOpen(false);
    setPurchaseData(null);
  };

  const clearWatchState = () => {
    setIsWatchOpen(false);
    setMuxPlaybackId(null);
    setMuxToken(null);
    setWatchLoading(false);
  };

  useEffect(() => {
    clearWatchState();
    setWatchError(null);
    setWatchStartTime(undefined);

    if (!id || !isAuthenticated) return;
    StreamingAPI.getWatchHistory('me')
      .then(history => {
        const entry = history.find(h => h.eventId === id);
        if (!entry || entry.progress >= 95 || !entry.duration) return;
        const hMatch = entry.duration.match(/(\d+)h/);
        const mMatch = entry.duration.match(/(\d+)m/);
        const sMatch = entry.duration.match(/(\d+)s/);
        const totalSec =
          (hMatch ? parseInt(hMatch[1]) * 3600 : 0) +
          (mMatch ? parseInt(mMatch[1]) * 60 : 0) +
          (sMatch ? parseInt(sMatch[1]) : 0);
        if (totalSec > 0) {
          setWatchStartTime(Math.floor((entry.progress / 100) * totalSec));
        }
      })
      .catch(() => {});
  }, [id, isAuthenticated]);

  const handleWatchEvent = async () => {
    if (!resolvedEvent) return;
    if (!isAuthenticated) {
      setWatchError('Connectez-vous pour accéder au streaming.');
      navigate('/login');
      return;
    }

    setWatchLoading(true);
    setWatchError(null);

    try {
      const { token, playbackId } = await StreamingAPI.getMuxToken(resolvedEvent.id);
      setMuxPlaybackId(playbackId);
      setMuxToken(token);
      setIsWatchOpen(true);
    } catch (error: any) {
      const message =
        error?.message ||
        (error?.response?.data?.message as string) ||
        'Impossible de récupérer le flux vidéo.';
      setWatchError(message);
      if (!resolvedEvent.isFree) {
        setIsPurchaseModalOpen(true);
      }
    } finally {
      setWatchLoading(false);
    }
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

              {/* Watch Button */}
              <motion.button
                onClick={handleWatchEvent}
                disabled={watchLoading}
                className="bg-[#de0035] hover:bg-[#de0035]/90 flex items-center gap-3 px-6 md:px-8 py-3 rounded-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                whileHover={{ scale: watchLoading ? 1 : 1.05 }}
                whileTap={{ scale: watchLoading ? 1 : 0.95 }}
              >
                <Ticket className="w-5 h-5 md:w-6 md:h-6 text-white" />
                <span className="font-['SF_Pro',sans-serif] font-normal text-white text-base md:text-lg">
                  {watchLoading ? 'Chargement...' : event.isLive ? 'Regarder en direct' : 'Regarder le replay'}
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

      {watchError && (
        <div className="max-w-[1211px] mx-auto px-4 md:px-8 lg:px-24 py-4">
          <div className="rounded-[12px] border border-[#DE0035]/30 bg-[#2d121d] p-4 text-[#ffccd4]">
            {watchError}
          </div>
        </div>
      )}

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

      {/* Watch Modal */}
      <AnimatePresence>
        {isWatchOpen && muxPlaybackId && (
          <motion.div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-[1100px] h-[80vh] bg-black rounded-[24px] overflow-hidden"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <button
                onClick={() => setIsWatchOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <MuxPlayer
                playbackId={muxPlaybackId}
                muxToken={muxToken}
                streamType={event.isLive ? 'live' : 'on-demand'}
                title={event.title}
                poster={event.image}
                autoPlay={true}
                startTime={watchStartTime}
                eventId={event.id}
                eventTitle={event.title}
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Digital Ticket */}
      <DigitalTicket
        isOpen={showTicket}
        onClose={() => setShowTicket(false)}
        purchaseData={purchaseData}
      />
    </div>
  );
}