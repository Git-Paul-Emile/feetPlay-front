import { useState } from 'react';
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

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  price: number;
  status: 'draft' | 'published' | 'live' | 'ended';
  attendees: number;
  image: string;
}

export function EventsManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data
  const [events] = useState<Event[]>([
    {
      id: '1',
      title: 'CHAN 2025 - Finale',
      date: '15 Mars 2025',
      time: '15:00',
      location: 'Stade Alphonse Massamba-Débat, Brazzaville',
      category: 'Football',
      price: 15000,
      status: 'live',
      attendees: 45234,
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400',
    },
    {
      id: '2',
      title: 'Match Amical - Congo vs Cameroun',
      date: '18 Mars 2025',
      time: '17:00',
      location: 'Stade de la Concorde, Pointe-Noire',
      category: 'Football',
      price: 10000,
      status: 'published',
      attendees: 8234,
      image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400',
    },
    {
      id: '3',
      title: 'Championnat National - J15',
      date: '20 Mars 2025',
      time: '14:00',
      location: 'Stade Massamba-Débat',
      category: 'Football',
      price: 5000,
      status: 'published',
      attendees: 3421,
      image: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=400',
    },
    {
      id: '4',
      title: 'Tournoi de Basketball U21',
      date: '25 Mars 2025',
      time: '10:00',
      location: 'Palais des Sports, Brazzaville',
      category: 'Basketball',
      price: 3000,
      status: 'draft',
      attendees: 0,
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400',
    },
  ]);

  const statusColors = {
    draft: 'bg-gray-500/20 text-gray-400',
    published: 'bg-blue-500/20 text-blue-400',
    live: 'bg-red-500/20 text-red-400',
    ended: 'bg-green-500/20 text-green-400',
  };

  const statusLabels = {
    draft: 'Brouillon',
    published: 'Publié',
    live: 'En direct',
    ended: 'Terminé',
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">
            Gestion des événements
          </h1>
          <p className="font-['Inter',sans-serif] text-white/60 text-base">
            Créez, modifiez et gérez tous vos événements sportifs
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#cdff71] text-black px-6 py-3 rounded-lg font-['Inter',sans-serif] font-semibold hover:bg-[#cdff71]/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nouvel événement
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher un événement..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#cdff71] transition-colors"
          />
        </div>

        {/* Status filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white outline-none focus:border-[#cdff71] transition-colors appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="all">Tous les statuts</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="live">En direct</option>
            <option value="ended">Terminé</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] overflow-hidden hover:border-[#cdff71]/50 transition-colors group"
          >
            {/* Image */}
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

            {/* Content */}
            <div className="p-6">
              <h3 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-3">
                {event.title}
              </h3>

              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Calendar className="w-4 h-4" />
                  {event.date} à {event.time}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <DollarSign className="w-4 h-4" />
                  {event.price.toLocaleString()} FCFA
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Users className="w-4 h-4" />
                  {event.attendees.toLocaleString()} participants
                </div>
              </div>

              {/* Actions */}
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

      {/* Empty state */}
      {filteredEvents.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="font-['Inter',sans-serif] text-white/60 text-lg">
            Aucun événement trouvé
          </p>
        </div>
      )}
    </div>
  );
}
