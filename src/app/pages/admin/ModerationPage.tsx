import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldAlert,
  Radio,
  Users,
  FileText,
  EyeOff,
  Flag,
  Search,
  Filter,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
  RefreshCw,
  User,
  Calendar,
  Tag,
} from 'lucide-react';
import AdminAPI, { type AdminEventItem, type AdminUserItem, type SystemLogItem } from '../../services/api/AdminAPI';

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = 'streaming' | 'users' | 'logs';

interface ActionState {
  eventId: string;
  type: 'hide' | 'flag';
}

// ── Composants utilitaires ────────────────────────────────────────────────────

function TabButton({ id, label, icon: Icon, active, onClick }: {
  id: Tab; label: string; icon: React.ElementType; active: boolean; onClick: (id: Tab) => void;
}) {
  return (
    <button
      id={`mod-tab-${id}`}
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-lg font-['Inter',sans-serif] text-sm font-medium transition-all ${
        active
          ? 'bg-[#cdff71] text-black'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-white/5 rounded-xl ${className}`} />;
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
      <p className="font-['Inter',sans-serif] text-red-300 text-sm">{message}</p>
    </div>
  );
}

// ── Onglet Streaming ──────────────────────────────────────────────────────────

function StreamingTab() {
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [pending, setPending] = useState<ActionState | null>(null);
  const [actionMsg, setActionMsg] = useState<{ id: string; text: string } | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    AdminAPI.getRecentEvents(50)
      .then(setEvents)
      .catch(e => setError(e.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = events.filter(e =>
    e.title.toLowerCase().includes(search.toLowerCase()) ||
    e.channel?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleAction = async (eventId: string, type: 'hide' | 'flag') => {
    setPending({ eventId, type });
    try {
      if (type === 'hide') await AdminAPI.hideEvent(eventId);
      else await AdminAPI.flagEvent(eventId);
      setActionMsg({ id: eventId, text: type === 'hide' ? 'Masqué' : 'Signalé' });
      setTimeout(() => setActionMsg(null), 3000);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Erreur';
      setError(msg);
    } finally {
      setPending(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            id="mod-search-events"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un événement ou une chaîne…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-[#cdff71]/50 transition-colors"
          />
        </div>
        <button
          id="mod-refresh-events"
          onClick={load}
          className="p-2.5 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <p className="font-['Inter',sans-serif] text-white/30 text-xs">
        {filtered.length} événement{filtered.length !== 1 ? 's' : ''} — lecture seule · masquage et signalement autorisés
      </p>

      <div className="space-y-2">
        {filtered.map(event => (
          <motion.div
            key={event.id}
            layout
            className="flex items-center gap-4 p-4 bg-white/3 border border-white/8 rounded-xl hover:bg-white/5 transition-colors"
          >
            {event.image ? (
              <img src={event.image} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                <Radio className="w-6 h-6 text-white/20" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {event.isLive && (
                  <span className="px-2 py-0.5 bg-[#de0035]/20 text-[#de0035] text-[10px] font-bold rounded-full border border-[#de0035]/30 uppercase tracking-wide">
                    Live
                  </span>
                )}
                {event.isReplay && (
                  <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 text-[10px] font-bold rounded-full border border-purple-500/30 uppercase tracking-wide">
                    Replay
                  </span>
                )}
                {event.isFeatured && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] rounded-full border border-amber-500/30 uppercase tracking-wide">
                    Mis en avant
                  </span>
                )}
              </div>
              <p className="font-['Inter',sans-serif] text-white text-sm font-medium truncate">{event.title}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="font-['Inter',sans-serif] text-white/40 text-xs flex items-center gap-1">
                  <Radio className="w-3 h-3" /> {event.channel?.name ?? '—'}
                </span>
                <span className="font-['Inter',sans-serif] text-white/40 text-xs flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {event.date}
                </span>
                <span className="font-['Inter',sans-serif] text-white/40 text-xs flex items-center gap-1">
                  <Users className="w-3 h-3" /> {event.viewerCount.toLocaleString()} spectateurs
                </span>
              </div>
            </div>

            {actionMsg?.id === event.id ? (
              <span className="font-['Inter',sans-serif] text-[#cdff71] text-xs font-medium px-3 py-1.5 bg-[#cdff71]/10 rounded-lg border border-[#cdff71]/20">
                ✓ {actionMsg.text}
              </span>
            ) : (
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  id={`mod-hide-${event.id}`}
                  disabled={!!pending}
                  onClick={() => handleAction(event.id, 'hide')}
                  title="Masquer cet événement"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700/50 hover:bg-slate-700 border border-white/10 rounded-lg text-white/60 hover:text-white text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {pending?.eventId === event.id && pending.type === 'hide' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <EyeOff className="w-3.5 h-3.5" />
                  )}
                  Masquer
                </button>
                <button
                  id={`mod-flag-${event.id}`}
                  disabled={!!pending}
                  onClick={() => handleAction(event.id, 'flag')}
                  title="Signaler cet événement"
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-900/30 hover:bg-orange-900/50 border border-orange-500/30 rounded-lg text-orange-300 hover:text-orange-200 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {pending?.eventId === event.id && pending.type === 'flag' ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Flag className="w-3.5 h-3.5" />
                  )}
                  Signaler
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <Radio className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="font-['Inter',sans-serif] text-white/30 text-sm">Aucun événement trouvé</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Onglet Utilisateurs ───────────────────────────────────────────────────────

function UsersTab() {
  const [users, setUsers] = useState<AdminUserItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const load = useCallback((q?: string) => {
    setLoading(true);
    AdminAPI.getUsers({ search: q, limit: 50 })
      .then(({ users: u, total: t }) => { setUsers(u); setTotal(t); })
      .catch(e => setError(e.message ?? 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const planColors: Record<string, string> = {
    free: 'text-white/40',
    basic: 'text-blue-400',
    premium: 'text-[#cdff71]',
    vip: 'text-[#de0035]',
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            id="mod-search-users"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && load(search)}
            placeholder="Rechercher par nom ou email…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-[#cdff71]/50 transition-colors"
          />
        </div>
        <button
          id="mod-search-users-btn"
          onClick={() => load(search)}
          className="px-4 py-2.5 bg-[#cdff71]/10 border border-[#cdff71]/20 rounded-lg text-[#cdff71] text-sm font-medium hover:bg-[#cdff71]/20 transition-colors"
        >
          Chercher
        </button>
      </div>

      <p className="font-['Inter',sans-serif] text-white/30 text-xs">
        {total} utilisateur{total !== 1 ? 's' : ''} — consultation uniquement
      </p>

      <div className="bg-white/3 border border-white/8 rounded-xl overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white/8">
            <tr>
              <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">Utilisateur</th>
              <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium hidden md:table-cell">Email</th>
              <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">Plan</th>
              <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium hidden lg:table-cell">Tickets</th>
              <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium hidden lg:table-cell">Inscription</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img src={u.avatar} alt="" className="w-8 h-8 rounded-full" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                        <User className="w-4 h-4 text-white/40" />
                      </div>
                    )}
                    <span className="font-['Inter',sans-serif] text-white text-sm">{u.name}</span>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <span className="font-['Inter',sans-serif] text-white/50 text-sm">{u.email}</span>
                </td>
                <td className="p-4">
                  <span className={`font-['Inter',sans-serif] text-sm font-medium capitalize ${planColors[u.subscriptionPlan] ?? 'text-white/40'}`}>
                    {u.subscriptionPlan}
                  </span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <span className="font-['Inter',sans-serif] text-white/40 text-sm">{u._count?.tickets ?? 0}</span>
                </td>
                <td className="p-4 hidden lg:table-cell">
                  <span className="font-['Inter',sans-serif] text-white/40 text-xs">
                    {new Date(u.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="font-['Inter',sans-serif] text-white/30 text-sm">Aucun utilisateur</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Onglet Logs ───────────────────────────────────────────────────────────────

const LEVEL_CONFIG = {
  info:    { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   label: 'Info' },
  success: { icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10',  label: 'Succès' },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Attention' },
  error:   { icon: AlertCircle,   color: 'text-red-400',    bg: 'bg-red-500/10',    label: 'Erreur' },
};

function LogsTab() {
  const [logs, setLogs] = useState<SystemLogItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    AdminAPI.getLogs({ search: search || undefined, level: level || undefined, limit: 100 })
      .then(({ logs: l, total: t }) => { setLogs(l); setTotal(t); })
      .catch(e => setError(e.message ?? 'Erreur'))
      .finally(() => setLoading(false));
  }, [search, level]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            id="mod-search-logs"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher dans les logs…"
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-white/30 outline-none focus:border-[#cdff71]/50 transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <select
            id="mod-filter-level"
            value={level}
            onChange={e => setLevel(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-2.5 text-white text-sm outline-none focus:border-[#cdff71]/50 transition-colors appearance-none cursor-pointer min-w-[180px]"
          >
            <option value="">Tous les niveaux</option>
            <option value="info">Info</option>
            <option value="success">Succès</option>
            <option value="warning">Attention</option>
            <option value="error">Erreur</option>
          </select>
        </div>
      </div>

      <p className="font-['Inter',sans-serif] text-white/30 text-xs">
        {total} log{total !== 1 ? 's' : ''} — consultation uniquement, sans modification ni export
      </p>

      <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/8">
              <tr>
                <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">Niveau</th>
                <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">Action</th>
                <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium hidden md:table-cell">Description</th>
                <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => {
                const cfg = LEVEL_CONFIG[log.level] ?? LEVEL_CONFIG.info;
                const Icon = cfg.icon;
                return (
                  <tr key={log.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${cfg.bg}`}>
                        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                        <span className={`font-['Inter',sans-serif] text-xs font-medium ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="font-['Inter',sans-serif] text-white text-sm font-medium font-mono">{log.action}</span>
                    </td>
                    <td className="p-4 hidden md:table-cell max-w-xs">
                      <span className="font-['Inter',sans-serif] text-white/60 text-sm truncate block">{log.description}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell">
                      <span className="font-['Inter',sans-serif] text-white/30 text-xs">
                        {new Date(log.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {logs.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-10 h-10 text-white/10 mx-auto mb-3" />
              <p className="font-['Inter',sans-serif] text-white/30 text-sm">Aucun log</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'streaming', label: 'Streaming',    icon: Radio },
  { id: 'users',     label: 'Profils',      icon: Users },
  { id: 'logs',      label: 'Logs système', icon: FileText },
];

export function ModerationPage() {
  const [tab, setTab] = useState<Tab>('streaming');

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-orange-500/15 border border-orange-500/25 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-orange-400" />
            </div>
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-2xl">
              Modération
            </h1>
          </div>
          <p className="font-['Inter',sans-serif] text-white/40 text-sm ml-13">
            Consulter et modérer le contenu de la plateforme · lecture seule
          </p>
        </div>

        {/* Badge restrictions */}
        <div className="flex items-center gap-2 px-4 py-2 bg-orange-900/20 border border-orange-500/25 rounded-xl">
          <Tag className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span className="font-['Inter',sans-serif] text-orange-300 text-xs">
            Suppression, modification d'événements et gestion des rôles non autorisées
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/3 border border-white/8 rounded-xl w-fit">
        {TABS.map(t => (
          <TabButton key={t.id} id={t.id} label={t.label} icon={t.icon} active={tab === t.id} onClick={setTab} />
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tab === 'streaming' && <StreamingTab />}
          {tab === 'users'     && <UsersTab />}
          {tab === 'logs'      && <LogsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
