import { useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Copy, Eye, Radio, RefreshCw, Search, Square, Trash2 } from 'lucide-react';
import AdminAPI, { type AdminEventItem } from '../../services/api/AdminAPI';
import { firebaseClientErrorToUserMessage } from '../../utils/firebaseUserFacingError';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

type MuxResult = Awaited<ReturnType<typeof AdminAPI.createMuxLiveStream>>;

function statusLabel(event: AdminEventItem) {
  if (event.isLive) return 'En direct';
  if (event.isReplay) return 'Replay';
  return 'Planifie';
}

export function EventsManagement() {
  const { hasPermission } = useAdminAuth();
  const canEdit = hasPermission('manage_events');
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);
  const [muxResult, setMuxResult] = useState<MuxResult | null>(null);

  const load = () => {
    setLoading(true);
    setError(null);
    AdminAPI.getRecentEvents(100)
      .then(setEvents)
      .catch((err) => setError(firebaseClientErrorToUserMessage(err, 'Erreur de chargement des evenements.')))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return events;
    return events.filter((event) =>
      [event.title, event.category, event.channel?.name].some((value) => value?.toLowerCase().includes(query)),
    );
  }, [events, searchQuery]);

  const createMux = async (event: AdminEventItem) => {
    setActionId(event.id);
    setError(null);
    try {
      const result = await AdminAPI.createMuxLiveStream({ title: event.title, eventId: event.id });
      setMuxResult(result);
      load();
    } catch (err) {
      setError(firebaseClientErrorToUserMessage(err, 'Impossible de creer le live stream Mux.'));
    } finally {
      setActionId(null);
    }
  };

  const disableMux = async (event: AdminEventItem) => {
    if (!event.muxStreamId) return;
    if (!confirm(`Desactiver le live stream Mux de "${event.title}" ?`)) return;
    setActionId(event.id);
    try {
      await AdminAPI.disableMuxLiveStream(event.muxStreamId);
      load();
    } catch (err) {
      setError(firebaseClientErrorToUserMessage(err, 'Impossible de desactiver le live stream Mux.'));
    } finally {
      setActionId(null);
    }
  };

  const deleteEvent = async (event: AdminEventItem) => {
    if (!confirm(`Supprimer "${event.title}" ?`)) return;
    setActionId(event.id);
    try {
      await AdminAPI.deleteEvent(event.id);
      setEvents((prev) => prev.filter((item) => item.id !== event.id));
    } catch (err) {
      setError(firebaseClientErrorToUserMessage(err, 'Impossible de supprimer cet evenement.'));
    } finally {
      setActionId(null);
    }
  };

  const copy = (value: string) => navigator.clipboard?.writeText(value).catch(() => undefined);

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">Gestion des evenements</h1>
          <p className="font-['Inter',sans-serif] text-white/60 text-base">Evenements reels, diffusion Mux et moderation operationnelle</p>
        </div>
        <button onClick={load} className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white px-4 py-2.5 rounded-lg transition-colors">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {error && <div className="mb-6 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">{error}</div>}

      {muxResult && (
        <div className="mb-6 rounded-xl border border-[#CDFF71]/30 bg-[#CDFF71]/10 p-4 text-sm text-white">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <p className="font-semibold text-[#CDFF71]">Live stream Mux cree</p>
              <p>Serveur RTMP: <span className="font-mono">{muxResult.rtmpUrl}</span></p>
              <p>Stream key: <span className="font-mono">{muxResult.streamKey}</span></p>
              <p>Playback ID: <span className="font-mono">{muxResult.playbackId}</span></p>
            </div>
            <button onClick={() => copy(`${muxResult.rtmpUrl}\n${muxResult.streamKey}`)} className="p-2 rounded-lg bg-white/10 hover:bg-white/15">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
        <input
          type="text"
          placeholder="Rechercher un evenement..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#cdff71] transition-colors"
        />
      </div>

      <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-5 py-4 text-white/80 text-sm">Evenement</th>
                <th className="text-left px-5 py-4 text-white/80 text-sm">Date</th>
                <th className="text-left px-5 py-4 text-white/80 text-sm">Statut</th>
                <th className="text-left px-5 py-4 text-white/80 text-sm">Ventes</th>
                <th className="text-right px-5 py-4 text-white/80 text-sm">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-5 py-4"><div className="h-5 bg-white/5 rounded animate-pulse" /></td></tr>
              )) : filteredEvents.map((event, index) => (
                <motion.tr key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-5 py-4">
                    <p className="text-white font-semibold text-sm">{event.title}</p>
                    <p className="text-white/45 text-xs">{event.channel?.name ?? event.category ?? 'Chaine'} {event.muxStreamId ? `- Mux ${event.muxStreamId}` : ''}</p>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-sm">
                    <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" />{event.date} {event.time}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${event.isLive ? 'bg-[#DE0035]/20 text-[#DE0035]' : event.isReplay ? 'bg-blue-500/20 text-blue-300' : 'bg-white/10 text-white/60'}`}>
                      {statusLabel(event)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-white/60 text-sm">{event._count.tickets} ticket(s) - {event.price?.toLocaleString() ?? 0} {event.currency}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a href={`/event/${event.id}`} className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-white" title="Voir"><Eye className="w-4 h-4" /></a>
                      {canEdit && (
                        <>
                          <button onClick={() => createMux(event)} disabled={actionId === event.id} className="p-2 rounded-lg bg-[#CDFF71]/10 hover:bg-[#CDFF71]/20 text-[#CDFF71] disabled:opacity-40" title="Creer live Mux"><Radio className="w-4 h-4" /></button>
                          {event.muxStreamId && <button onClick={() => disableMux(event)} disabled={actionId === event.id} className="p-2 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 disabled:opacity-40" title="Desactiver Mux"><Square className="w-4 h-4" /></button>}
                          <button onClick={() => deleteEvent(event)} disabled={actionId === event.id} className="p-2 rounded-lg bg-[#DE0035]/10 hover:bg-[#DE0035]/20 text-[#DE0035] disabled:opacity-40" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filteredEvents.length === 0 && <div className="py-16 text-center text-white/50">Aucun evenement trouve</div>}
      </div>
    </div>
  );
}
