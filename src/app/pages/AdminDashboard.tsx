import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Bell,
  Activity,
  Database,
  Shield,
  LogOut,
  Menu,
  X,
  TrendingUp,
  DollarSign,
  Calendar,
  PlayCircle,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Trash2,
  Edit,
  Plus,
  Search,
  Filter,
  Download,
  Send,
  BarChart3,
  Settings,
} from 'lucide-react';
import { useAdminAuth, logAdminAction } from '../contexts/AdminAuthContext';

type Section = 'overview' | 'content' | 'users' | 'crm' | 'notifications' | 'logs' | 'monitoring' | 'backup';

export function AdminDashboard() {
  const navigate = useNavigate();
  const { adminUser, logout, hasPermission, isAuthenticated } = useAdminAuth();
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, navigate]);

  if (!adminUser) return null;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard, permission: null },
    { id: 'content', label: 'Gestion Contenu', icon: FileText, permission: 'content.manage' },
    { id: 'users', label: 'Utilisateurs', icon: Users, permission: 'users.manage' },
    { id: 'crm', label: 'CRM', icon: Briefcase, permission: 'crm.view' },
    { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'notifications.send' },
    { id: 'logs', label: 'Logs Système', icon: Activity, permission: 'logs.view' },
    { id: 'monitoring', label: 'Monitoring', icon: BarChart3, permission: 'monitoring.view' },
    { id: 'backup', label: 'Backup', icon: Database, permission: '*' },
  ];

  const visibleMenuItems = menuItems.filter(
    (item) => !item.permission || hasPermission(item.permission)
  );

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed lg:static inset-y-0 left-0 z-50 w-[280px] bg-[rgba(255,255,255,0.05)] backdrop-blur-[50px] border-r border-white/10 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-white/10">
              <h1 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-white">
                FÉÉTI <span className="text-[#de0035]">PLAY</span>
              </h1>
              <p className="font-['Inter',sans-serif] text-white/60 text-xs mt-1">Admin Dashboard</p>
            </div>

            {/* User Info */}
            <div className="p-4 border-b border-white/10">
              <div className="bg-[rgba(255,255,255,0.05)] rounded-[8px] p-3">
                <p className="font-['Inter',sans-serif] font-semibold text-white text-sm">{adminUser.name}</p>
                <p className="font-['Inter',sans-serif] text-[#cdff71] text-xs mt-1 capitalize">
                  {adminUser.role.replace('-', ' ')}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-2">
                {visibleMenuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;

                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as Section)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-[8px] transition-all ${
                        isActive
                          ? 'bg-[#de0035] text-white'
                          : 'text-white/60 hover:bg-white/5 hover:text-white'
                      }`}
                      whileHover={{ x: 4 }}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-['Inter',sans-serif] text-sm">{item.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t border-white/10">
              <motion.button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-[8px] text-white/60 hover:bg-white/5 hover:text-white transition-all"
                whileHover={{ x: 4 }}
              >
                <LogOut className="w-5 h-5" />
                <span className="font-['Inter',sans-serif] text-sm">Déconnexion</span>
              </motion.button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[rgba(0,0,0,0.8)] backdrop-blur-md border-b border-white/10 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-white/60 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-xl">
                  {visibleMenuItems.find((item) => item.id === activeSection)?.label}
                </h2>
                <p className="font-['Inter',sans-serif] text-white/60 text-sm">
                  {new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 bg-[rgba(255,255,255,0.05)] rounded-full px-3 py-1.5">
                <Shield className="w-4 h-4 text-[#cdff71]" />
                <span className="font-['Inter',sans-serif] text-white text-xs">Sécurisé</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeSection === 'overview' && <OverviewSection key="overview" adminUser={adminUser} />}
            {activeSection === 'content' && <ContentSection key="content" />}
            {activeSection === 'users' && <UsersSection key="users" />}
            {activeSection === 'crm' && <CRMSection key="crm" />}
            {activeSection === 'notifications' && <NotificationsSection key="notifications" />}
            {activeSection === 'logs' && <LogsSection key="logs" />}
            {activeSection === 'monitoring' && <MonitoringSection key="monitoring" />}
            {activeSection === 'backup' && <BackupSection key="backup" />}
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Overview Section Component
function OverviewSection({ adminUser }: { adminUser: any }) {
  const stats = [
    { label: 'Événements actifs', value: '24', icon: Calendar, color: '#de0035', change: '+12%' },
    { label: 'Utilisateurs', value: '15,847', icon: Users, color: '#cdff71', change: '+8%' },
    { label: 'Revenus (FCFA)', value: '12.4M', icon: DollarSign, color: '#fcc434', change: '+23%' },
    { label: 'Replays disponibles', value: '156', icon: PlayCircle, color: '#9280fd', change: '+5%' },
  ];

  const recentActivities = [
    { id: 1, action: 'Nouvel événement créé', user: 'Admin', time: 'Il y a 5 min', status: 'success' },
    { id: 2, action: 'Utilisateur banni', user: 'Moderator', time: 'Il y a 15 min', status: 'warning' },
    { id: 3, action: 'Notification envoyée', user: 'Growth Manager', time: 'Il y a 1h', status: 'info' },
    { id: 4, action: 'Backup complété', user: 'System', time: 'Il y a 2h', status: 'success' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[50px] border border-white/10 rounded-[12px] p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: stat.color }} />
                </div>
                <span className="text-[#cdff71] text-sm font-['Inter',sans-serif]">{stat.change}</span>
              </div>
              <h3 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-white mb-1">
                {stat.value}
              </h3>
              <p className="font-['Inter',sans-serif] text-white/60 text-sm">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[50px] border border-white/10 rounded-[12px] p-6">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-white mb-6">
          Activité récente
        </h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between bg-[rgba(255,255,255,0.03)] rounded-[8px] p-4"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.status === 'success'
                      ? 'bg-[#cdff71]'
                      : activity.status === 'warning'
                      ? 'bg-[#fcc434]'
                      : 'bg-[#9280fd]'
                  }`}
                />
                <div>
                  <p className="font-['Inter',sans-serif] text-white text-sm">{activity.action}</p>
                  <p className="font-['Inter',sans-serif] text-white/60 text-xs">{activity.user}</p>
                </div>
              </div>
              <span className="font-['Inter',sans-serif] text-white/40 text-xs">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Content Section Component (placeholder - will be expanded)
function ContentSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const [contentType, setContentType] = useState<'events' | 'channels' | 'replays'>('events');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex gap-2">
          {(['events', 'channels', 'replays'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setContentType(type)}
              className={`px-4 py-2 rounded-[8px] font-['Inter',sans-serif] text-sm transition-all ${
                contentType === type
                  ? 'bg-[#de0035] text-white'
                  : 'bg-[rgba(255,255,255,0.05)] text-white/60 hover:text-white'
              }`}
            >
              {type === 'events' ? 'Événements' : type === 'channels' ? 'Chaînes' : 'Replays'}
            </button>
          ))}
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher..."
              className="w-full bg-[rgba(255,255,255,0.05)] border border-white/10 rounded-[8px] pl-10 pr-4 py-2 text-white text-sm outline-none focus:border-[#cdff71] transition-colors"
            />
          </div>
          <button className="bg-[#cdff71] hover:bg-[#cdff71]/90 text-black px-4 py-2 rounded-[8px] font-['Inter',sans-serif] text-sm font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Ajouter
          </button>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[50px] border border-white/10 rounded-[12px] p-6">
        <p className="text-white/60 text-center py-8">
          Gestion de contenu - {contentType} (Fonctionnalité complète à venir)
        </p>
      </div>
    </motion.div>
  );
}

// Placeholder sections (to be fully implemented)
function UsersSection() {
  return <SectionPlaceholder title="Gestion des Utilisateurs" icon={Users} />;
}

function CRMSection() {
  return <SectionPlaceholder title="CRM" icon={Briefcase} />;
}

function NotificationsSection() {
  return <SectionPlaceholder title="Notifications Push" icon={Bell} />;
}

function LogsSection() {
  return <SectionPlaceholder title="Logs Système" icon={Activity} />;
}

function MonitoringSection() {
  return <SectionPlaceholder title="Monitoring Plateforme" icon={BarChart3} />;
}

function BackupSection() {
  return <SectionPlaceholder title="Backup & Restauration" icon={Database} />;
}

function SectionPlaceholder({ title, icon: Icon }: { title: string; icon: any }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[rgba(255,255,255,0.05)] backdrop-blur-[50px] border border-white/10 rounded-[12px] p-12 text-center"
    >
      <Icon className="w-16 h-16 text-[#cdff71] mx-auto mb-4" />
      <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-white mb-2">{title}</h3>
      <p className="font-['Inter',sans-serif] text-white/60">
        Section en développement - Fonctionnalité complète à venir
      </p>
    </motion.div>
  );
}
