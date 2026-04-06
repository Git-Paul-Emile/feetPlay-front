import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Calendar,
  MapPin,
  DollarSign,
  Users,
} from 'lucide-react';
import EventsAPI, { type StreamingEvent } from '../../services/api/EventsAPI';

interface EventAdminCard {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  status: 'published' | 'live' | 'ended';
  attendees: number;
  image: string;
}

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

function getStatus(event: StreamingEvent): EventAdminCard['status'] {
  if (event.isLive) return 'live';
  const now = new Date();
  const eventDate = new Date(event.date);
  if (!Number.isNaN(eventDate.getTime()) && eventDate < now) return 'ended';
  return 'published';
}

function mapEvent(event: StreamingEvent): EventAdminCard {
  return {
    id: event.id,
    title: event.title,
    date: formatDate(event.date),
    time: event.time,
    location: event.channelName,
    category: event.category,
    price: event.price ?? 0,
    status: getStatus(event),
    attendees: event.viewerCount ?? 0,
    image: event.image,
  };
}

export function EventsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState<EventAdminCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    EventsAPI.getAll()
      .then((data) => {
        if (!mounted) return;
        setEvents(data.map(mapEvent));
        setError(null);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Impossible de charger les evenements.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const statusColors = {
    published: 'bg-blue-500/20 text-blue-400',
    live: 'bg-red-500/20 text-red-400',
    ended: 'bg-green-500/20 text-green-400',
  };

  const statusLabels = {
    published: 'Publie',
    live: 'En direct',
    ended: 'Termine',
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [events, filterStatus, searchQuery]);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">
            Gestion des evenements
          </h1>
          <p className="font-['Inter',sans-serif] text-white/60 text-base">
            Vue branchee sur les donnees reelles de FeetiPlay.
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#cdff71] text-black px-6 py-3 rounded-lg font-['Inter',sans-serif] font-semibold hover:bg-[#cdff71]/90 transition-colors"
          type="button"
        >
          <Plus className="w-5 h-5" />
          Nouvel evenement
        </motion.button>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher un evenement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#cdff71] transition-colors"
          />
        </div>

        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white outline-none focus:border-[#cdff71] transition-colors appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="all">Tous les statuts</option>
            <option value="published">Publie</option>
            <option value="live">En direct</option>
            <option value="ended">Termine</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="h-[380px] rounded-[12px] bg-white/5 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] overflow-hidden hover:border-[#cdff71]/50 transition-colors group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${statusColors[event.status]}`}>
                  {statusLabels[event.status]}
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-3">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4" />
                    {event.date} a {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <DollarSign className="w-4 h-4" />
                    {event.price > 0 ? `${event.price.toLocaleString()} FCFA` : 'Gratuit'}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4" />
                    {event.attendees.toLocaleString()} vues
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 flex items-center justify-center gap-2 bg-[#cdff71]/10 hover:bg-[#cdff71]/20 text-[#cdff71] px-4 py-2 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Voir</span>
                  </button>
                  <button className="flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg transition-colors">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="font-['Inter',sans-serif] text-white/60 text-lg">
            Aucun evenement trouve
          </p>
        </div>
      )}
    </div>
  );
}
