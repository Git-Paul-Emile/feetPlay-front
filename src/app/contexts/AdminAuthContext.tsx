import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../config/firebase";
import { fetchWithApiFallback } from "../utils/serviceConfig";
import AdminAPI from "../services/api/AdminAPI";

const ADMIN_TOKEN_KEY = "feetiplay_admin_token";

// ── Types ─────────────────────────────────────────────────────────────────────

export type UserRole = "super_admin" | "admin" | "moderator" | "finance" | "marketing";

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
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

// ── Permissions par rôle — miroir du backend ──────────────────────────────────

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    "view_dashboard", "manage_events", "manage_users", "manage_crm",
    "send_notifications", "view_logs", "manage_settings", "manage_backup",
    "manage_monitoring", "manage_roles", "view_finances",
  ],
  admin: [
    "view_dashboard", "manage_events", "manage_users", "manage_crm",
    "send_notifications", "view_logs",
  ],
  moderator: ["view_dashboard", "manage_events", "view_users", "view_logs"],
  finance: ["view_dashboard", "view_finances", "view_events", "view_users", "view_logs"],
  marketing: ["view_dashboard", "manage_crm", "send_notifications", "view_events", "view_users"],
};

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchAdminProfile(): Promise<AdminUser> {
  const res = await fetchWithApiFallback("/api/admin/auth/me");
  const body = await res.json().catch(() => ({ message: "Erreur serveur" }));
  if (!res.ok) throw new Error(body.message ?? "Erreur serveur");
  return body.data as AdminUser;
}

function logAction(
  currentUser: AdminUser | null,
  action: string,
  description: string,
  level: "info" | "success" | "warning" | "error" = "info"
) {
  if (!currentUser) return;
  AdminAPI.createLog({
    action,
    description,
    level,
    adminName: currentUser.name,
    adminRole: currentUser.role,
  }).catch(() => {
    const logs = JSON.parse(localStorage.getItem("admin_logs") || "[]");
    logs.unshift({
      id: Date.now().toString(),
      action,
      description,
      user: currentUser.name,
      role: currentUser.role,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem("admin_logs", JSON.stringify(logs.slice(0, 200)));
  });
}

// ── Context ───────────────────────────────────────────────────────────────────

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ── Persistance de session via Firebase Auth ───────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          if (!localStorage.getItem(ADMIN_TOKEN_KEY)) {
            setUser(null);
            setIsLoading(false);
            return;
          }
          const adminUser = await fetchAdminProfile();
          setUser(adminUser);
        } catch {
          // Non admin ou profil introuvable
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  // ── Connexion ──────────────────────────────────────────────────────────────
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const adminUser = await fetchAdminProfile();
      setUser(adminUser);
      logAction(adminUser, "login", `${adminUser.name} s'est connecté`, "success");
      return true;
    } catch {
      return false;
    }
  }, []);

  // ── Déconnexion ────────────────────────────────────────────────────────────
  const logout = useCallback(async (): Promise<void> => {
    if (user) logAction(user, "logout", `${user.name} s'est déconnecté`);
    await signOut(auth);
    setUser(null);
  }, [user]);

  // ── Permissions / rôles ────────────────────────────────────────────────────
  const hasPermission = useCallback(
    (permission: string): boolean => !!user && user.permissions.includes(permission),
    [user]
  );

  const hasRole = useCallback(
    (role: UserRole | UserRole[]): boolean => {
      if (!user) return false;
      return Array.isArray(role) ? role.includes(user.role) : user.role === role;
    },
    [user]
  );

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
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
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }
  return context;
}
