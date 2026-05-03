import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  X,
  Save,
} from 'lucide-react';
import EventsAPI from '../../services/api/EventsAPI';
import { ImageUpload } from '../../components/ImageUpload';
import AdminAPI, { type AdminChannel, type AdminEventCreateInput, type AdminEventUpdateInput } from '../../services/api/AdminAPI';
import type { StreamingEvent } from '../../services/api/EventsAPI';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { firebaseClientErrorToUserMessage } from '../../utils/firebaseUserFacingError';

interface EventAdminCard {
  id: string;
  title: string;
  description: string;
  date: string;
  dateRaw: string;
  time: string;
  location: string;
  channelId: string;
  channelName: string;
  category: string;
  price: number;
  currency: string;
  status: 'published' | 'live' | 'ended';
  attendees: number;
  image: string;
  isLive: boolean;
  isReplay: boolean;
  isFeatured: boolean;
  streamUrl: string;
  duration: string;
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
    description: event.description ?? '',
    date: formatDate(event.date),
    dateRaw: event.date,
    time: event.time,
    location: event.location ?? '',
    channelId: event.channelId ?? '',
    channelName: event.channelName,
    category: event.category,
    price: event.price ?? 0,
    currency: event.currency ?? 'FCFA',
    status: getStatus(event),
    attendees: event.viewerCount ?? 0,
    image: event.image,
    isLive: event.isLive ?? false,
    isReplay: event.isReplay ?? false,
    isFeatured: event.isFeatured ?? false,
    streamUrl: event.streamUrl ?? '',
    duration: event.duration ?? '',
  };
}

const EMPTY_FORM: AdminEventCreateInput = {
  title: '',
  description: '',
  date: '',
  time: '',
  duration: '',
  image: '',
  channelId: '',
  channelName: '',
  category: '',
  isLive: false,
  isReplay: false,
  isFeatured: false,
  price: 0,
  currency: 'FCFA',
  streamUrl: '',
  location: '',
};

export function EventsManagement() {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('manage_events') || hasPermission('manage_users');

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [events, setEvents] = useState<EventAdminCard[]>([]);
  const [channels, setChannels] = useState<AdminChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Modal état
  const [editModal, setEditModal] = useState<EventAdminCard | null>(null);
  const [createModal, setCreateModal] = useState(false);
  const [form, setForm] = useState<AdminEventCreateInput>(EMPTY_FORM);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([EventsAPI.getAll(), AdminAPI.getChannels()])
      .then(([data, chs]) => {
        setEvents(data.map(mapEvent));
        setChannels(chs);
        setError(null);
      })
      .catch((err) => {
        setError(firebaseClientErrorToUserMessage(err, 'Impossible de charger les événements.'));
      })
      .finally(() => setLoading(false));
  }, []);

  const statusColors = {
    published: 'bg-blue-500/20 text-blue-400',
    live: 'bg-red-500/20 text-red-400',
    ended: 'bg-green-500/20 text-green-400',
  };

  const statusLabels = {
    published: 'Publié',
    live: 'En direct',
    ended: 'Terminé',
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  }, [events, filterStatus, searchQuery]);

  const handleDelete = async (event: EventAdminCard) => {
    if (!confirm(`Supprimer "${event.title}" ? Cette action est irréversible.`)) return;
    setActionLoading(event.id);
    try {
      await AdminAPI.deleteEvent(event.id);
      setEvents(prev => prev.filter(e => e.id !== event.id));
    } catch (err) {
      alert(firebaseClientErrorToUserMessage(err, 'Erreur lors de la suppression.'));
    } finally {
      setActionLoading(null);
    }
  };

  const openEdit = (event: EventAdminCard) => {
    setForm({
      title: event.title,
      description: event.description,
      date: event.dateRaw,
      time: event.time,
      duration: event.duration,
      image: event.image,
      channelId: event.channelId,
      channelName: event.channelName,
      category: event.category,
      isLive: event.isLive,
      isReplay: event.isReplay,
      isFeatured: event.isFeatured,
      price: event.price,
      currency: event.currency,
      streamUrl: event.streamUrl,
      location: event.location,
    });
    setFormError(null);
    setEditModal(event);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setFormError(null);
    setCreateModal(true);
  };

  const closeModal = () => {
    setEditModal(null);
    setCreateModal(false);
  };

  const handleSaveEdit = async () => {
    if (!editModal) return;
    if (!form.title.trim()) { setFormError('Le titre est requis.'); return; }
    setSaving(true);
    setFormError(null);
    try {
      const updated = await AdminAPI.updateEvent(editModal.id, form as AdminEventUpdateInput);
      setEvents(prev => prev.map(e => e.id === editModal.id ? mapEvent(updated) : e));
      closeModal();
    } catch (err) {
      setFormError(firebaseClientErrorToUserMessage(err, 'Erreur lors de la sauvegarde.'));
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!form.title.trim()) { setFormError('Le titre est requis.'); return; }
    if (!form.channelId) { setFormError('Sélectionnez une chaîne.'); return; }
    if (!form.date) { setFormError('La date est requise.'); return; }
    setSaving(true);
    setFormError(null);
    try {
      const created = await AdminAPI.createEvent(form);
      setEvents(prev => [mapEvent(created), ...prev]);
      closeModal();
    } catch (err) {
      setFormError(firebaseClientErrorToUserMessage(err, 'Erreur lors de la création.'));
    } finally {
      setSaving(false);
    }
  };

  const setField = (key: keyof AdminEventCreateInput, value: string | boolean | number) => {
    setForm(prev => {
      const next = { ...prev, [key]: value };
      if (key === 'channelId') {
        const ch = channels.find(c => c.id === value);
        if (ch) next.channelName = ch.name;
      }
      return next;
    });
  };

  const isModalOpen = editModal !== null || createModal;

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">
            Gestion des événements
          </h1>
          <p className="font-['Inter',sans-serif] text-white/60 text-base">
            {events.length} événement{events.length !== 1 ? 's' : ''} au total
          </p>
        </div>
        {canEdit && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openCreate}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-[#cdff71] text-black px-6 py-3 rounded-lg font-['Inter',sans-serif] font-semibold hover:bg-[#cdff71]/90 transition-colors"
            type="button"
          >
            <Plus className="w-5 h-5" />
            Nouvel événement
          </motion.button>
        )}
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
            placeholder="Rechercher un événement..."
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
            <option value="published">Publié</option>
            <option value="live">En direct</option>
            <option value="ended">Terminé</option>
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
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-3 line-clamp-1">
                  {event.title}
                </h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    {event.date} à {event.time}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    {event.location || event.channelName}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <DollarSign className="w-4 h-4 flex-shrink-0" />
                    {event.price > 0 ? `${event.price.toLocaleString()} ${event.currency}` : 'Gratuit'}
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Users className="w-4 h-4 flex-shrink-0" />
                    {event.attendees.toLocaleString()} vues
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="flex-1 flex items-center justify-center gap-2 bg-[#cdff71]/10 hover:bg-[#cdff71]/20 text-[#cdff71] px-4 py-2 rounded-lg transition-colors"
                    title="Voir"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Voir</span>
                  </button>
                  {canEdit && (
                    <>
                      <button
                        onClick={() => openEdit(event)}
                        className="flex items-center justify-center bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        disabled={actionLoading === event.id}
                        className="flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
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
            Aucun événement trouvé
          </p>
        </div>
      )}

      {/* Modal create / edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#111] border border-white/10 rounded-[16px] p-6 w-full max-w-2xl my-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">
                  {createModal ? 'Nouvel événement' : 'Modifier l\'événement'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-white/60" />
                </button>
              </div>

              {formError && (
                <div className="mb-4 rounded-lg border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
                  {formError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Titre */}
                <div className="md:col-span-2">
                  <label className="block text-white/60 text-xs mb-1.5">Titre *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setField('title', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-white/60 text-xs mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors resize-none"
                  />
                </div>

                {/* Chaîne */}
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Chaîne *</label>
                  <select
                    value={form.channelId}
                    onChange={e => setField('channelId', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  >
                    <option value="">Sélectionner une chaîne</option>
                    {channels.map(ch => (
                      <option key={ch.id} value={ch.id}>{ch.name}</option>
                    ))}
                  </select>
                </div>

                {/* Catégorie */}
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Catégorie</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={e => setField('category', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Date *</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={e => setField('date', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  />
                </div>

                {/* Heure */}
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Heure</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={e => setField('time', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  />
                </div>

                {/* Lieu */}
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Lieu</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setField('location', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  />
                </div>

                {/* Prix */}
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">Prix (FCFA)</label>
                  <input
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={e => setField('price', Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  />
                </div>

                {/* Image */}
                <ImageUpload
                  value={form.image}
                  onChange={url => setField('image', url)}
                  folder="feetiplay/events"
                  label="Image de l'événement"
                  aspect="wide"
                />

                {/* Stream URL */}
                <div>
                  <label className="block text-white/60 text-xs mb-1.5">URL stream</label>
                  <input
                    type="text"
                    value={form.streamUrl}
                    onChange={e => setField('streamUrl', e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white outline-none focus:border-[#cdff71] transition-colors"
                  />
                </div>

                {/* Flags */}
                <div className="md:col-span-2 flex flex-wrap gap-4">
                  {([['isLive', 'En direct'], ['isReplay', 'Replay'], ['isFeatured', 'Mis en avant']] as const).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!form[key]}
                        onChange={e => setField(key, e.target.checked)}
                        className="w-4 h-4 accent-[#cdff71]"
                      />
                      <span className="text-white/70 text-sm">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={createModal ? handleCreate : handleSaveEdit}
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#cdff71] hover:bg-[#cdff71]/90 text-black font-semibold rounded-lg transition-colors disabled:opacity-40"
                >
                  <Save className="w-4 h-4" />
                  {saving ? 'Enregistrement...' : (createModal ? 'Créer' : 'Sauvegarder')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
