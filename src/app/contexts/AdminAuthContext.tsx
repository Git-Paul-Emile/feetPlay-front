import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchWithApiFallback } from '../utils/serviceConfig';
import AdminAPI from '../services/api/AdminAPI';

export type UserRole = 'super_admin' | 'admin' | 'moderator' | 'finance' | 'marketing';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  permissions: string[];
}

interface AdminAuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_TOKEN_KEY = 'feetiplay_admin_token';
const ADMIN_USER_KEY  = 'feetiplay_admin_user';

// Permissions par rôle — miroir du backend
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'view_dashboard', 'manage_events', 'manage_users', 'manage_crm',
    'send_notifications', 'view_logs', 'manage_settings', 'manage_backup',
    'manage_monitoring', 'manage_roles', 'view_finances',
  ],
  admin: [
    'view_dashboard', 'manage_events', 'manage_users', 'manage_crm',
    'send_notifications', 'view_logs',
  ],
  moderator: ['view_dashboard', 'manage_events', 'view_users', 'view_logs'],
  finance: ['view_dashboard', 'view_finances', 'view_events', 'view_users', 'view_logs'],
  marketing: ['view_dashboard', 'manage_crm', 'send_notifications', 'view_events', 'view_users'],
};

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(ADMIN_TOKEN_KEY);
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options?.headers ?? {}),
  };
  const res = await fetchWithApiFallback(endpoint, { ...options, headers });
  const body = await res.json().catch(() => ({ message: 'Erreur serveur' }));
  if (!res.ok) throw new Error(body.message ?? 'Erreur serveur');
  return body.data as T;
}

function logAction(currentUser: AdminUser | null, action: string, description: string, level: 'info' | 'success' | 'warning' | 'error' = 'info') {
  if (!currentUser) return;
  AdminAPI.createLog({
    action,
    description,
    level,
    adminName: currentUser.name,
    adminRole: currentUser.role,
  }).catch(() => {
    // Fallback localStorage si l'API est indisponible
    const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    logs.unshift({ id: Date.now().toString(), action, description, user: currentUser.name, role: currentUser.role, timestamp: new Date().toISOString() });
    localStorage.setItem('admin_logs', JSON.stringify(logs.slice(0, 200)));
  });
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Restaurer la session depuis le localStorage au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem(ADMIN_USER_KEY);
    const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (storedUser && storedToken) {
      try {
        const parsed = JSON.parse(storedUser) as AdminUser;
        setUser(parsed);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem(ADMIN_USER_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await apiFetch<{ admin: AdminUser; accessToken: string }>(
        '/admin/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      );
      localStorage.setItem(ADMIN_TOKEN_KEY, data.accessToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(data.admin));
      setUser(data.admin);
      setIsAuthenticated(true);
      logAction(data.admin, 'login', `${data.admin.name} s'est connecté`, 'success');
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    if (user) logAction(user, 'logout', `${user.name} s'est déconnecté`);
    apiFetch('/admin/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    localStorage.removeItem(ADMIN_USER_KEY);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) return role.includes(user.role);
    return user.role === role;
  };

  return (
    <AdminAuthContext.Provider value={{ user, isAuthenticated, login, logout, hasPermission, hasRole }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
}
