import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type {
  AuthUser,
  ChangePasswordData,
  GoogleAuthStartResult,
  GoogleCompletionData,
  RegisterData,
  UpdateProfileData,
} from "../services/api/AuthAPI";
import { backendGateway } from "../services/backend/gateway";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  avatar?: string | null;
  role: "viewer" | "premium" | "streamer" | "admin" | "super_admin";
  subscriptionPlan?: "free" | "basic" | "premium" | "vip";
}

interface AuthContextType {
  user: AppUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token?: string | null;
  login: (email: string, password: string) => Promise<AppUser>;
  register: (data: RegisterData) => Promise<AppUser>;
  startGoogleAuth: () => Promise<GoogleAuthStartResult>;
  completeGoogleRegistration: (data: GoogleCompletionData) => Promise<AppUser>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<AppUser>;
  changePassword: (data: ChangePasswordData) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
}

function mapToAppUser(authUser: AuthUser): AppUser {
  return {
    id: authUser.uid,
    name: authUser.name,
    email: authUser.email,
    phone: authUser.phone,
    avatar: authUser.avatar,
    role: authUser.role,
    subscriptionPlan: authUser.subscriptionPlan ?? "free",
  };
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = backendGateway.auth.subscribe(async (authUser) => {
      setUser(authUser ? mapToAppUser(authUser) : null);
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<AppUser> => {
    const authUser = await backendGateway.auth.login(email, password);
    const appUser = mapToAppUser(authUser);
    setUser(appUser);
    return appUser;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AppUser> => {
    const authUser = await backendGateway.auth.register(data);
    const appUser = mapToAppUser(authUser);
    setUser(appUser);
    return appUser;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await backendGateway.auth.logout();
    setUser(null);
  }, []);

  const startGoogleAuth = useCallback(async (): Promise<GoogleAuthStartResult> => {
    const result = await backendGateway.auth.startGoogleAuth();
    if (result.user) {
      const appUser = mapToAppUser(result.user);
      setUser(appUser);
      return { ...result, user: result.user };
    }
    return result;
  }, []);

  const completeGoogleRegistration = useCallback(async (data: GoogleCompletionData): Promise<AppUser> => {
    const authUser = await backendGateway.auth.completeGoogleRegistration(data);
    const appUser = mapToAppUser(authUser);
    setUser(appUser);
    return appUser;
  }, []);

  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<AppUser> => {
    const authUser = await backendGateway.auth.updateProfile(data);
    const appUser = mapToAppUser(authUser);
    setUser(appUser);
    return appUser;
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordData): Promise<void> => {
    await backendGateway.auth.changePassword(data);
  }, []);

  const deleteAccount = useCallback(async (password: string): Promise<void> => {
    await backendGateway.auth.deleteAccount(password);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        token: null,
        login,
        register,
        startGoogleAuth,
        completeGoogleRegistration,
        logout,
        updateProfile,
        changePassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit etre utilise dans un AuthProvider");
  return ctx;
}
