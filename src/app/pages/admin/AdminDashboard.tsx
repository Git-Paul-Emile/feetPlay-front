import { motion } from 'motion/react';
import {
  Users,
  CalendarDays,
  TrendingUp,
  DollarSign,
  Eye,
  ShoppingCart,
  Activity,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';

export function AdminDashboard() {
  const { user } = useAdminAuth();

  const stats = [
    {
      name: 'Utilisateurs actifs',
      value: '12,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'Événements en ligne',
      value: '234',
      change: '+8.2%',
      trend: 'up',
      icon: CalendarDays,
      color: 'from-[#cdff71] to-[#a8e34f]',
    },
    {
      name: 'Revenus du mois',
      value: '24.5M FCFA',
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Tickets vendus',
      value: '8,234',
      change: '-2.4%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'from-purple-500 to-pink-500',
    },
  ];

  const recentEvents = [
    {
      id: 1,
      name: 'CHAN 2025 - Finale',
      date: '15 Mars 2025',
      status: 'En live',
      viewers: '45,234',
      revenue: '12.5M FCFA',
    },
    {
      id: 2,
      name: 'Match Amical - Congo vs Cameroun',
      date: '18 Mars 2025',
      status: 'À venir',
      viewers: '0',
      revenue: '8.2M FCFA',
    },
    {
      id: 3,
      name: 'Championnat National - J15',
      date: '20 Mars 2025',
      status: 'À venir',
      viewers: '0',
      revenue: '5.8M FCFA',
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'Jean Makaya',
      action: 'a acheté un ticket',
      event: 'CHAN 2025 - Finale',
      time: 'Il y a 2 minutes',
    },
    {
      id: 2,
      user: 'Marie Ondongo',
      action: 'a créé un compte',
      event: null,
      time: 'Il y a 5 minutes',
    },
    {
      id: 3,
      user: 'Admin',
      action: 'a publié un événement',
      event: 'Match Amical',
      time: 'Il y a 15 minutes',
    },
    {
      id: 4,
      user: 'Pierre Ngoma',
      action: 'a acheté un ticket',
      event: 'CHAN 2025 - Finale',
      time: 'Il y a 23 minutes',
    },
  ];

  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-2">
          Bienvenue, {user?.name} 👋
        </h1>
        <p className="font-['Inter',sans-serif] text-white/60 text-base">
          Voici un aperçu de votre plateforme FEETI PLAY
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${
                stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUp className="w-4 h-4" />
                ) : (
                  <ArrowDown className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="font-['Inter',sans-serif] text-white/60 text-sm mb-1">
              {stat.name}
            </p>
            <p className="font-['DM_Sans',sans-serif] font-bold text-white text-2xl">
              {stat.value}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Events */}
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

            <div className="space-y-4">
              {recentEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-['Inter',sans-serif] font-semibold text-white text-base mb-1">
                      {event.name}
                    </h3>
                    <p className="font-['Inter',sans-serif] text-white/60 text-sm">
                      {event.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-white/60" />
                        <span className="font-['Inter',sans-serif] text-white text-sm">
                          {event.viewers}
                        </span>
                      </div>
                      <p className="font-['Inter',sans-serif] text-[#cdff71] text-sm font-semibold">
                        {event.revenue}
                      </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      event.status === 'En live'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {event.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Recent Activity */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[20px] border border-white/10 rounded-[12px] p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">
                Activité récente
              </h2>
              <Activity className="w-5 h-5 text-[#fcc434]" />
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#cdff71] mt-2 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="font-['Inter',sans-serif] text-white text-sm">
                      <span className="font-semibold">{activity.user}</span>{' '}
                      <span className="text-white/60">{activity.action}</span>
                      {activity.event && (
                        <span className="text-[#cdff71]"> {activity.event}</span>
                      )}
                    </p>
                    <p className="font-['Inter',sans-serif] text-white/40 text-xs mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
