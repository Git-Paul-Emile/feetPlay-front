import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Users, CalendarDays, TrendingUp, DollarSign,
  Eye, ShoppingCart, Activity, ArrowUp, Tv,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import AdminAPI, { type AdminStats, type AdminEventItem, type AdminTicketItem } from '../../services/api/AdminAPI';

function formatFCFA(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M FCFA`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K FCFA`;
  return `${amount.toLocaleString()} FCFA`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function AdminDashboard() {
  const { user, hasPermission } = useAdminAuth();

  const [stats, setStats]           = useState<AdminStats | null>(null);
  const [events, setEvents]         = useState<AdminEventItem[]>([]);
  const [tickets, setTickets]       = useState<AdminTicketItem[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  useEffect(() => {
    const requests: Promise<any>[] = [AdminAPI.getStats(), AdminAPI.getRecentEvents(5)];
    if (hasPermission('view_finances')) requests.push(AdminAPI.getRecentTickets(6));

    Promise.all(requests)
      .then(([s, e, t]) => {
        setStats(s);
        setEvents(e);
        if (t) setTickets(t);
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [hasPermission]);

  const statCards = stats ? [
    {
      name: 'Utilisateurs',
      value: stats.totalUsers.toLocaleString(),
      sub: `+${stats.newUsersThisMonth} ce mois`,
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: stats.newUsersThisMonth > 0 ? 'up' : 'neutral',
    },
    {
      name: 'Événements',
      value: stats.totalEvents.toLocaleString(),
      sub: `${stats.liveEvents} en direct`,
      icon: CalendarDays,
      color: 'from-[#cdff71] to-[#a8e34f]',
      trend: stats.liveEvents > 0 ? 'up' : 'neutral',
    },
    {
      name: 'Tickets vendus',
      value: stats.totalTickets.toLocaleString(),
      sub: `+${stats.ticketsThisMonth} ce mois`,
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
      trend: stats.ticketsThisMonth > 0 ? 'up' : 'neutral',
    },
    {
      name: 'Chaînes actives',
      value: stats.totalChannels.toLocaleString(),
      sub: 'canaux diffusion',
      icon: Tv,
      color: 'from-orange-500 to-amber-500',
      trend: 'neutral',
    },
    ...(hasPermission('view_finances') ? [{
      name: 'Revenus totaux',
      value: formatFCFA(stats.totalRevenue),
      sub: `${formatFCFA(stats.revenueThisMonth)} ce mois`,
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      trend: stats.revenueThisMonth > 0 ? 'up' : 'neutral',
    }] : []),
  ] : [];

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="h-32 rounded-[12px] bg-white/5 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-64 rounded-[12px] bg-white/5 animate-pulse" />
          <div className="h-64 rounded-[12px] bg-white/5 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-6 py-4 text-white text-sm">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-2">
          Bienvenue, {user?.name}
        </h1>
        <p className="font-['Inter',sans-serif] text-white/60 text-base">
          Aperçu en temps réel de votre plateforme FEETI PLAY
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              {stat.trend === 'up' && (
                <div className="flex items-center gap-1 text-xs font-semibold text-green-400">
                  <ArrowUp className="w-3 h-3" />
                </div>
              )}
            </div>
            <p className="font-['Inter',sans-serif] text-white/60 text-sm mb-1">{stat.name}</p>
            <p className="font-['DM_Sans',sans-serif] font-bold text-white text-2xl">{stat.value}</p>
            <p className="font-['Inter',sans-serif] text-white/40 text-xs mt-1">{stat.sub}</p>
          </motion.div>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Événements récents */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">
                Événements récents
              </h2>
              <CalendarDays className="w-5 h-5 text-[#cdff71]" />
            </div>

            {events.length === 0 ? (
              <p className="text-white/40 text-sm text-center py-8">Aucun événement</p>
            ) : (
              <div className="space-y-3">
                {events.map(event => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                    <div className="flex gap-3 items-center flex-1 min-w-0">
                      <img src={event.image} alt={event.title} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-['Inter',sans-serif] font-semibold text-white text-sm truncate">{event.title}</h3>
                        <p className="text-white/50 text-xs">{event.channel.name} · {formatDate(event.date)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <Eye className="w-3 h-3" />
                        {event.viewerCount.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1 text-white/60 text-xs">
                        <ShoppingCart className="w-3 h-3" />
                        {event._count.tickets}
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${event.isLive ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                        {event.isLive ? 'Live' : 'Planifié'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Tickets récents ou activité */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">
                {hasPermission('view_finances') ? 'Tickets récents' : 'Activité récente'}
              </h2>
              <Activity className="w-5 h-5 text-[#fcc434]" />
            </div>

            {hasPermission('view_finances') ? (
              tickets.length === 0 ? (
                <p className="text-white/40 text-sm text-center py-8">Aucun ticket</p>
              ) : (
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#cdff71] mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-['Inter',sans-serif] text-white text-sm truncate">
                          <span className="font-semibold">{ticket.user.name}</span>
                          <span className="text-white/60"> · {ticket.event.title}</span>
                        </p>
                        <p className="text-[#cdff71] text-xs font-semibold">
                          {ticket.price > 0 ? `${ticket.price.toLocaleString()} ${ticket.currency}` : 'Gratuit'}
                        </p>
                        <p className="text-white/40 text-xs">{formatDate(ticket.purchaseDate)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-8 gap-2">
                <TrendingUp className="w-10 h-10 text-white/20" />
                <p className="text-white/40 text-sm">Données réservées aux finances</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
