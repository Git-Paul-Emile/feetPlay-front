import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { Users, Crown, Radio, UserCheck, TrendingUp, Tv } from 'lucide-react';
import AdminAPI, { type AdminStats } from '../../services/api/AdminAPI';

const ROLE_CONFIG = [
  { key: 'viewer',     label: 'Visiteurs',   color: '#6b7280' },
  { key: 'premium',   label: 'Premium',     color: '#fcc434' },
  { key: 'streamer',  label: 'Streamers',   color: '#a855f7' },
  { key: 'admin',     label: 'Admins',      color: '#cdff71' },
  { key: 'super_admin', label: 'Super Admin', color: '#de0035' },
];

const PLAN_CONFIG = [
  { key: 'free',    label: 'Gratuit',  color: '#6b7280' },
  { key: 'basic',   label: 'Basic',    color: '#60a5fa' },
  { key: 'premium', label: 'Premium',  color: '#fcc434' },
  { key: 'vip',     label: 'VIP',      color: '#de0035' },
];

interface RoleStat { role: string; count: number; label: string; color: string }
interface PlanStat { plan: string; count: number; label: string; color: string }

async function fetchByRole(role: string): Promise<number> {
  try {
    const { total } = await AdminAPI.getUsers({ role, limit: 1 });
    return total;
  } catch { return 0; }
}

async function fetchByPlan(plan: string): Promise<number> {
  // Pas d'endpoint par plan, on filtre côté client via search trick
  // On utilise limit=1 pour juste récupérer le total
  try {
    const { users } = await AdminAPI.getUsers({ limit: 200 });
    return users.filter(u => u.subscriptionPlan === plan).length;
  } catch { return 0; }
}

export function CRMPage() {
  const [stats, setStats]         = useState<AdminStats | null>(null);
  const [roleData, setRoleData]   = useState<RoleStat[]>([]);
  const [planData, setPlanData]   = useState<PlanStat[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [s, allUsers] = await Promise.all([
          AdminAPI.getStats(),
          AdminAPI.getUsers({ limit: 200 }),
        ]);
        setStats(s);

        // Compter par rôle depuis les données récupérées
        const roleCounts = ROLE_CONFIG.map(cfg => ({
          ...cfg,
          count: allUsers.users.filter(u => u.role === cfg.key).length,
        }));
        setRoleData(roleCounts);

        const planCounts = PLAN_CONFIG.map(cfg => ({
          ...cfg,
          count: allUsers.users.filter(u => u.subscriptionPlan === cfg.key).length,
        }));
        setPlanData(planCounts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur de chargement');
      } finally {
        setLoading(false);
      }
    };
    loadAll();
  }, []);

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0,1,2].map(i => <div key={i} className="h-28 rounded-[12px] bg-white/5 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-[12px] bg-white/5 animate-pulse" />
          <div className="h-72 rounded-[12px] bg-white/5 animate-pulse" />
        </div>
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

  const kpis = stats ? [
    { label: 'Utilisateurs total',   value: stats.totalUsers.toLocaleString(),       icon: Users,     color: 'from-blue-500 to-cyan-500' },
    { label: 'Nouveaux ce mois',     value: `+${stats.newUsersThisMonth}`,            icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
    { label: 'Chaînes actives',      value: stats.totalChannels.toLocaleString(),     icon: Tv,        color: 'from-orange-500 to-amber-500' },
    { label: 'Événements créés',     value: stats.totalEvents.toLocaleString(),       icon: Radio,     color: 'from-purple-500 to-pink-500' },
    { label: 'Tickets vendus',       value: stats.totalTickets.toLocaleString(),      icon: UserCheck, color: 'from-[#cdff71] to-[#a8e34f]' },
    { label: 'Abonnés premium+',     value: planData.filter(p => ['premium','vip'].includes(p.plan)).reduce((s,p) => s + p.count, 0).toLocaleString(), icon: Crown, color: 'from-[#fcc434] to-amber-500' },
  ] : [];

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm">
        <p className="text-white font-semibold">{payload[0].name}</p>
        <p style={{ color: payload[0].fill }}>{payload[0].value} utilisateurs</p>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl mb-2">CRM & Analytics</h1>
        <p className="font-['Inter',sans-serif] text-white/60">Vue d'ensemble de la base utilisateurs</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-4"
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${kpi.color} flex items-center justify-center mb-3`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/60 text-xs mb-1 leading-tight">{kpi.label}</p>
            <p className="text-white font-bold text-xl">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Répartition par rôle — Bar chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6"
        >
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-6">Répartition par rôle</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={roleData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="label" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
              <Bar dataKey="count" name="Utilisateurs" radius={[4, 4, 0, 0]}>
                {roleData.map((entry) => (
                  <Cell key={entry.key} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Répartition par plan — Pie chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6"
        >
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-6">Plans d'abonnement</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie
                  data={planData}
                  dataKey="count"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {planData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-2 flex-1">
              {planData.map(p => {
                const total = planData.reduce((s, x) => s + x.count, 0);
                const pct = total > 0 ? Math.round((p.count / total) * 100) : 0;
                return (
                  <div key={p.key} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
                    <span className="text-white/70 text-sm flex-1">{p.label}</span>
                    <span className="text-white font-semibold text-sm">{p.count}</span>
                    <span className="text-white/40 text-xs w-8 text-right">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tableau des rôles détaillé */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[12px] p-6"
      >
        <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg mb-6">Segments utilisateurs</h2>
        <div className="space-y-3">
          {roleData.map(r => {
            const totalUsers = stats?.totalUsers || 1;
            const pct = Math.round((r.count / totalUsers) * 100);
            return (
              <div key={r.key} className="flex items-center gap-4">
                <div className="w-28 text-white/70 text-sm">{r.label}</div>
                <div className="flex-1 bg-white/5 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${pct}%`, backgroundColor: r.color }}
                  />
                </div>
                <div className="w-16 text-right">
                  <span className="text-white text-sm font-semibold">{r.count.toLocaleString()}</span>
                </div>
                <div className="w-10 text-right text-white/40 text-xs">{pct}%</div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
