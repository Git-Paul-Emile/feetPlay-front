import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import CreatorAPI, { CREATOR_TOKEN_KEY, type Creator } from "../services/api/CreatorAPI";

interface CreatorAuthContextType {
  creator: Creator | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<Creator>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    channelName: string;
    channelSlug: string;
    category: string;
    bio?: string;
  }) => Promise<Creator>;
  logout: () => Promise<void>;
  updateProfile: (data: {
    name?: string;
    bio?: string | null;
    avatar?: string | null;
    coverImage?: string | null;
    category?: string;
    channelName?: string;
    channelSlug?: string;
  }) => Promise<Creator>;
}

const CreatorAuthContext = createContext<CreatorAuthContextType | null>(null);

export function CreatorAuthProvider({ children }: { children: ReactNode }) {
  const [creator, setCreator] = useState<Creator | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(CREATOR_TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      CreatorAPI.getMe()
        .then((c) => setCreator(c))
        .catch(() => {
          window.localStorage.removeItem(CREATOR_TOKEN_KEY);
          setToken(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<Creator> => {
    const { creator: c, accessToken } = await CreatorAPI.login({ email, password });
    window.localStorage.setItem(CREATOR_TOKEN_KEY, accessToken);
    setToken(accessToken);
    setCreator(c);
    return c;
  }, []);

  const register = useCallback(async (data: Parameters<CreatorAuthContextType["register"]>[0]): Promise<Creator> => {
    const { creator: c, accessToken } = await CreatorAPI.register(data);
    window.localStorage.setItem(CREATOR_TOKEN_KEY, accessToken);
    setToken(accessToken);
    setCreator(c);
    return c;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await CreatorAPI.logout();
    window.localStorage.removeItem(CREATOR_TOKEN_KEY);
    setToken(null);
    setCreator(null);
  }, []);

  const updateProfile = useCallback(async (data: Parameters<CreatorAuthContextType["updateProfile"]>[0]): Promise<Creator> => {
    const updated = await CreatorAPI.updateProfile(data);
    setCreator(updated);
    return updated;
  }, []);

  return (
    <CreatorAuthContext.Provider
      value={{
        creator,
        isAuthenticated: !!creator,
        isLoading,
        token,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </CreatorAuthContext.Provider>
  );
}

export function useCreatorAuth(): CreatorAuthContextType {
  const ctx = useContext(CreatorAuthContext);
  if (!ctx) throw new Error("useCreatorAuth doit être utilisé dans un CreatorAuthProvider");
  return ctx;
}
