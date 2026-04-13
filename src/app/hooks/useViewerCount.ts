import { useEffect, useState } from 'react';
import { getPreferredApiBaseUrl } from '../utils/serviceConfig';

/**
 * Se connecte via SSE au backend et reçoit le viewer count en temps réel.
 * Ne fait rien si l'event n'est pas un live (eventId absent).
 */
export function useViewerCount(eventId: string | undefined, isLive: boolean): number {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!eventId || !isLive) return;

    const url = `${getPreferredApiBaseUrl()}/streaming/live/${eventId}/viewers`;
    const es = new EventSource(url);

    es.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data) as { viewerCount: number };
        setCount(payload.viewerCount);
      } catch { /* ignore */ }
    };

    es.onerror = () => {
      // SSE reconnecte automatiquement — on ne ferme pas
    };

    return () => {
      es.close();
    };
  }, [eventId, isLive]);

  return count;
}
