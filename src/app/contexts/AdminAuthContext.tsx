import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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

// Permissions par rôle
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
    'view_finances',
  ],
  admin: [
    'view_dashboard',
    'manage_events',
    'manage_users',
    'manage_crm',
    'send_notifications',
    'view_logs',
  ],
  moderator: [
    'view_dashboard',
    'manage_events',
    'view_users',
    'view_logs',
  ],
  finance: [
    'view_dashboard',
    'view_finances',
    'view_events',
    'view_users',
    'view_logs',
  ],
  marketing: [
    'view_dashboard',
    'manage_crm',
    'send_notifications',
    'view_events',
    'view_users',
  ],
};

// Mock users pour démonstration (À remplacer par une vraie API)
const MOCK_USERS: Array<AdminUser & { password: string }> = [
  {
    id: '1',
    email: 'superadmin@feetiplay.com',
    password: 'Super@123',
    name: 'Super Administrateur',
    role: 'super_admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin',
    permissions: ROLE_PERMISSIONS.super_admin,
  },
  {
    id: '2',
    email: 'admin@feetiplay.com',
    password: 'Admin@123',
    name: 'Administrateur',
    role: 'admin',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    permissions: ROLE_PERMISSIONS.admin,
  },
  {
    id: '3',
    email: 'moderator@feetiplay.com',
    password: 'Mod@123',
    name: 'Modérateur',
    role: 'moderator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=moderator',
    permissions: ROLE_PERMISSIONS.moderator,
  },
  {
    id: '4',
    email: 'finance@feetiplay.com',
    password: 'Finance@123',
    name: 'Responsable Finance',
    role: 'finance',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=finance',
    permissions: ROLE_PERMISSIONS.finance,
  },
  {
    id: '5',
    email: 'marketing@feetiplay.com',
    password: 'Marketing@123',
    name: 'Responsable Marketing',
    role: 'marketing',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marketing',
    permissions: ROLE_PERMISSIONS.marketing,
  },
];

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Vérifier la session au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Erreur parsing user:', error);
        localStorage.removeItem('admin_user');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulation d'une requête API
    await new Promise(resolve => setTimeout(resolve, 1000));

    const foundUser = MOCK_USERS.find(
      u => u.email === email && u.password === password
    );

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem('admin_user', JSON.stringify(userWithoutPassword));
      
      // Log de connexion
      logAction('login', `${foundUser.name} s'est connecté`);
      
      return true;
    }

    return false;
  };

  const logout = () => {
    if (user) {
      logAction('logout', `${user.name} s'est déconnecté`);
    }
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('admin_user');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    return user.permissions.includes(permission);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
  };

  // Fonction helper pour logger les actions
  const logAction = (action: string, description: string) => {
    const logs = JSON.parse(localStorage.getItem('admin_logs') || '[]');
    logs.unshift({
      id: Date.now().toString(),
      action,
      description,
      user: user?.name || 'Unknown',
      role: user?.role || 'unknown',
      timestamp: new Date().toISOString(),
    });
    // Garder seulement les 1000 derniers logs
    localStorage.setItem('admin_logs', JSON.stringify(logs.slice(0, 1000)));
  };

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        hasPermission,
        hasRole,
      }}
    >
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

// Export des permissions pour référence
export { ROLE_PERMISSIONS };
