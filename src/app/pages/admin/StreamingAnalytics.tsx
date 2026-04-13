import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Radio, PlayCircle, Eye, TrendingUp, Clock, AlertTriangle } from 'lucide-react';
import BaseAPIService from '../../services/api/BaseAPI';

// ── Types ────────────────────────────────────────────────────────────────────

interface AnalyticsData {
  topByViewers: Array<{ id: string; title: string; category: string; isLive: boolean; isReplay: boolean; viewerCount: number; isFree: boolean }>;
  topByWatchSessions: Array<{ eventId: string; eventTitle: string; sessions: number; avgProgress: number }>;
  totalWatchSessions: number;
  watchSessionsThisMonth: number;
  liveCount: number;
  replayCount: number;
  categoryDistribution: Array<{ category: string; count: number }>;
  avgWatchProgress: number;
}

// ── Service ──────────────────────────────────────────────────────────────────

class AnalyticsAPIService extends BaseAPIService {
  async getStreamingAnalytics(): Promise<AnalyticsData> {
    const res = await this.request('admin:analytics:streaming', () =>
      this.fetchApi<AnalyticsData>('/admin/analytics/streaming', { useAdminToken: true } as any),
      { cache: false }
    );
    if (!res.data) throw new Error('Impossible de charger les analytics');
    return res.data;
  }
}

const AnalyticsAPI = new AnalyticsAPIService();

// ── Couleurs graphique ────────────────────────────────────────────────────────

const PIE_COLORS = ['#DE0035', '#CDFF71', '#4f46e5', '#f59e0b', '#10b981', '#06b6d4', '#8b5cf6', '#ec4899'];

// ── Composants ───────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color }: {
  icon: React.ElementType; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-white/5 border border-white/8 rounded-xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center`} style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
      </div>
      <p className="font-['Inter',sans-serif] text-white/50 text-sm mb-1">{label}</p>
      <p className="font-['Inter',sans-serif] font-bold text-white text-2xl">{value}</p>
      {sub && <p className="font-['Inter',sans-serif] text-white/30 text-xs mt-1">{sub}</p>}
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────

export function StreamingAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    AnalyticsAPI.getStreamingAnalytics()
      .then(setData)
      .catch(e => setError(e.message ?? 'Erreur de chargement'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 flex items-center gap-3 bg-red-900/20 border border-red-500/30 rounded-xl">
        <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
        <p className="text-white/70 text-sm">{error ?? 'Données indisponibles'}</p>
      </div>
    );
  }

  // Truncate long titles for charts
  const truncate = (s: string, n = 20) => s.length > n ? s.slice(0, n) + '…' : s;

  const topViewersChart = data.topByViewers.map(e => ({
    name: truncate(e.title),
    viewers: e.viewerCount,
    type: e.isLive ? 'Live' : 'Replay',
  }));

  const topSessionsChart = data.topByWatchSessions.map(e => ({
    name: truncate(e.eventTitle),
    sessions: e.sessions,
    progress: e.avgProgress,
  }));

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="font-['Inter',sans-serif] font-bold text-white text-xl mb-1">
          Analytics Streaming
        </h2>
        <p className="font-['Inter',sans-serif] text-white/40 text-sm">
          Données en temps réel — visionnages, replays, audiences
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Sessions de visionnage" value={data.totalWatchSessions.toLocaleString()} sub={`+${data.watchSessionsThisMonth} ce mois`} color="#CDFF71" />
        <StatCard icon={Radio} label="Lives actifs" value={data.liveCount} color="#DE0035" />
        <StatCard icon={PlayCircle} label="Replays disponibles" value={data.replayCount} color="#4f46e5" />
        <StatCard icon={TrendingUp} label="Progression moyenne" value={`${data.avgWatchProgress}%`} sub="de chaque replay regardé" color="#f59e0b" />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top par viewers */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-5">
          <h3 className="font-['Inter',sans-serif] font-semibold text-white mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#CDFF71]" />
            Top événements par spectateurs
          </h3>
          {topViewersChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topViewersChart} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: 'white' }}
                  itemStyle={{ color: '#CDFF71' }}
                />
                <Bar dataKey="viewers" fill="#DE0035" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-white/30 text-sm">
              Aucune donnée de viewers
            </div>
          )}
        </div>

        {/* Top par sessions */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-5">
          <h3 className="font-['Inter',sans-serif] font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#CDFF71]" />
            Top replays par sessions de visionnage
          </h3>
          {topSessionsChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topSessionsChart} layout="vertical" margin={{ left: 0, right: 20 }}>
                <XAxis type="number" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  labelStyle={{ color: 'white' }}
                  formatter={(v: number, name: string) => [v, name === 'sessions' ? 'Sessions' : 'Progression moy.']}
                  itemStyle={{ color: '#CDFF71' }}
                />
                <Bar dataKey="sessions" fill="#4f46e5" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[260px] flex items-center justify-center text-white/30 text-sm">
              Aucun historique de visionnage
            </div>
          )}
        </div>

        {/* Distribution par catégorie */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-5">
          <h3 className="font-['Inter',sans-serif] font-semibold text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#CDFF71]" />
            Distribution par catégorie
          </h3>
          {data.categoryDistribution.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width="55%" height={220}>
                <PieChart>
                  <Pie
                    data={data.categoryDistribution}
                    dataKey="count"
                    nameKey="category"
                    cx="50%" cy="50%"
                    outerRadius={90}
                    innerRadius={50}
                  >
                    {data.categoryDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    itemStyle={{ color: 'white' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {data.categoryDistribution.map((cat, i) => (
                  <div key={cat.category} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="font-['Inter',sans-serif] text-white/70 text-xs truncate flex-1">{cat.category}</span>
                    <span className="font-['Inter',sans-serif] text-white/40 text-xs">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-white/30 text-sm">
              Aucun événement
            </div>
          )}
        </div>

        {/* Live vs Replay */}
        <div className="bg-white/5 border border-white/8 rounded-xl p-5">
          <h3 className="font-['Inter',sans-serif] font-semibold text-white mb-4 flex items-center gap-2">
            <Radio className="w-4 h-4 text-[#CDFF71]" />
            Live vs Replay
          </h3>
          <div className="flex items-center gap-6 mt-4">
            <ResponsiveContainer width="55%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Lives', value: data.liveCount },
                    { name: 'Replays', value: data.replayCount },
                    { name: 'Autres', value: Math.max(0, (data.topByViewers.length || 0) - data.liveCount - data.replayCount) },
                  ].filter(d => d.value > 0)}
                  dataKey="value"
                  cx="50%" cy="50%"
                  outerRadius={85}
                  innerRadius={45}
                >
                  <Cell fill="#DE0035" />
                  <Cell fill="#4f46e5" />
                  <Cell fill="rgba(255,255,255,0.1)" />
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#111', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                  itemStyle={{ color: 'white' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#DE0035]" />
                  <span className="font-['Inter',sans-serif] text-white/60 text-sm">Lives actifs</span>
                </div>
                <p className="font-['Inter',sans-serif] font-bold text-white text-2xl ml-5">{data.liveCount}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full bg-[#4f46e5]" />
                  <span className="font-['Inter',sans-serif] text-white/60 text-sm">Replays</span>
                </div>
                <p className="font-['Inter',sans-serif] font-bold text-white text-2xl ml-5">{data.replayCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table top replays */}
      {data.topByWatchSessions.length > 0 && (
        <div className="bg-white/5 border border-white/8 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-white/8">
            <h3 className="font-['Inter',sans-serif] font-semibold text-white flex items-center gap-2">
              <PlayCircle className="w-4 h-4 text-[#CDFF71]" />
              Détail des replays les plus regardés
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">#</th>
                  <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">Événement</th>
                  <th className="text-right p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">Sessions</th>
                  <th className="text-right p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium">Progression moy.</th>
                  <th className="text-left p-4 font-['Inter',sans-serif] text-white/40 text-xs font-medium w-40">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {data.topByWatchSessions.map((row, i) => (
                  <tr key={row.eventId} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                    <td className="p-4 font-['Inter',sans-serif] text-white/30 text-sm">{i + 1}</td>
                    <td className="p-4 font-['Inter',sans-serif] text-white text-sm max-w-[280px] truncate">{row.eventTitle}</td>
                    <td className="p-4 text-right font-['Inter',sans-serif] text-white/70 text-sm">{row.sessions.toLocaleString()}</td>
                    <td className="p-4 text-right font-['Inter',sans-serif] text-sm" style={{ color: row.avgProgress >= 75 ? '#CDFF71' : 'rgba(255,255,255,0.6)' }}>
                      {row.avgProgress}%
                    </td>
                    <td className="p-4">
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${row.avgProgress}%`, backgroundColor: row.avgProgress >= 75 ? '#CDFF71' : '#DE0035' }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
