import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';
import EventsAPI from '../services/api/EventsAPI';

interface FavoriteEvent {
  id: string;
  title: string;
  image: string;
  location: string;
  date: string;
  time?: string;
  category: string;
  isLive?: boolean;
  isFree?: boolean;
  price?: number;
  hasStreaming?: boolean;
  duration?: string;
  fullDate?: string;
  addedAt?: number;
}

interface FavoritesContextType {
  favorites: FavoriteEvent[];
  addFavorite: (event: Omit<FavoriteEvent, 'addedAt'>) => Promise<void>;
  removeFavorite: (eventId: string) => Promise<void>;
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (event: Omit<FavoriteEvent, 'addedAt'>) => Promise<void>;
  clearAllFavorites: () => void;
  isLoading: boolean;
  requiresAuth: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  const requiresAuth = useCallback(() => {
    navigate('/login', { state: { from: location } });
  }, [navigate, location]);

  const loadFromAPI = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const events = await EventsAPI.getFavorites();
      setFavorites(events.map((e) => ({
        id: e.id,
        title: e.title,
        image: e.image,
        location: e.channelName,
        date: e.date,
        time: e.time,
        category: e.category,
        isLive: e.isLive,
        isFree: e.isFree,
        price: e.price,
        hasStreaming: !!e.streamUrl,
        duration: e.duration,
      })));
    } catch (error) {
      console.error('Error loading favorites from API:', error);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    void loadFromAPI();
  }, [loadFromAPI]);

  const addFavorite = async (event: Omit<FavoriteEvent, 'addedAt'>) => {
    if (!isAuthenticated) {
      requiresAuth();
      return;
    }

    setIsLoading(true);
    try {
      await EventsAPI.toggleFavorite(event.id);
      setFavorites((prev) => {
        if (prev.some((favorite) => favorite.id === event.id)) return prev;
        return [{ ...event, addedAt: Date.now() }, ...prev];
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (eventId: string) => {
    if (!isAuthenticated) {
      requiresAuth();
      return;
    }

    setIsLoading(true);
    try {
      await EventsAPI.toggleFavorite(eventId);
      setFavorites((prev) => prev.filter((favorite) => favorite.id !== eventId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (eventId: string): boolean => favorites.some((favorite) => favorite.id === eventId);

  const toggleFavorite = async (event: Omit<FavoriteEvent, 'addedAt'>) => {
    if (isFavorite(event.id)) {
      await removeFavorite(event.id);
      return;
    }

    await addFavorite(event);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={useMemo(() => ({
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearAllFavorites,
        isLoading,
        requiresAuth,
      }), [favorites, isLoading, requiresAuth])}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
