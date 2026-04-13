import { useEffect, useRef, useState } from 'react';
import MuxPlayerElement from '@mux/mux-player-react';
import StreamingAPI from '../services/api/StreamingAPI';

interface MuxPlayerProps {
  playbackId: string;
  streamType?: 'on-demand' | 'live' | 'll-live';
  title?: string;
  poster?: string;
  autoPlay?: boolean;
  className?: string;
  startTime?: number;
  /** Fourni pour activer le watch history automatique */
  eventId?: string;
  eventTitle?: string;
  /** Token signé Mux pour les playbackId en mode "signed" (contenu premium) */
  muxToken?: string | null;
  onError?: (error: unknown) => void;
  onProgressUpdate?: (progress: number) => void;
}

const MUX_ENV_KEY = import.meta.env.VITE_MUX_ENV_KEY as string | undefined;
/** Intervalle de sauvegarde de progression (ms) */
const PROGRESS_SAVE_INTERVAL = 30_000;

export function MuxPlayer({
  playbackId,
  streamType = 'on-demand',
  title,
  poster,
  autoPlay = false,
  className = '',
  startTime,
  eventId,
  eventTitle,
  muxToken,
  onError,
  onProgressUpdate,
}: MuxPlayerProps) {
  const playerRef = useRef<any>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const lastSavedProgressRef = useRef<number>(-1);
  const [hasError, setHasError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  /** Sauvegarde la progression côté backend */
  const saveProgress = () => {
    const el = playerRef.current;
    if (!el || !eventId || streamType !== 'on-demand') return;

    const currentTime: number = el.currentTime ?? 0;
    const dur: number = el.duration ?? 0;
    if (!dur || dur < 1) return;

    const progress = Math.round((currentTime / dur) * 100);
    // N'envoie que si la progression a changé d'au moins 1%
    if (Math.abs(progress - lastSavedProgressRef.current) < 1) return;
    lastSavedProgressRef.current = progress;

    const durationStr = formatSeconds(dur);
    StreamingAPI.updateWatchProgress(eventId, eventTitle ?? title ?? '', progress, durationStr);
    onProgressUpdate?.(progress);
  };

  // Démarre/arrête l'intervalle selon l'état de lecture
  const startProgressTracking = () => {
    if (!eventId || streamType !== 'on-demand') return;
    if (progressIntervalRef.current) return;
    progressIntervalRef.current = window.setInterval(saveProgress, PROGRESS_SAVE_INTERVAL);
  };

  const stopProgressTracking = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    // Sauvegarde une dernière fois à l'arrêt
    saveProgress();
  };

  // Nettoyage à l'unmount
  useEffect(() => {
    return () => {
      stopProgressTracking();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  const handleError = (error: unknown) => {
    setHasError(true);
    onError?.(error);
  };

  const handleRetry = () => {
    setHasError(false);
    setRetryKey(k => k + 1);
  };

  if (hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center gap-4 bg-black text-white/60 ${className}`}>
        <svg className="w-14 h-14 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-sm text-center px-4">Erreur de lecture du flux vidéo.</p>
        <button
          onClick={handleRetry}
          className="px-5 py-2 bg-[#DE0035] text-white text-sm rounded-full hover:bg-[#c5002f] transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  // Si un token signé est fourni, on l'utilise comme tokens.playback
  const tokensProp = muxToken ? { playback: muxToken } : undefined;

  return (
    <MuxPlayerElement
      key={retryKey}
      ref={playerRef}
      playbackId={playbackId}
      streamType={streamType}
      {...(MUX_ENV_KEY ? { envKey: MUX_ENV_KEY } : {})}
      {...(tokensProp ? { tokens: tokensProp } : {})}
      metadataVideoTitle={title}
      poster={poster}
      autoPlay={autoPlay}
      startTime={startTime}
      className={`w-full h-full ${className}`}
      onPlay={startProgressTracking}
      onPause={stopProgressTracking}
      onEnded={() => {
        stopProgressTracking();
        // Marque à 100% à la fin
        if (eventId) {
          StreamingAPI.updateWatchProgress(
            eventId,
            eventTitle ?? title ?? '',
            100,
            formatSeconds(playerRef.current?.duration ?? 0),
          );
        }
      }}
      onError={handleError}
    />
  );
}

/**
 * Extrait le playback-id Mux depuis une valeur stockée en DB.
 * Gère : ID brut, URL HLS complète, URL image Mux.
 */
export function extractMuxPlaybackId(streamUrl: string | null | undefined): string | null {
  if (!streamUrl) return null;
  const hlsMatch = streamUrl.match(/stream\.mux\.com\/([^./]+)/);
  if (hlsMatch) return hlsMatch[1];
  const imageMatch = streamUrl.match(/image\.mux\.com\/([^./]+)/);
  if (imageMatch) return imageMatch[1];
  if (/^[a-zA-Z0-9_-]+$/.test(streamUrl) && streamUrl.length > 8) return streamUrl;
  return null;
}

function formatSeconds(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}h${m.toString().padStart(2, '0')}`;
  return `${m}m${s.toString().padStart(2, '0')}s`;
}
