// App Context pour FeetiPlay — pattern identique à feeti2
// Gère l'état global de l'application : tickets numériques, historique de lecture

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import type { DigitalTicketData } from '../services/api/StreamingAPI';

// ── Types ──────────────────────────────────────────────────────────────────

export type { DigitalTicketData as Ticket };

interface AppContextType {
  userTickets: DigitalTicketData[];
  addTickets: (tickets: DigitalTicketData[]) => void;
  removeTicket: (ticketId: string) => void;
  clearTickets: () => void;
  currentStreamEventId: string | null;
  setCurrentStreamEventId: (id: string | null) => void;
}

// ── Context & Provider ─────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [userTickets, setUserTickets] = useState<DigitalTicketData[]>([]);
  const [currentStreamEventId, setCurrentStreamEventId] = useState<string | null>(null);

  const addTickets = useCallback((tickets: DigitalTicketData[]) => {
    setUserTickets(prev => [...prev, ...tickets]);
  }, []);

  const removeTicket = useCallback((ticketId: string) => {
    setUserTickets(prev => prev.filter(t => t.id !== ticketId));
  }, []);

  const clearTickets = useCallback(() => {
    setUserTickets([]);
  }, []);

  return (
    <AppContext.Provider value={{
      userTickets,
      addTickets,
      removeTicket,
      clearTickets,
      currentStreamEventId,
      setCurrentStreamEventId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp doit être utilisé dans un AppProvider');
  return ctx;
}
