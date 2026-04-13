import { useState, useEffect, useCallback } from 'react';
import { motion } from 'motion/react';
import {
  FileText, Search, Filter, Download,
  AlertCircle, CheckCircle, Info, AlertTriangle,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import AdminAPI, { type SystemLogItem } from '../../services/api/AdminAPI';

const PAGE_SIZE = 50;

const levelConfig = {
  info:    { icon: Info,          color: 'text-blue-400',   bg: 'bg-blue-500/10',   label: 'Info'      },
  success: { icon: CheckCircle,   color: 'text-green-400',  bg: 'bg-green-500/10',  label: 'Succès'    },
  warning: { icon: AlertTriangle, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: 'Attention' },
  error:   { icon: AlertCircle,   color: 'text-red-400',    bg: 'bg-red-500/10',    label: 'Erreur'    },
} as const;

function formatDate(timestamp: string) {
  return new Date(timestamp).toLocaleString('fr-FR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
}

export function SystemLogs() {
  const [logs, setLogs]       = useState<SystemLogItem[]>([]);
  const [total, setTotal]     = useState(0);
  const [page, setPage]       = useState(0);
  const [search, setSearch]   = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    setError(null);
    AdminAPI.getLogs({
      level: filterLevel || undefined,
      search: search || undefined,
      limit: PAGE_SIZE,
      offset: page * PAGE_SIZE,
    })
      .then(({ logs: l, total: t }) => { setLogs(l); setTotal(t); })
      .catch(err => setError(err instanceof Error ? err.message : 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, [filterLevel, search, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(0); }, [search, filterLevel]);

  const exportLogs = () => {
    const rows = [
      ['Date', 'Niveau', 'Action', 'Description', 'Admin', 'Rôle', 'IP'],
      ...logs.map(l => [
        formatDate(l.createdAt), l.level, l.action, l.description,
        l.adminName, l.adminRole, l.ipAddress ?? '',
      ]),
    ];
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feeti-logs-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const counts = {
    info: logs.filter(l => l.level === 'info').length,
    success: logs.filter(l => l.level === 'success').length,
    warning: logs.filter(l => l.level === 'warning').length,
    error: logs.filter(l => l.level === 'error').length,
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">
            Logs système
          </h1>
          <p className="font-['Inter',sans-serif] text-white/60 text-base">
            Historique de toutes les actions administratives
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={exportLogs}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-[#cdff71] text-black px-6 py-3 rounded-lg font-['Inter',sans-serif] font-semibold hover:bg-[#cdff71]/90 transition-colors"
        >
          <Download className="w-5 h-5" />
          Exporter CSV
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {(Object.entries(levelConfig) as [keyof typeof levelConfig, (typeof levelConfig)[keyof typeof levelConfig]][]).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setFilterLevel(prev => prev === key ? '' : key)}
              className={`bg-[rgba(255,255,255,0.05)] border rounded-lg p-4 transition-colors text-left ${filterLevel === key ? 'border-[#cdff71]' : 'border-white/10 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${cfg.bg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${cfg.color}`} />
                </div>
                <div>
                  <p className="text-white/60 text-sm">{cfg.label}</p>
                  <p className="text-white font-bold text-xl">{counts[key]}</p>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-[#DE0035]/30 bg-[#DE0035]/10 px-4 py-3 text-sm text-white">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher dans les logs..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#cdff71] transition-colors"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <select
            value={filterLevel}
            onChange={e => setFilterLevel(e.target.value)}
            className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white outline-none focus:border-[#cdff71] transition-colors appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="">Tous les niveaux</option>
            <option value="info">Info</option>
            <option value="success">Succès</option>
            <option value="warning">Attention</option>
            <option value="error">Erreur</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                {['Niveau', 'Action', 'Description', 'Administrateur', 'Date & Heure'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-white/80 text-sm font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 8 }, (_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-5 bg-white/5 rounded animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : logs.map((log, index) => {
                const cfg = levelConfig[log.level] ?? levelConfig.info;
                const Icon = cfg.icon;
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${cfg.bg}`}>
                        <Icon className={`w-4 h-4 ${cfg.color}`} />
                        <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-white text-sm font-medium">{log.action}</td>
                    <td className="px-6 py-4 text-white/80 text-sm max-w-xs truncate">{log.description}</td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{log.adminName}</p>
                      <p className="text-white/50 text-xs capitalize">{log.adminRole}</p>
                    </td>
                    <td className="px-6 py-4 text-white/60 text-sm font-mono whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {!loading && logs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="text-white/60 text-lg">Aucun log trouvé</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-white/50 text-sm">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} sur {total.toLocaleString()} entrées
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-30 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-white/60 text-sm px-2">{page + 1} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg disabled:opacity-30 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
