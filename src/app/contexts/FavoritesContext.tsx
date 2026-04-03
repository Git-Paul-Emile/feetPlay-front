import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  addFavorite: (event: Omit<FavoriteEvent, 'addedAt'>) => void;
  removeFavorite: (eventId: string) => void;
  isFavorite: (eventId: string) => boolean;
  toggleFavorite: (event: Omit<FavoriteEvent, 'addedAt'>) => void;
  clearAllFavorites: () => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteEvent[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem('feeti-favorites');
    if (storedFavorites) {
      try {
        const parsed = JSON.parse(storedFavorites);
        setFavorites(parsed);
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('feeti-favorites', JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (event: Omit<FavoriteEvent, 'addedAt'>) => {
    const newFavorite: FavoriteEvent = {
      ...event,
      addedAt: Date.now(),
    };
    setFavorites(prev => [newFavorite, ...prev]);
  };

  const removeFavorite = (eventId: string) => {
    setFavorites(prev => prev.filter(fav => fav.id !== eventId));
  };

  const isFavorite = (eventId: string): boolean => {
    return favorites.some(fav => fav.id === eventId);
  };

  const toggleFavorite = (event: Omit<FavoriteEvent, 'addedAt'>) => {
    if (isFavorite(event.id)) {
      removeFavorite(event.id);
    } else {
      addFavorite(event);
    }
  };

  const clearAllFavorites = () => {
    setFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        toggleFavorite,
        clearAllFavorites,
      }}
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
