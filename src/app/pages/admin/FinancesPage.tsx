import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { DollarSign, ShoppingCart, TrendingUp, Tv, Download } from 'lucide-react';
import AdminAPI, { type AdminStats, type AdminTicketItem, type AdminChannel } from '../../services/api/AdminAPI';
import { firebaseClientErrorToUserMessage } from '../../utils/firebaseUserFacingError';

function formatFCFA(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M FCFA`;
  if (amount >= 1_000) return `${(amount / 1_000).toFixed(0)}K FCFA`;
  return `${amount.toLocaleString()} FCFA`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function FinancesPage() {
  const [stats, setStats]     = useState<AdminStats | null>(null);
  const [tickets, setTickets] = useState<AdminTicketItem[]>([]);
  const [channels, setChannels] = useState<AdminChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      AdminAPI.getStats(),
      AdminAPI.getRecentTickets(50),
      AdminAPI.getChannels(),
    ])
      .then(([s, t, c]) => { setStats(s); setTickets(t); setChannels(c); })
      .catch(err => setError(firebaseClientErrorToUserMessage(err, 'Erreur de chargement des finances.')))
      .finally(() => setLoading(false));
  }, []);

  const exportCSV = () => {
    const rows = [
      ['Date', 'Utilisateur', 'Email', 'Événement', 'Montant', 'Devise', 'Statut'],
      ...tickets.map(t => [
        formatDate(t.purchaseDate),
        t.user.name,
        t.user.email,
        t.event.title,
        String(t.price),
        t.currency,
        t.status,
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finances-feetiplay-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map(i => <div key={i} className="h-28 rounded-[12px] bg-white/5 animate-pulse" />)}
        </div>
        <div className="h-64 rounded-[12px] bg-white/5 animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-6 py-4 text-white text-sm">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">Finances</h1>
          <p className="font-['Inter',sans-serif] text-white/60">Vue financière en temps réel</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportCSV}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#cdff71] text-black px-6 py-3 rounded-lg font-semibold hover:bg-[#cdff71]/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </motion.button>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Revenus totaux', value: formatFCFA(stats.totalRevenue), sub: `${formatFCFA(stats.revenueThisMonth)} ce mois`, icon: DollarSign, color: 'from-green-500 to-emerald-500' },
            { label: 'Tickets vendus', value: stats.totalTickets.toLocaleString(), sub: `+${stats.ticketsThisMonth} ce mois`, icon: ShoppingCart, color: 'from-purple-500 to-pink-500' },
            { label: 'Revenu moyen / ticket', value: stats.totalTickets > 0 ? formatFCFA(Math.round(stats.totalRevenue / stats.totalTickets)) : '—', sub: 'par transaction', icon: TrendingUp, color: 'from-blue-500 to-cyan-500' },
            { label: 'Chaînes actives', value: stats.totalChannels.toLocaleString(), sub: 'canaux de diffusion', icon: Tv, color: 'from-orange-500 to-amber-500' },
          ].map((kpi, i) => (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6"
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-4`}>
                <kpi.icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-white/60 text-sm mb-1">{kpi.label}</p>
              <p className="text-white font-bold text-2xl">{kpi.value}</p>
              <p className="text-white/40 text-xs mt-1">{kpi.sub}</p>
            </motion.div>
          ))}
        </div>
      )}

      {/* Revenus par chaîne */}
      {channels.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6 mb-6"
        >
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl mb-6">Chaînes</h2>
          <div className="space-y-3">
            {channels.map(ch => {
              const maxSubs = Math.max(...channels.map(c => c.subscriberCount), 1);
              const pct = Math.round((ch.subscriberCount / maxSubs) * 100);
              return (
                <div key={ch.id} className="flex items-center gap-4">
                  <div className="w-36 text-white text-sm font-medium truncate">{ch.name}</div>
                  <div className="flex-1 bg-white/5 rounded-full h-2">
                    <div className="bg-[#cdff71] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-32 text-right">
                    <span className="text-white text-sm">{ch.subscriberCount.toLocaleString()}</span>
                    <span className="text-white/40 text-xs ml-1">abonnés</span>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-white/60 text-sm">{ch._count.events} events</span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Transactions récentes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
        className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">Transactions récentes</h2>
          <span className="text-white/40 text-sm">{tickets.length} enregistrements</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                {['Date', 'Acheteur', 'Événement', 'Montant', 'Statut'].map(h => (
                  <th key={h} className="text-left px-6 py-3 text-white/70 text-sm font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tickets.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-white/40">Aucune transaction</td></tr>
              ) : tickets.map((ticket, i) => (
                <motion.tr
                  key={ticket.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="border-t border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white/60 text-sm font-mono">{formatDate(ticket.purchaseDate)}</td>
                  <td className="px-6 py-4">
                    <p className="text-white text-sm font-semibold">{ticket.user.name}</p>
                    <p className="text-white/50 text-xs">{ticket.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-white/80 text-sm">{ticket.event.title}</td>
                  <td className="px-6 py-4">
                    <span className={`font-bold text-sm ${ticket.price > 0 ? 'text-[#cdff71]' : 'text-white/50'}`}>
                      {ticket.price > 0 ? `${ticket.price.toLocaleString()} ${ticket.currency}` : 'Gratuit'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-400 capitalize">
                      {ticket.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
