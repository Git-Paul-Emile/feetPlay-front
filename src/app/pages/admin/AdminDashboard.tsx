import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  CalendarDays,
  DollarSign,
  Eye,
  ShoppingCart,
  Activity,
  Loader2,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminAPI, {
  type AdminStats,
  type AdminEventItem,
  type AdminTicketItem,
} from '../../services/api/AdminAPI';

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n);

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.round(diff / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.round(min / 60);
  if (h < 24) return `Il y a ${h} h`;
  return new Date(iso).toLocaleDateString('fr-FR');
}

// Tableau de bord : chiffres réels issus de /api/admin (aucune donnée fictive)
export function AdminDashboard() {
  const { user } = useAdminAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [events, setEvents] = useState<AdminEventItem[]>([]);
  const [tickets, setTickets] = useState<AdminTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      AdminAPI.getStats(),
      AdminAPI.getRecentEvents(5),
      AdminAPI.getRecentTickets(6),
    ])
      .then(([s, e, t]) => {
        if (cancelled) return;
        setStats(s);
        setEvents(e ?? []);
        setTickets(t ?? []);
      })
      .catch((err: any) => !cancelled && setError(err?.message ?? 'Impossible de charger le tableau de bord'))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, []);

  const cards = stats ? [
    {
      name: 'Utilisateurs',
      value: fmt(stats.totalUsers),
      sub: `+${fmt(stats.newUsersThisMonth)} ce mois`,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      name: 'Événements',
      value: fmt(stats.totalEvents),
      sub: `${fmt(stats.liveEvents)} en live`,
      icon: CalendarDays,
      color: 'bg-[#cdff71]',
    },
    {
      name: 'Revenus du mois',
      value: `${fmt(stats.revenueThisMonth)} FCFA`,
      sub: `${fmt(stats.totalRevenue)} FCFA au total`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      name: 'Tickets vendus',
      value: fmt(stats.totalTickets),
      sub: `${fmt(stats.ticketsThisMonth)} ce mois`,
      icon: ShoppingCart,
      color: 'bg-purple-500',
    },
  ] : [];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-2">
          Bienvenue, {user?.name}
        </h1>
        <p className="font-['Inter',sans-serif] text-white/60 text-base">
          Voici un aperçu de votre plateforme FÉÉTI PLAY
        </p>
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-white/70 mb-8" role="status">
          <Loader2 className="w-5 h-5 animate-spin" /> Chargement des indicateurs...
        </div>
      )}
      {error && (
        <p role="alert" className="mb-8 rounded-lg border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6"
          >
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <p className="font-['Inter',sans-serif] text-white/60 text-sm mb-1">{stat.name}</p>
            <p className="font-['DM_Sans',sans-serif] font-bold text-white text-2xl">{stat.value}</p>
            <p className="font-['Inter',sans-serif] text-white/40 text-xs mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Events */}
          <div className="lg:col-span-2">
            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">Événements récents</h2>
                <CalendarDays className="w-5 h-5 text-[#cdff71]" />
              </div>
              <div className="space-y-4">
                {events.length === 0 && (
                  <p className="text-white/50 text-sm">Aucun événement pour le moment.</p>
                )}
                {events.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-['Inter',sans-serif] font-semibold text-white text-base mb-1 truncate">{event.title}</h3>
                      <p className="font-['Inter',sans-serif] text-white/60 text-sm">{event.date} {event.time}</p>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-1 justify-end">
                          <Eye className="w-4 h-4 text-white/60" />
                          <span className="font-['Inter',sans-serif] text-white text-sm">{fmt(event.viewerCount ?? 0)}</span>
                        </div>
                        <p className="font-['Inter',sans-serif] text-[#cdff71] text-sm font-semibold">
                          {event.price > 0 ? `${fmt(event.price)} ${event.currency}` : 'Gratuit'}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        event.isLive ? 'bg-red-500/20 text-red-400'
                          : event.isReplay ? 'bg-white/10 text-white/70'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {event.isLive ? 'En live' : event.isReplay ? 'Replay' : 'À venir'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Activity : derniers tickets */}
          <div>
            <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">Derniers achats</h2>
                <Activity className="w-5 h-5 text-[#fcc434]" />
              </div>
              <div className="space-y-4">
                {tickets.length === 0 && (
                  <p className="text-white/50 text-sm">Aucun ticket vendu pour le moment.</p>
                )}
                {tickets.map((t) => (
                  <div key={t.id} className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#cdff71] mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-['Inter',sans-serif] text-white text-sm">
                        <span className="font-semibold">{t.user?.name ?? 'Utilisateur'}</span>{' '}
                        <span className="text-white/60">a acheté un ticket</span>
                        <span className="text-[#cdff71]"> {t.event?.title}</span>
                      </p>
                      <p className="font-['Inter',sans-serif] text-white/40 text-xs mt-1">
                        {timeAgo(t.purchaseDate)} · {t.price > 0 ? `${fmt(t.price)} ${t.currency}` : 'Gratuit'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
