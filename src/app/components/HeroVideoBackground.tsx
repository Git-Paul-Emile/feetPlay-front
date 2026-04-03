import { ReactNode } from 'react';
import { motion } from 'motion/react';

interface HeroVideoBackgroundProps {
  videoSrc?: string;
  posterImage: string;
  children: ReactNode;
}

export function HeroVideoBackground({ videoSrc, posterImage, children }: HeroVideoBackgroundProps) {
  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Background Video/Image */}
      {videoSrc ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterImage}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      ) : (
        <img
          src={posterImage}
          alt="Hero background"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[rgba(0,0,0,0.9)] from-40% to-transparent" />
      
      {/* Content */}
      <motion.div
        className="relative h-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        {children}
      </motion.div>
    </div>
  );
}
