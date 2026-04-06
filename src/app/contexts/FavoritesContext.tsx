import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from './AuthContext';
import EventsAPI, { type StreamingEvent } from '../services/api/EventsAPI';

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, token } = useAuth();

  const requiresAuth = useCallback(() => {
    navigate('/login', { state: { from: location } });
  }, [navigate, location]);

  const loadFromAPI = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const events = await EventsAPI.fetchApi<StreamingEvent[]>('/events/favorites');
      setFavorites(events.map(e => ({
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
  }, [isAuthenticated, token]);

  useEffect(() => {
    if (isAuthenticated && token) {
      loadFromAPI().then(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, [isAuthenticated, token, loadFromAPI]);

  const addFavorite = async (event: Omit<FavoriteEvent, 'addedAt'>) => {
    if (!isAuthenticated || !token) {
      requiresAuth();
      return;
    }
    setIsLoading(true);
    try {
      await EventsAPI.fetchApi<{ isFavorited: boolean }>(`/events/${event.id}/favorite`, {
        method: 'POST',
      });
      setFavorites(prev => {
        if (prev.some(f => f.id === event.id)) return prev;
        return [{ ...event, addedAt: Date.now() }, ...prev];
      });
    } catch (error) {
      console.error('Error adding favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (eventId: string) => {
    if (!isAuthenticated || !token) {
      requiresAuth();
      return;
    }
    setIsLoading(true);
    try {
      await EventsAPI.fetchApi<{ isFavorited: boolean }>(`/events/${eventId}/favorite`, {
        method: 'POST',
      });
      setFavorites(prev => prev.filter(fav => fav.id !== eventId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFavorite = (eventId: string): boolean => {
    return favorites.some(fav => fav.id === eventId);
  };

  const toggleFavorite = async (event: Omit<FavoriteEvent, 'addedAt'>) => {
    if (isFavorite(event.id)) {
      await removeFavorite(event.id);
    } else {
      await addFavorite(event);
    }
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