import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import EventsAPI, { type StreamingEvent } from '../services/api/EventsAPI';
import { useAuth } from './AuthContext';

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
  addedAt: number;
}

interface FavoritesContextType {
  favorites: FavoriteEvent[];
  loading: boolean;
  addFavorite: (event: Omit<FavoriteEvent, 'addedAt'>) => void;
  removeFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (event: Omit<FavoriteEvent, 'addedAt'>) => void;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

function mapStreamingEvent(e: StreamingEvent): FavoriteEvent {
  return {
    id: e.id,
    title: e.title,
    image: e.image,
    location: e.location ?? e.channelName,
    date: e.date,
    time: e.time,
    category: e.category,
    isLive: e.isLive,
    isFree: e.isFree,
    price: e.price,
    hasStreaming: true,
    duration: e.duration,
    fullDate: e.date,
    addedAt: Date.now(),
  };
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    try {
      const events = await EventsAPI.getFavorites();
      setFavorites(events.map(mapStreamingEvent));
    } catch {
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => { loadFavorites(); }, [loadFavorites]);

  useEffect(() => {
    // Aucune persistance locale des favoris sans être connecté
  }, [favorites, isAuthenticated]);

  const addFavorite = (event: Omit<FavoriteEvent, 'addedAt'>) => {
    setFavorites(prev => [{ ...event, addedAt: Date.now() }, ...prev.filter(f => f.id !== event.id)]);
  };

  const removeFavorite = (eventId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== eventId));
  };

  const isFavorite = (eventId: string): boolean => favorites.some(fav => fav.id === eventId);

  const toggleFavorite = async (event: Omit<FavoriteEvent, 'addedAt'>) => {
    if (isAuthenticated) {
      try {
        const result = await EventsAPI.toggleFavorite(event.id);
        if (result.isFavorited) {
          addFavorite(event);
        } else {
          removeFavorite(event.id);
        }
        return;
      } catch {
        // fallback local
      }
    }
    if (isFavorite(event.id)) {
      removeFavorite(event.id);
    } else {
      addFavorite(event);
    }
  };

  const clearAllFavorites = () => setFavorites([]);

  return (
    <FavoritesContext.Provider
      value={{ favorites, loading, addFavorite, removeFavorite, isFavorite, toggleFavorite, clearAllFavorites }}
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
