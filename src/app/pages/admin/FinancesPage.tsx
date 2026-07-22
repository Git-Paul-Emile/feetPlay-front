import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import {
  DollarSign, ShoppingCart, TrendingUp, Tv,
  Download, FileText, Search, Filter, ChevronLeft, ChevronRight,
  AlertCircle, RefreshCw, Tag,
} from 'lucide-react';
import AdminAPI, {
  type AdminStats,
  type AdminTicketItem,
  type AdminChannel,
  type FinanceReport,
  type TicketFilterParams,
} from '../../services/api/AdminAPI';

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatFCFA(amount: number) {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(2)}M FCFA`;
  if (amount >= 1_000)     return `${(amount / 1_000).toFixed(0)}K FCFA`;
  return `${amount.toLocaleString()} FCFA`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function formatMonth(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
}

// ── Composants utilitaires ────────────────────────────────────────────────────

type Tab = 'overview' | 'transactions' | 'report';

function TabBtn({ id, label, icon: Icon, active, onClick }: {
  id: Tab; label: string; icon: React.ElementType; active: boolean; onClick: (id: Tab) => void;
}) {
  return (
    <button
      id={`finance-tab-${id}`}
      onClick={() => onClick(id)}
      className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-all font-['Inter',sans-serif] ${
        active ? 'bg-[#cdff71] text-black' : 'text-white/60 hover:text-white hover:bg-white/5'
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

function KpiCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string; sub?: string; icon: React.ElementType; color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/8 rounded-xl p-5"
    >
      <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ backgroundColor: `${color}22` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      <p className="font-['Inter',sans-serif] text-white/50 text-sm mb-1">{label}</p>
      <p className="font-['Inter',sans-serif] font-bold text-white text-2xl">{value}</p>
      {sub && <p className="font-['Inter',sans-serif] text-white/30 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

// ── Onglet Vue globale ────────────────────────────────────────────────────────

function OverviewTab() {
  const [stats, setStats]       = useState<AdminStats | null>(null);
  const [channels, setChannels] = useState<AdminChannel[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  useEffect(() => {
    Promise.all([AdminAPI.getStats(), AdminAPI.getChannels()])
      .then(([s, c]) => { setStats(s); setChannels(c); })
      .catch(e => setError(e.message ?? 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-32" />)}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (error) return <ErrorBanner message={error} />;

  return (
    <div className="space-y-6">
      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard label="Revenus totaux"        value={formatFCFA(stats.totalRevenue)}    sub={`+${formatFCFA(stats.revenueThisMonth)} ce mois`} icon={DollarSign}  color="#cdff71" />
          <KpiCard label="Tickets vendus"        value={stats.totalTickets.toLocaleString()} sub={`+${stats.ticketsThisMonth} ce mois`}          icon={ShoppingCart} color="#4f46e5" />
          <KpiCard label="Revenu moyen / ticket" value={stats.totalTickets > 0 ? formatFCFA(Math.round(stats.totalRevenue / stats.totalTickets)) : '—'} sub="par transaction" icon={TrendingUp} color="#f59e0b" />
          <KpiCard label="Chaînes actives"       value={stats.totalChannels.toLocaleString()} sub="canaux de diffusion"                          icon={Tv}           color="#10b981" />
        </div>
      )}

      {/* Revenus par chaîne */}
      {channels.length > 0 && (
        <div className="bg-white/5 border border-white/8 rounded-xl p-6">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-5">Chaînes — abonnés</h2>
          <div className="space-y-3">
            {channels.map(ch => {
              const maxSubs = Math.max(...channels.map(c => c.subscriberCount), 1);
              const pct = Math.round((ch.subscriberCount / maxSubs) * 100);
              return (
                <div key={ch.id} className="flex items-center gap-4">
                  <p className="w-36 text-white text-sm font-medium truncate">{ch.name}</p>
                  <div className="flex-1 bg-white/5 rounded-full h-1.5">
                    <div className="bg-[#cdff71] h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-28 text-right text-white/60 text-sm">{ch.subscriberCount.toLocaleString()} abn.</span>
                  <span className="w-20 text-right text-white/30 text-xs">{ch._count.events} events</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Onglet Transactions ───────────────────────────────────────────────────────

const PAGE_SIZE = 50;

const STATUS_COLORS: Record<string, string> = {
  valid:   'bg-green-500/20 text-green-400',
  used:    'bg-blue-500/20 text-blue-400',
  expired: 'bg-red-500/20 text-red-400',
};

function TransactionsTab() {
  const [tickets, setTickets]   = useState<AdminTicketItem[]>([]);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [filters, setFilters]   = useState<TicketFilterParams>({});

  const load = useCallback((f: TicketFilterParams, p: number) => {
    setLoading(true);
    AdminAPI.getAllTickets({ ...f, limit: PAGE_SIZE, offset: p * PAGE_SIZE })
      .then(({ tickets: t, total: tot }) => { setTickets(t); setTotal(tot); })
      .catch(e => setError(e.message ?? 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(filters, page); }, [load, filters, page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const exportCSV = () => {
    const rows = [
      ['Date', 'Acheteur', 'Email', 'Événement', 'Catégorie', 'Montant', 'Devise', 'Statut'],
      ...tickets.map(t => [
        formatDate(t.purchaseDate),
        t.user.name,
        t.user.email,
        t.event.title,
        (t.event as any).category ?? '',
        String(t.price),
        t.currency,
        t.status,
      ]),
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv, ''], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `transactions-feetiplay-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(tickets, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `transactions-feetiplay-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <div className="space-y-4">
      {error && <ErrorBanner message={error} />}

      {/* Filtres */}
      <div className="flex flex-wrap gap-3 p-4 bg-white/3 border border-white/8 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-white/40" />
          <span className="font-['Inter',sans-serif] text-white/40 text-sm">Filtres</span>
        </div>

        <select
          id="finance-filter-status"
          value={filters.status ?? ''}
          onChange={e => { setPage(0); setFilters(f => ({ ...f, status: e.target.value || undefined })); }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-[#cdff71]/50"
        >
          <option value="">Tous statuts</option>
          <option value="valid">Valide</option>
          <option value="used">Utilisé</option>
          <option value="expired">Expiré</option>
        </select>

        <input
          id="finance-filter-from"
          type="date"
          value={filters.dateFrom ?? ''}
          onChange={e => { setPage(0); setFilters(f => ({ ...f, dateFrom: e.target.value || undefined })); }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-[#cdff71]/50"
          placeholder="Date début"
        />

        <input
          id="finance-filter-to"
          type="date"
          value={filters.dateTo ?? ''}
          onChange={e => { setPage(0); setFilters(f => ({ ...f, dateTo: e.target.value || undefined })); }}
          className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-[#cdff71]/50"
        />

        <input
          id="finance-filter-min"
          type="number"
          value={filters.minPrice ?? ''}
          onChange={e => { setPage(0); setFilters(f => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : undefined })); }}
          className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-[#cdff71]/50"
          placeholder="Min FCFA"
        />
        <input
          id="finance-filter-max"
          type="number"
          value={filters.maxPrice ?? ''}
          onChange={e => { setPage(0); setFilters(f => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined })); }}
          className="w-28 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-sm outline-none focus:border-[#cdff71]/50"
          placeholder="Max FCFA"
        />

        <button
          id="finance-reset-filters"
          onClick={() => { setFilters({}); setPage(0); }}
          className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white text-sm transition-colors"
        >
          Réinitialiser
        </button>

        <div className="ml-auto flex items-center gap-2">
          <button id="finance-export-csv"  onClick={exportCSV}  className="flex items-center gap-1.5 px-3 py-1.5 bg-[#cdff71]/10 border border-[#cdff71]/20 rounded-lg text-[#cdff71] text-xs font-medium hover:bg-[#cdff71]/20 transition-colors">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          <button id="finance-export-json" onClick={exportJSON} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white/60 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            <FileText className="w-3.5 h-3.5" /> JSON
          </button>
        </div>
      </div>

      <p className="font-['Inter',sans-serif] text-white/30 text-xs">
        {total} transaction{total !== 1 ? 's' : ''} — consultation uniquement
      </p>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-white/30">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span className="text-sm">Chargement…</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-white/8">
                <tr>
                  {['Date', 'Acheteur', 'Événement', 'Montant', 'Statut'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-['Inter',sans-serif] text-white/40 text-xs font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tickets.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-12 text-center text-white/30 text-sm">Aucune transaction</td></tr>
                ) : tickets.map(ticket => (
                  <tr key={ticket.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="px-5 py-3 font-mono text-white/50 text-xs">{formatDate(ticket.purchaseDate)}</td>
                    <td className="px-5 py-3">
                      <p className="font-['Inter',sans-serif] text-white text-sm">{ticket.user.name}</p>
                      <p className="font-['Inter',sans-serif] text-white/40 text-xs">{ticket.user.email}</p>
                    </td>
                    <td className="px-5 py-3 font-['Inter',sans-serif] text-white/70 text-sm max-w-[220px] truncate">{ticket.event.title}</td>
                    <td className="px-5 py-3">
                      <span className={`font-bold text-sm ${ticket.price > 0 ? 'text-[#cdff71]' : 'text-white/40'}`}>
                        {ticket.price > 0 ? `${ticket.price.toLocaleString()} ${ticket.currency}` : 'Gratuit'}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${STATUS_COLORS[ticket.status] ?? 'bg-white/10 text-white/40'}`}>
                        {ticket.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="font-['Inter',sans-serif] text-white/30 text-sm">
            Page {page + 1} / {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              id="finance-prev-page"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              id="finance-next-page"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Onglet Rapport mensuel ────────────────────────────────────────────────────

function ReportTab() {
  const [report, setReport]   = useState<FinanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    AdminAPI.getFinanceReport()
      .then(setReport)
      .catch(e => setError(e.message ?? 'Erreur'))
      .finally(() => setLoading(false));
  }, []);

  const exportReport = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `rapport-comptable-feetiplay-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const exportReportCSV = () => {
    if (!report) return;
    const rows = [
      ['Mois', 'Revenus (FCFA)', 'Tickets payants', 'Tickets gratuits'],
      ...report.months.map(m => [formatMonth(m.month), String(m.revenue), String(m.ticketCount), String(m.freeCount)]),
    ];
    const csv  = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `rapport-mensuel-feetiplay-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-64" />
        <Skeleton className="h-48" />
      </div>
    );
  }
  if (error || !report) return <ErrorBanner message={error ?? 'Données indisponibles'} />;

  const totalRevenue = report.months.reduce((s, m) => s + m.revenue, 0);
  const totalTickets = report.months.reduce((s, m) => s + m.ticketCount, 0);
  const chartData    = report.months.map(m => ({ name: formatMonth(m.month), revenus: m.revenue, tickets: m.ticketCount }));

  return (
    <div className="space-y-6">
      {/* Actions export */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-['Inter',sans-serif] text-white/60 text-sm">Agrégats des 12 derniers mois</p>
          <p className="font-['Inter',sans-serif] font-bold text-white text-xl mt-1">
            {formatFCFA(totalRevenue)} · {totalTickets.toLocaleString()} tickets payants
          </p>
        </div>
        <div className="flex gap-2">
          <button id="finance-report-csv"  onClick={exportReportCSV}  className="flex items-center gap-1.5 px-4 py-2 bg-[#cdff71]/10 border border-[#cdff71]/20 rounded-lg text-[#cdff71] text-sm font-medium hover:bg-[#cdff71]/20 transition-colors">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button id="finance-report-json" onClick={exportReport}      className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white/60 text-sm hover:text-white hover:bg-white/10 transition-colors">
            <FileText className="w-4 h-4" /> Export JSON
          </button>
        </div>
      </div>

      {/* Graphique revenus */}
      <div className="bg-white/5 border border-white/8 rounded-xl p-5">
        <h3 className="font-['Inter',sans-serif] font-semibold text-white mb-4">Revenus mensuels (FCFA)</h3>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={v => v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(v: number) => [formatFCFA(v), 'Revenus']}
              labelStyle={{ color: 'white' }}
              itemStyle={{ color: '#cdff71' }}
            />
            <Bar dataKey="revenus" fill="#cdff71" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top événements */}
      {report.topEvents.length > 0 && (
        <div className="bg-white/5 border border-white/8 rounded-xl overflow-x-auto">
          <div className="p-5 border-b border-white/8 flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#cdff71]" />
            <h3 className="font-['Inter',sans-serif] font-semibold text-white">Top événements par revenus</h3>
          </div>
          <table className="w-full">
            <thead className="border-b border-white/8">
              <tr>
                {['#', 'Événement', 'Catégorie', 'Tickets', 'Revenus'].map(h => (
                  <th key={h} className="text-left px-5 py-3 font-['Inter',sans-serif] text-white/40 text-xs font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {report.topEvents.map((e, i) => (
                <tr key={e.eventId} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                  <td className="px-5 py-3 text-white/30 text-sm">{i + 1}</td>
                  <td className="px-5 py-3 text-white text-sm max-w-[220px] truncate">{e.title}</td>
                  <td className="px-5 py-3 text-white/50 text-sm">{e.category}</td>
                  <td className="px-5 py-3 text-white/60 text-sm">{e.ticketCount.toLocaleString()}</td>
                  <td className="px-5 py-3 font-bold text-[#cdff71] text-sm">{formatFCFA(e.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tableau mensuel détaillé */}
      <div className="bg-white/5 border border-white/8 rounded-xl overflow-x-auto">
        <div className="p-5 border-b border-white/8">
          <h3 className="font-['Inter',sans-serif] font-semibold text-white">Détail par mois</h3>
        </div>
        <table className="w-full">
          <thead className="border-b border-white/8">
            <tr>
              {['Mois', 'Revenus', 'Tickets payants', 'Tickets gratuits'].map(h => (
                <th key={h} className="text-left px-5 py-3 font-['Inter',sans-serif] text-white/40 text-xs font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...report.months].reverse().map(m => (
              <tr key={m.month} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                <td className="px-5 py-3 font-['Inter',sans-serif] text-white text-sm font-medium">{formatMonth(m.month)}</td>
                <td className="px-5 py-3 font-bold text-[#cdff71] text-sm">{m.revenue > 0 ? formatFCFA(m.revenue) : <span className="text-white/20">—</span>}</td>
                <td className="px-5 py-3 text-white/60 text-sm">{m.ticketCount}</td>
                <td className="px-5 py-3 text-white/40 text-sm">{m.freeCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'overview',      label: 'Vue globale',   icon: TrendingUp },
  { id: 'transactions',  label: 'Transactions',  icon: ShoppingCart },
  { id: 'report',        label: 'Rapport',       icon: FileText },
];

export function FinancesPage() {
  const [tab, setTab] = useState<Tab>('overview');

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-2xl">Finances</h1>
          </div>
          <p className="font-['Inter',sans-serif] text-white/40 text-sm">
            Suivi financier · ventes de tickets · rapports comptables
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-900/20 border border-blue-500/25 rounded-xl">
          <Search className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="font-['Inter',sans-serif] text-blue-300 text-xs">
            Lecture seule · modification d'événements ou de profils non autorisée
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/3 border border-white/8 rounded-xl w-fit">
        {TABS.map(t => (
          <TabBtn key={t.id} id={t.id} label={t.label} icon={t.icon} active={tab === t.id} onClick={setTab} />
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'overview'     && <OverviewTab />}
          {tab === 'transactions' && <TransactionsTab />}
          {tab === 'report'       && <ReportTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
