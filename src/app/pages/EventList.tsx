import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Filter } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { SortFilter, SortOption } from '../components/SortFilter';
import { sortEvents } from '../utils/sortEvents';
import EventsAPI from '../services/api/EventsAPI';
import ChannelsAPI from '../services/api/ChannelsAPI';
import { useLocationContext } from '../contexts/LocationContext';

type FilterStatus = 'all' | 'live' | 'replay' | 'upcoming';
type FilterPrice = 'all' | 'free' | 'paid';

export function EventList() {
  const [events, setEvents] = useState<Array<{ id: string; image: string; title: string; location: string; country?: string | null; date: string; category: string; isLive?: boolean; isFree?: boolean; price?: number; hasStreaming?: boolean }>>([]);
  const [channels, setChannels] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('date-asc');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priceFilter, setPriceFilter] = useState<FilterPrice>('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [search, setSearch] = useState('');

  const { filterEvents } = useLocationContext();

  useEffect(() => {
    ChannelsAPI.getAll().then(list => setChannels(list.map(c => ({ id: c.id, name: c.name })))).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const load = async () => {
      try {
        let data;
        if (search.trim()) {
          data = await EventsAPI.search(search.trim());
        } else if (statusFilter === 'live') {
          data = await EventsAPI.getLive();
        } else if (statusFilter === 'replay') {
          data = await EventsAPI.getReplays();
        } else if (channelFilter !== 'all') {
          data = await EventsAPI.getByChannel(channelFilter);
        } else {
          data = await EventsAPI.getAll();
        }

        let mapped = data.map(e => ({
          id: e.id,
          image: e.image,
          title: e.title,
          location: e.location ?? e.channelName,
          country: e.country ?? null,
          date: e.date,
          category: e.category,
          isLive: e.isLive,
          isFree: e.isFree,
          price: e.price,
          hasStreaming: true,
        }));

        if (statusFilter === 'upcoming') {
          mapped = mapped.filter(e => !e.isLive);
        }
        if (priceFilter === 'free') mapped = mapped.filter(e => e.isFree);
        if (priceFilter === 'paid') mapped = mapped.filter(e => !e.isFree);

        setEvents(filterEvents(mapped));
      } catch {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [statusFilter, priceFilter, channelFilter, search, filterEvents]);

  const sorted = sortEvents(events, sortOption);

  return (
    <div className="relative bg-[#080808] min-h-screen py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <h1 className="font-['Inter',sans-serif] font-bold text-white text-2xl md:text-3xl lg:text-4xl">
            Tous les événements
          </h1>
          <SortFilter currentSort={sortOption} onSortChange={setSortOption} />
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
          <Filter className="w-4 h-4 text-[#CDFF71]" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none focus:border-[#CDFF71] min-w-[180px]"
          />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as FilterStatus)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none">
            <option value="all">Tous statuts</option>
            <option value="live">En direct</option>
            <option value="replay">Replay</option>
            <option value="upcoming">À venir</option>
          </select>
          <select value={priceFilter} onChange={e => setPriceFilter(e.target.value as FilterPrice)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none">
            <option value="all">Tous prix</option>
            <option value="free">Gratuit</option>
            <option value="paid">Payant</option>
          </select>
          <select value={channelFilter} onChange={e => setChannelFilter(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm outline-none">
            <option value="all">Toutes chaînes</option>
            {channels.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-64 bg-white/5 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : sorted.length === 0 ? (
          <p className="text-white/40 text-center py-20">Aucun événement trouvé.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map((event, i) => (
              <motion.div key={event.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/event/${event.id}`}>
                  <EventCard {...event} />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
