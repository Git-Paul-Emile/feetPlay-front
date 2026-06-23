import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Search, Filter, Download, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

import AdminAPI, { SystemLogItem } from '../../services/api/AdminAPI';

export function SystemLogs() {
  const [logs, setLogs] = useState<SystemLogItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AdminAPI.getLogs({ limit: 100 })
      .then(res => setLogs(res.logs))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const levelConfig = {
    info: {
      icon: Info,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      label: 'Info',
    },
    success: {
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
      label: 'Succès',
    },
    warning: {
      icon: AlertTriangle,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
      label: 'Attention',
    },
    error: {
      icon: AlertCircle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
      label: 'Erreur',
    },
  };

  const filteredLogs = logs.filter(log => {
    const matchesSearch = 
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterLevel === 'all' || log.level === filterLevel;
    return matchesSearch && matchesFilter;
  });

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `feeti-logs-${new Date().toISOString()}.json`;
    link.click();
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
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
          Exporter les logs
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Info className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Info</p>
              <p className="text-white font-bold text-xl">
                {logs.filter(l => l.level === 'info').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Succès</p>
              <p className="text-white font-bold text-xl">
                {logs.filter(l => l.level === 'success').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Attention</p>
              <p className="text-white font-bold text-xl">
                {logs.filter(l => l.level === 'warning').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-white/60 text-sm">Erreurs</p>
              <p className="text-white font-bold text-xl">
                {logs.filter(l => l.level === 'error').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Rechercher dans les logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-white/40 outline-none focus:border-[#cdff71] transition-colors"
          />
        </div>

        {/* Level filter */}
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white outline-none focus:border-[#cdff71] transition-colors appearance-none cursor-pointer min-w-[200px]"
          >
            <option value="all">Tous les niveaux</option>
            <option value="info">Info</option>
            <option value="success">Succès</option>
            <option value="warning">Attention</option>
            <option value="error">Erreur</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="text-left px-6 py-4 font-['Inter',sans-serif] text-white/80 text-sm font-semibold">
                  Niveau
                </th>
                <th className="text-left px-6 py-4 font-['Inter',sans-serif] text-white/80 text-sm font-semibold">
                  Action
                </th>
                <th className="text-left px-6 py-4 font-['Inter',sans-serif] text-white/80 text-sm font-semibold">
                  Description
                </th>
                <th className="text-left px-6 py-4 font-['Inter',sans-serif] text-white/80 text-sm font-semibold">
                  Utilisateur
                </th>
                <th className="text-left px-6 py-4 font-['Inter',sans-serif] text-white/80 text-sm font-semibold">
                  Date & Heure
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, index) => {
                const config = levelConfig[log.level];
                const Icon = config.icon;
                
                return (
                  <motion.tr
                    key={log.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${config.bg}`}>
                        <Icon className={`w-4 h-4 ${config.color}`} />
                        <span className={`text-xs font-semibold ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-['Inter',sans-serif] text-white text-sm font-medium">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-['Inter',sans-serif] text-white/80 text-sm">
                        {log.description}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-['Inter',sans-serif] text-white text-sm">
                          {log.adminName}
                        </p>
                        <p className="font-['Inter',sans-serif] text-white/60 text-xs">
                          {log.adminRole}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-['Inter',sans-serif] text-white/60 text-sm font-mono">
                        {formatDate(log.createdAt)}
                      </span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredLogs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <p className="font-['Inter',sans-serif] text-white/60 text-lg">
              Aucun log trouvé
            </p>
          </div>
        )}
      </div>

      {/* Total count */}
      <div className="mt-4 text-center">
        <p className="font-['Inter',sans-serif] text-white/60 text-sm">
          Affichage de {filteredLogs.length} sur {logs.length} logs
        </p>
      </div>
    </div>
  );
}
