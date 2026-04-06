// Auth Context pour FeetiPlay — pattern identique à feeti2
// Gère la session utilisateur (viewer, premium, streamer)

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import AuthAPI, {
  type AuthUser,
  type RegisterData,
  type UpdateProfileData,
  type ChangePasswordData,
} from '../services/api/AuthAPI';

// ── Types exposés ──────────────────────────────────────────────────────────

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: 'viewer' | 'premium' | 'streamer' | 'admin' | 'super_admin';
  subscriptionPlan?: 'free' | 'basic' | 'premium' | 'vip';
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<AppUser>;
  register: (data: RegisterData) => Promise<AppUser>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<AppUser>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

// ── Mapping AuthUser → AppUser ─────────────────────────────────────────────

function mapToAppUser(authUser: AuthUser): AppUser {
  return {
    id: authUser.id,
    name: authUser.name,
    email: authUser.email,
    phone: authUser.phone,
    avatar: authUser.avatar,
    role: authUser.role,
    subscriptionPlan: authUser.subscriptionPlan ?? 'free',
  };
}

// ── Context & Provider ─────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [token, setToken] = useState<string | null>(AuthAPI.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Restaure la session au montage via le token stocké
  useEffect(() => {
    const storedToken = AuthAPI.getToken();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    setToken(storedToken);
    AuthAPI.getMe()
      .then(authUser => setUser(mapToAppUser(authUser)))
      .catch(() => {
        localStorage.removeItem('feetiplay_token');
        localStorage.removeItem('feetiplay_user');
        setToken(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AppUser> => {
    const { user: authUser, accessToken } = await AuthAPI.login(email, password);
    localStorage.setItem('feetiplay_token', accessToken);
    localStorage.setItem('feetiplay_user', JSON.stringify(authUser));
    const appUser = mapToAppUser(authUser);
    setUser(appUser);
    setToken(accessToken);
    return appUser;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AppUser> => {
    const { user: authUser, accessToken } = await AuthAPI.register(data);
    localStorage.setItem('feetiplay_token', accessToken);
    localStorage.setItem('feetiplay_user', JSON.stringify(authUser));
    const appUser = mapToAppUser(authUser);
    setUser(appUser);
    setToken(accessToken);
    return appUser;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try { await AuthAPI.logout(); } catch { /* ignore */ }
    localStorage.removeItem('feetiplay_token');
    localStorage.removeItem('feetiplay_user');
    setUser(null);
    setToken(null);
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<AppUser> => {
    const authUser = await AuthAPI.updateProfile(data);
    const appUser = mapToAppUser(authUser);
    setUser(appUser);
    return appUser;
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordData): Promise<void> => {
    await AuthAPI.changePassword(data);
  }, []);

  const deleteAccount = useCallback(async (password: string): Promise<void> => {
    await AuthAPI.deleteAccount(password);
    localStorage.removeItem('feetiplay_token');
    localStorage.removeItem('feetiplay_user');
    setUser(null);
    setToken(null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      token: AuthAPI.getToken(),
      isLoading,
      login, register, logout,
      updateProfile, changePassword, deleteAccount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans un AuthProvider');
  return ctx;
}
