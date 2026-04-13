import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Clock, Calendar, MapPin, RotateCcw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { MuxPlayer, extractMuxPlaybackId } from './MuxPlayer';
import StreamingAPI from '../services/api/StreamingAPI';
import type { StreamingEvent } from '../services/api/EventsAPI';

interface ReplayPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  replay: StreamingEvent | null;
}

/** Convertit un pourcentage de progression en secondes selon la durée du replay */
function progressToSeconds(progress: number, durationStr: string): number {
  if (!progress || progress <= 0) return 0;
  const match = durationStr.match(/(\d+)h(\d+)?|(\d+)m(\d+)?|(\d+)/);
  if (!match) return 0;
  let totalSeconds = 0;
  // Format "Xh30" ou "2h30" → secondes
  const hourMatch = durationStr.match(/(\d+)h(?:(\d+))?/);
  if (hourMatch) {
    totalSeconds += parseInt(hourMatch[1]) * 3600;
    if (hourMatch[2]) totalSeconds += parseInt(hourMatch[2]) * 60;
  }
  // Format "Xm" ou "Xm30s"
  const minMatch = durationStr.match(/(\d+)m(?:(\d+)s?)?/);
  if (minMatch && !hourMatch) {
    totalSeconds += parseInt(minMatch[1]) * 60;
    if (minMatch[2]) totalSeconds += parseInt(minMatch[2]);
  }
  return Math.floor((progress / 100) * totalSeconds);
}

export function ReplayPlayerModal({ isOpen, onClose, replay }: ReplayPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [savedProgress, setSavedProgress] = useState<number>(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [showResumeBar, setShowResumeBar] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number>();

  // Charge la progression sauvegardée quand le modal s'ouvre
  useEffect(() => {
    if (!isOpen || !replay?.id) {
      setSavedProgress(0);
      setStartTime(0);
      setShowResumeBar(false);
      setPlayerError(false);
      return;
    }

    StreamingAPI.getWatchHistory('me').then(history => {
      const entry = history.find(h => h.eventId === replay.id);
      if (entry && entry.progress > 5 && entry.progress < 95) {
        setSavedProgress(entry.progress);
        const seconds = progressToSeconds(entry.progress, replay.duration ?? '');
        setStartTime(seconds);
        setShowResumeBar(true);
      }
    }).catch(() => {/* silencieux si non connecté */});
  }, [isOpen, replay?.id, replay?.duration]);

  useEffect(() => {
    if (!isOpen) {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setIsLoading(true);
      setShowResumeBar(false);
    } else {
      setIsLoading(true);
    }
  }, [isOpen]);

  const handlePlayPause = async () => {
    if (videoRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          await videoRef.current.play();
          setIsPlaying(true);
        }
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current?.requestFullscreen) videoRef.current.requestFullscreen();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const formatTime = (time: number) => {
    const h = Math.floor(time / 3600);
    const m = Math.floor((time % 3600) / 60);
    const s = Math.floor(time % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
  };

  const handleRestart = () => {
    setStartTime(0);
    setShowResumeBar(false);
  };

  if (!replay) return null;

  const playbackId = extractMuxPlaybackId(replay.streamUrl);
  const isFree = replay.isFree ?? true;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-6xl bg-[#0D0D0D] rounded-xl overflow-hidden shadow-2xl pointer-events-auto">
              {/* Bouton fermer */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-12 h-12 bg-[#de0035] rounded-full flex items-center justify-center hover:bg-[#c5002f] transition-colors group"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Bannière "Reprendre" */}
              <AnimatePresence>
                {showResumeBar && (
                  <motion.div
                    initial={{ y: -40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -40, opacity: 0 }}
                    className="absolute top-0 left-0 right-0 z-40 bg-[#000441]/90 backdrop-blur-sm px-6 py-3 flex items-center justify-between"
                  >
                    <p className="font-['Inter',sans-serif] text-white text-sm">
                      Reprendre à <span className="text-[#CDFF71] font-bold">{savedProgress}%</span>
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setShowResumeBar(false)}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-[#CDFF71] text-[#000441] text-sm font-bold rounded-full hover:bg-[#b8e85e] transition-colors"
                      >
                        <Play className="w-3.5 h-3.5" fill="#000441" />
                        Reprendre
                      </button>
                      <button
                        onClick={handleRestart}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-white/10 text-white text-sm rounded-full hover:bg-white/20 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Début
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Lecteur vidéo */}
              {playbackId ? (
                <div className="relative w-full aspect-video bg-black">
                  {!playerError ? (
                    <MuxPlayer
                      playbackId={playbackId}
                      streamType="on-demand"
                      title={replay.title}
                      poster={replay.image}
                      autoPlay={false}
                      startTime={showResumeBar ? startTime : 0}
                      eventId={replay.id}
                      eventTitle={replay.title}
                      onError={() => setPlayerError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-white/60">
                      <svg className="w-14 h-14 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <p className="text-sm">Erreur de lecture du replay.</p>
                      <button
                        onClick={() => setPlayerError(false)}
                        className="px-5 py-2 bg-[#DE0035] text-white text-sm rounded-full hover:bg-[#c5002f] transition-colors"
                      >
                        Réessayer
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Fallback HTML5 si pas de playbackId Mux */
                <div
                  className="relative w-full aspect-video bg-black group"
                  onMouseMove={handleMouseMove}
                  onMouseLeave={() => isPlaying && setShowControls(false)}
                >
                  {replay.streamUrl ? (
                    <>
                      <video
                        ref={videoRef}
                        src={replay.streamUrl}
                        className="w-full h-full object-contain"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onCanPlay={() => setIsLoading(false)}
                        onEnded={handleEnded}
                        onClick={handlePlayPause}
                      />
                      {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                          <div className="w-10 h-10 border-2 border-[#CDFF71] border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-white/60">
                      <svg className="w-16 h-16 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M4 8h8a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4a2 2 0 012-2z" />
                      </svg>
                      <p className="text-sm">Replay non disponible</p>
                    </div>
                  )}

                  <AnimatePresence>
                    {!isPlaying && !isLoading && replay.streamUrl && (
                      <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/30"
                        onClick={handlePlayPause}
                      >
                        <motion.button
                          className="w-20 h-20 bg-[#DE0035] rounded-full flex items-center justify-center hover:bg-[#c5002f] transition-colors"
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                        >
                          <Play className="w-10 h-10 text-white ml-1" fill="white" />
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <AnimatePresence>
                    {showControls && replay.streamUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4"
                      >
                        <div className="mb-3">
                          <input
                            type="range" min="0" max={duration || 0} value={currentTime}
                            onChange={handleSeek}
                            className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                            style={{ background: `linear-gradient(to right, #DE0035 0%, #DE0035 ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.3) ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.3) 100%)` }}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button onClick={handlePlayPause} className="text-white hover:text-[#CDFF71] transition-colors">
                              {isPlaying ? <Pause className="w-6 h-6" fill="white" /> : <Play className="w-6 h-6" fill="white" />}
                            </button>
                            <button onClick={handleMuteToggle} className="text-white hover:text-[#CDFF71] transition-colors">
                              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                            </button>
                            <span className="font-['Inter',sans-serif] text-white text-sm">
                              {formatTime(currentTime)} / {formatTime(duration)}
                            </span>
                          </div>
                          <button onClick={handleFullscreen} className="text-white hover:text-[#CDFF71] transition-colors">
                            <Maximize className="w-6 h-6" />
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="absolute top-4 left-4 z-40">
                    <div className="bg-[#CDFF71] px-4 py-2 rounded-full">
                      <span className="font-['Inter',sans-serif] font-bold text-[#000441] text-sm">
                        REPLAY {isFree ? 'GRATUIT' : ''}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Infos */}
              <div className="p-6 bg-[#0D0D0D]">
                <h3 className="font-['Inter',sans-serif] font-bold text-white text-2xl mb-4">
                  {replay.title}
                </h3>

                {replay.description && (
                  <p className="font-['Inter',sans-serif] text-white/60 text-sm mb-4 line-clamp-2">
                    {replay.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#CDFF71]" />
                    </div>
                    <div>
                      <p className="font-['Inter',sans-serif] text-white/60 text-xs mb-1">Lieu</p>
                      <p className="font-['Inter',sans-serif] text-white text-sm">
                        {replay.location ?? replay.channelName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#CDFF71]" />
                    </div>
                    <div>
                      <p className="font-['Inter',sans-serif] text-white/60 text-xs mb-1">Date de diffusion</p>
                      <p className="font-['Inter',sans-serif] text-white text-sm">{replay.date}</p>
                    </div>
                  </div>

                  {replay.duration && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#CDFF71]" />
                      </div>
                      <div>
                        <p className="font-['Inter',sans-serif] text-white/60 text-xs mb-1">Durée</p>
                        <p className="font-['Inter',sans-serif] text-white text-sm">{replay.duration}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-[#CDFF71]/20">
                  {isFree ? (
                    <p className="font-['Inter',sans-serif] text-white/80 text-sm text-center">
                      Ce replay est <span className="text-[#CDFF71] font-bold">100% gratuit</span> et disponible immédiatement !
                    </p>
                  ) : (
                    <p className="font-['Inter',sans-serif] text-white/80 text-sm text-center">
                      Replay disponible avec votre billet — <span className="text-[#CDFF71] font-bold">{replay.price?.toLocaleString()} {replay.currency}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none; width: 14px; height: 14px;
              background: #DE0035; cursor: pointer; border-radius: 50%; border: 2px solid white;
            }
            input[type="range"]::-moz-range-thumb {
              width: 14px; height: 14px; background: #DE0035;
              cursor: pointer; border-radius: 50%; border: 2px solid white;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}
