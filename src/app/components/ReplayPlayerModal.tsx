import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Pause, Volume2, VolumeX, Maximize, Clock, Calendar, MapPin } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ReplayPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  replay: {
    title: string;
    image: string;
    location: string;
    date: string;
    duration?: string;
    category?: string;
  } | null;
}

export function ReplayPlayerModal({ isOpen, onClose, replay }: ReplayPlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsTimeoutRef = useRef<number>();

  useEffect(() => {
    if (!isOpen) {
      // Reset state when closing
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentTime(0);
      setIsLoading(true);
    } else {
      // When opening, ensure video is ready
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
      } catch (error) {
        console.error('Error playing video:', error);
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
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsLoading(false);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleVideoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    handlePlayPause();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowControls(true);
  };

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = window.setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  if (!replay) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            transition={{ duration: 0.3, type: "spring", damping: 25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="relative w-full max-w-6xl bg-[#0D0D0D] rounded-xl overflow-hidden shadow-2xl pointer-events-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 w-12 h-12 bg-[#de0035] rounded-full flex items-center justify-center hover:bg-[#c5002f] transition-colors group"
                aria-label="Fermer"
              >
                <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
              </button>

              {/* Video Player */}
              <div 
                className="relative w-full aspect-video bg-black group"
                onMouseMove={handleMouseMove}
                onMouseLeave={() => isPlaying && setShowControls(false)}
              >
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  poster={replay.image}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onCanPlay={handleCanPlay}
                  onEnded={handleEnded}
                  onClick={handleVideoClick}
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>

                {/* Play Overlay - Shown when paused */}
                <AnimatePresence>
                  {!isPlaying && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 flex items-center justify-center bg-black/30"
                      onClick={handlePlayPause}
                    >
                      <motion.button
                        className="w-20 h-20 bg-[#DE0035] rounded-full flex items-center justify-center hover:bg-[#c5002f] transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-10 h-10 text-white ml-1" fill="white" />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Video Controls */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4"
                    >
                      {/* Progress Bar */}
                      <div className="mb-3">
                        <input
                          type="range"
                          min="0"
                          max={duration || 0}
                          value={currentTime}
                          onChange={handleSeek}
                          className="w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                          style={{
                            background: `linear-gradient(to right, #DE0035 0%, #DE0035 ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) ${(currentTime / duration) * 100}%, rgba(255,255,255,0.3) 100%)`
                          }}
                        />
                      </div>

                      {/* Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Play/Pause */}
                          <button
                            onClick={handlePlayPause}
                            className="text-white hover:text-[#CDFF71] transition-colors"
                          >
                            {isPlaying ? (
                              <Pause className="w-6 h-6" fill="white" />
                            ) : (
                              <Play className="w-6 h-6" fill="white" />
                            )}
                          </button>

                          {/* Volume */}
                          <button
                            onClick={handleMuteToggle}
                            className="text-white hover:text-[#CDFF71] transition-colors"
                          >
                            {isMuted ? (
                              <VolumeX className="w-6 h-6" />
                            ) : (
                              <Volume2 className="w-6 h-6" />
                            )}
                          </button>

                          {/* Time */}
                          <span className="font-['Inter',sans-serif] text-white text-sm">
                            {formatTime(currentTime)} / {formatTime(duration)}
                          </span>
                        </div>

                        {/* Fullscreen */}
                        <button
                          onClick={handleFullscreen}
                          className="text-white hover:text-[#CDFF71] transition-colors"
                        >
                          <Maximize className="w-6 h-6" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Free Badge */}
                <div className="absolute top-4 left-4 z-40">
                  <div className="bg-[#CDFF71] px-4 py-2 rounded-full">
                    <span className="font-['Inter',sans-serif] font-bold text-[#000441] text-sm">
                      🎬 REPLAY GRATUIT
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Info */}
              <div className="p-6 bg-[#0D0D0D]">
                <h3 className="font-['Inter',sans-serif] font-bold text-white text-2xl mb-4">
                  {replay.title}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Location */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-[#CDFF71]" />
                    </div>
                    <div>
                      <p className="font-['Inter',sans-serif] text-white/60 text-xs mb-1">
                        Lieu
                      </p>
                      <p className="font-['Inter',sans-serif] text-white text-sm">
                        {replay.location}
                      </p>
                    </div>
                  </div>

                  {/* Date */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-[#CDFF71]" />
                    </div>
                    <div>
                      <p className="font-['Inter',sans-serif] text-white/60 text-xs mb-1">
                        Date de diffusion
                      </p>
                      <p className="font-['Inter',sans-serif] text-white text-sm">
                        {replay.date}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  {replay.duration && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[#CDFF71]" />
                      </div>
                      <div>
                        <p className="font-['Inter',sans-serif] text-white/60 text-xs mb-1">
                          Durée
                        </p>
                        <p className="font-['Inter',sans-serif] text-white text-sm">
                          {replay.duration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* CTA */}
                <div className="mt-6 p-4 bg-white/5 rounded-lg border border-[#CDFF71]/20">
                  <p className="font-['Inter',sans-serif] text-white/80 text-sm text-center">
                    🎉 Ce replay est <span className="text-[#CDFF71] font-bold">100% gratuit</span> et disponible immédiatement !
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Custom scrollbar and range styles */}
          <style>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 14px;
              height: 14px;
              background: #DE0035;
              cursor: pointer;
              border-radius: 50%;
              border: 2px solid white;
            }
            
            input[type="range"]::-moz-range-thumb {
              width: 14px;
              height: 14px;
              background: #DE0035;
              cursor: pointer;
              border-radius: 50%;
              border: 2px solid white;
            }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
}