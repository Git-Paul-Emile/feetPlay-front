import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import AdminAPI from '../services/api/AdminAPI';

export type UserRole = 'super_admin' | 'admin' | 'finance' | 'moderator' | 'marketing';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string | null;
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
const ADMIN_USER_KEY = 'feetiplay_admin_user';

const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'view_dashboard',
    'manage_events',
    'manage_users',
    'manage_crm',
    'send_notifications',
    'view_logs',
    'manage_settings',
    'manage_backup',
    'manage_monitoring',
    'manage_roles',
    'manage_admins',
    'view_finances',
    'view_users',
    'view_settings',
    'view_events',
    'view_streaming',
    'moderate_content',
  ],
  admin: [
    'view_dashboard',
    'manage_events',
    'view_users',
    'manage_crm',
    'send_notifications',
    'view_logs',
    'view_settings',
    'view_events',
    'moderate_content',
  ],
  finance: [
    'view_dashboard',
    'view_finances',
    'view_events',
    'view_users',
    'view_logs',
  ],
  moderator: [
    'view_dashboard',
    'view_streaming',
    'view_users',
    'view_logs',
    'moderate_content',
  ],
  marketing: [
    'view_dashboard',
    'manage_crm',
    'send_notifications',
    'view_streaming',
    'view_events',
    'view_users',
  ],
};

function normalizeAdmin(raw: AdminUser): AdminUser {
  return {
    ...raw,
    permissions: raw.permissions?.length ? raw.permissions : ROLE_PERMISSIONS[raw.role] ?? [],
  };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem(ADMIN_USER_KEY);
    const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (!storedUser || !storedToken) return;

    try {
      const parsedUser = normalizeAdmin(JSON.parse(storedUser));
      setUser(parsedUser);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem(ADMIN_USER_KEY);
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      return;
    }

    AdminAPI.getMe()
      .then((freshUser) => {
        const normalized = normalizeAdmin(freshUser as AdminUser);
        setUser(normalized);
        setIsAuthenticated(true);
        localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(normalized));
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem(ADMIN_USER_KEY);
        localStorage.removeItem(ADMIN_TOKEN_KEY);
      });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { admin, accessToken } = await AdminAPI.login(email, password);
      const normalized = normalizeAdmin(admin as AdminUser);
      localStorage.setItem(ADMIN_TOKEN_KEY, accessToken);
      localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(normalized));
      setUser(normalized);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  };

  const logout = () => {
    AdminAPI.logout().catch(() => undefined);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(ADMIN_USER_KEY);
    localStorage.removeItem(ADMIN_TOKEN_KEY);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    return Array.isArray(role) ? role.includes(user.role) : user.role === role;
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

export { ROLE_PERMISSIONS };
