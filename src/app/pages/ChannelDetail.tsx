import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowLeft, Users, Video, Bell } from 'lucide-react';
import ChannelsAPI, { type Channel } from '../services/api/ChannelsAPI';
import EventsAPI from '../services/api/EventsAPI';
import { EventCard } from '../components/EventCard';
import CreatorAPI from '../services/api/CreatorAPI';
import { SubscriptionModal } from '../components/creator/SubscriptionModal';
import { useAuth } from '../contexts/AuthContext';

export function ChannelDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  const [channel, setChannel] = useState<Channel | null>(null);
  const [events, setEvents] = useState<Array<{ id: string; image: string; title: string; location: string; date: string; isLive?: boolean; isFree?: boolean; hasStreaming?: boolean }>>([]);
  const [creator, setCreator] = useState<Awaited<ReturnType<typeof CreatorAPI.getBySlug>> | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSubModal, setShowSubModal] = useState(false);
  const [subscriptionPrice, setSubscriptionPrice] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);

    ChannelsAPI.getBySlug(slug)
      .then(async (ch) => {
        if (!ch) return;
        setChannel(ch);
        const evts = await EventsAPI.getByChannel(ch.id);
        setEvents(evts.map(e => ({
          id: e.id,
          image: e.image,
          title: e.title,
          location: e.location ?? e.channelName,
          date: e.date,
          isLive: e.isLive,
          isFree: e.isFree,
          hasStreaming: true,
        })));
        const firstPaidEvent = evts.find(e => e.subscriptionPrice);
        if (firstPaidEvent?.subscriptionPrice) setSubscriptionPrice(firstPaidEvent.subscriptionPrice);
      })
      .catch(() => setChannel(null))
      .finally(() => setLoading(false));

    CreatorAPI.getBySlug(slug)
      .then(async (c) => {
        setCreator(c);
        if (isAuthenticated) {
          const status = await CreatorAPI.getSubscriptionStatus(c.id);
          setIsSubscribed(status.subscribed);
        }
      })
      .catch(() => setCreator(null));
  }, [slug, isAuthenticated]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center pt-20">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!channel) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center pt-20">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">Chaîne introuvable</h2>
          <Link to="/chaines" className="text-[#CDFF71] hover:underline">Retour aux chaînes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080808] pt-20 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/chaines" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Retour aux chaînes
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end gap-6">
            {channel.coverImage && (
              <img src={channel.coverImage} alt={channel.name} className="w-full md:w-64 h-40 object-cover rounded-xl" />
            )}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">{channel.name}</h1>
              <p className="text-gray-400 mb-4">{channel.description}</p>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-4 h-4" />{channel.subscriberCount.toLocaleString()} abonnés</span>
                <span className="flex items-center gap-1"><Video className="w-4 h-4" />{channel.eventCount} événements</span>
              </div>
            </div>
            {creator && (
              <button
                onClick={() => setShowSubModal(true)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-colors ${
                  isSubscribed
                    ? 'bg-white/10 text-white hover:bg-white/20'
                    : 'bg-[#DE0035] text-white hover:bg-[#c5002f]'
                }`}
              >
                <Bell className="w-4 h-4" />
                {isSubscribed ? 'Abonné' : "S'abonner"}
              </button>
            )}
          </div>
        </motion.div>

        <h2 className="text-xl font-bold text-white mb-6">Événements de la chaîne</h2>
        {events.length === 0 ? (
          <p className="text-white/40">Aucun événement pour cette chaîne.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Link to={`/event/${event.id}`}>
                  <EventCard {...event} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {creator && showSubModal && (
        <SubscriptionModal
          creator={creator}
          isSubscribed={isSubscribed}
          subscriptionPrice={subscriptionPrice}
          onClose={() => setShowSubModal(false)}
          onToggle={(sub) => setIsSubscribed(sub)}
        />
      )}
    </div>
  );
}
