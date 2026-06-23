import { Navigate, Outlet, Link, useNavigate, useLocation } from "react-router";
import { motion } from "motion/react";
import { LayoutDashboard, Video, Settings, LogOut, User } from "lucide-react";
import { useCreatorAuth } from "../../contexts/CreatorAuthContext";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

const navItems = [
  { to: "/creator/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/creator/videos", icon: Video, label: "Mes Diffusions" },
  { to: "/creator/settings", icon: Settings, label: "Paramètres" },
];

export function CreatorLayout() {
  const { isAuthenticated, isLoading, creator, logout } = useCreatorAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#080808]">
        <div className="w-8 h-8 border-2 border-[#DE0035] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/creator/login" replace />;
  }

  async function handleLogout() {
    await logout();
    navigate("/creator/login");
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0e0e0e] border-r border-white/10 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-[#DE0035] to-[#CDFF71] bg-clip-text text-transparent">
              FéétiPlay
            </span>
            <span className="text-xs text-gray-500 mt-1">Streamer</span>
          </Link>
        </div>

        {/* Creator profile */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-[#DE0035]/20 flex items-center justify-center">
              {creator?.avatar
                ? <ImageWithFallback src={creator.avatar} alt={creator.name} className="w-full h-full object-cover" />
                : <User className="w-5 h-5 text-[#DE0035]" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{creator?.name}</p>
              <p className="text-xs text-gray-400 truncate">{creator?.channelName}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-[#DE0035]/15 text-white border border-[#DE0035]/30"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:text-[#DE0035] hover:bg-[#DE0035]/10 transition-colors text-sm w-full"
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-8"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
