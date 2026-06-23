import { Outlet, NavLink, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BarChart3,
  Bell,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  ShieldAlert,
  Wallet,
  Activity,
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { useState } from 'react';

export function AdminLayout() {
  const { user, logout, hasPermission, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      name: 'Dashboard',
      icon: LayoutDashboard,
      path: '/admin/dashboard',
      permission: 'view_dashboard',
    },
    {
      name: 'Événements',
      icon: CalendarDays,
      path: '/admin/events',
      permission: 'manage_events',
    },
    {
      name: 'Utilisateurs',
      icon: Users,
      path: '/admin/users',
      permission: 'view_users',
    },
    {
      name: 'CRM & Analytics',
      icon: BarChart3,
      path: '/admin/crm',
      permission: 'manage_crm',
    },
    {
      name: 'Notifications',
      icon: Bell,
      path: '/admin/notifications',
      permission: 'send_notifications',
    },
    {
      name: 'Finances',
      icon: Wallet,
      path: '/admin/finances',
      permission: 'view_finances',
    },
    {
      name: 'Logs',
      icon: FileText,
      path: '/admin/logs',
      permission: 'view_logs',
    },
    {
      name: 'Modération',
      icon: ShieldAlert,
      path: '/admin/moderation',
      permission: 'moderate_content',
    },
    {
      name: 'Streaming Analytics',
      icon: Activity,
      path: '/admin/analytics/streaming',
      permission: 'view_events', // Or view_streaming, but view_events is in admin role and protects analytics too implicitly. Wait, let's use view_events or view_dashboard to be safe. Let's use view_events.
    },
    {
      name: 'Paramètres',
      icon: Settings,
      path: '/admin/settings',
      permission: 'view_settings',
    },
  ];

  const visibleMenuItems = menuItems.filter(item => hasPermission(item.permission));

  const roleColors: Record<string, string> = {
    super_admin: 'text-[#de0035]',
    admin: 'text-[#cdff71]',
    finance: 'text-blue-400',
    moderator: 'text-orange-400',
    marketing: 'text-pink-400',
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 280 : 80 }}
        className="bg-[rgba(255,255,255,0.03)] border-r border-white/10 flex flex-col relative"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#cdff71] flex-shrink-0" />
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-lg">
                  FÉÉTI PLAY
                </h1>
                <p className="text-xs text-white/60">Admin Panel</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Toggle button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute -right-3 top-20 w-6 h-6 bg-[#cdff71] rounded-full flex items-center justify-center hover:scale-110 transition-transform"
        >
          {sidebarOpen ? (
            <X className="w-4 h-4 text-black" />
          ) : (
            <Menu className="w-4 h-4 text-black" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {visibleMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-[#cdff71] text-black'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && (
                <span className="font-['Inter',sans-serif] text-sm font-medium">
                  {item.name}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            {user?.avatar && (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full flex-shrink-0"
              />
            )}
            {sidebarOpen && user && (
              <div className="flex-1 min-w-0">
                <p className="font-['Inter',sans-serif] text-white text-sm font-medium truncate">
                  {user.name}
                </p>
                <p className={`font-['Inter',sans-serif] text-xs font-medium ${roleColors[user.role]}`}>
                  {user.role.replace('_', ' ').toUpperCase()}
                </p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-[#de0035] hover:bg-[#de0035]/80 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span className="text-sm">Déconnexion</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
