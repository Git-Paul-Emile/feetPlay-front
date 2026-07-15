import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
export interface Country {
  code: string;
  name: string;
}

export const ALL_COUNTRIES: Country = { code: 'ALL', name: 'Tous les pays' };

// Contrainte générique volontairement réduite aux champs réellement utilisés par
// le filtrage (country/location), afin de rester compatible avec les différentes
// formes locales d'événements (StreamingEvent, CalendarEventCardProps, etc.).
type LocatableEvent = { country?: string | null; location?: string | null };

interface LocationContextType {
  selectedCountry: Country;
  setSelectedCountry: (country: Country) => void;
  filterEvents: <T extends LocatableEvent>(events: T[]) => T[];
}

const LocationContext = createContext<LocationContextType | null>(null);

const STORAGE_KEY = 'feetiplay_selected_country';

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountryState] = useState<Country>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Could not read country from localStorage', e);
    }
    return ALL_COUNTRIES;
  });

  const setSelectedCountry = useCallback((country: Country) => {
    setSelectedCountryState(country);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(country));
    } catch (e) {
      console.warn('Could not save country to localStorage', e);
    }
  }, []);

  const filterEvents = useCallback(<T extends LocatableEvent>(events: T[]): T[] => {
    if (selectedCountry.code === 'ALL') {
      return events;
    }
    return events.filter(event => {
      // Filtrage par pays si l'événement a un champ country
      if (event.country) {
        return event.country === selectedCountry.name || event.country === selectedCountry.code;
      }
      
      // Fallback sur la localisation de l'événement s'il n'a pas de pays explicite
      if (event.location && event.location.toLowerCase().includes(selectedCountry.name.toLowerCase())) {
        return true;
      }
      
      return false;
    });
  }, [selectedCountry]);

  return (
    <LocationContext.Provider value={{ selectedCountry, setSelectedCountry, filterEvents }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext(): LocationContextType {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext doit être utilisé dans un LocationProvider');
  return ctx;
}
