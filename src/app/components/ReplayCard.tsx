import { motion } from 'motion/react';
import replaySvgPaths from "../../imports/svg-humrrgzzi8";

export interface ReplayCardProps {
  image: string;
  title: string;
  location: string;
  date: string;
  duration?: string;
  category?: string;
  onClick?: () => void;
}

export function ReplayCard({ image, title, location, date, duration, category, onClick }: ReplayCardProps) {
  return (
    <motion.div
      className="relative h-[236px] w-full min-w-[320px] sm:min-w-[380px] md:min-w-[420px] lg:min-w-[464px] flex-shrink-0 cursor-pointer group"
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 rounded-[12px] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Dark Overlay */}
        <div 
          className="absolute inset-0 bg-[#02050F] opacity-60"
          style={{ mixBlendMode: 'multiply' }}
        />
      </div>

      {/* Play Button - Center */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[56.758px] h-[60.2px]">
        <motion.div
          className="relative w-full h-full"
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-full h-full" fill="none" viewBox="0 0 56.7584 60.2">
            <g>
              <path 
                d={replaySvgPaths.p4658f0} 
                stroke="#FEFEFE" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeMiterlimit="10" 
                strokeWidth="1.5" 
              />
              <path 
                d={replaySvgPaths.p1bb12a20} 
                stroke="#FEFEFE" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="1.5" 
              />
            </g>
          </svg>
          
          {/* Pulse Animation */}
          <motion.div
            className="absolute inset-0 border-2 border-white rounded-full opacity-0 group-hover:opacity-100"
            animate={{
              scale: [1, 1.3],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </motion.div>
      </div>

      {/* REPLAY Badge - Top Right */}
      <div className="absolute right-[16px] top-[16px] h-[28px] w-[91px]">
        <div className="absolute inset-0 bg-[#de0035] rounded-[30px] flex items-center justify-center px-[10px] py-[4px]">
          <p className="font-['Work_Sans',sans-serif] font-medium text-[14px] text-white leading-[20px]">
            REPLAY
          </p>
          
          {/* Recording Dot */}
          <div className="absolute left-[64px] top-[1px] w-[27px] h-[27px]">
            <svg className="w-full h-full" fill="none" viewBox="0 0 27 27">
              <circle cx="13.5" cy="13.5" r="3.5" fill="#800404" />
            </svg>
            
            {/* Pulse Animation for dot */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.4, 1],
                opacity: [1, 0.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <svg className="w-full h-full" fill="none" viewBox="0 0 27 27">
                <circle cx="13.5" cy="13.5" r="3.5" fill="#DE0035" />
              </svg>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Content - Bottom */}
      <div className="absolute left-[30px] bottom-[30px] right-[30px]">
        {/* Title */}
        <h3 className="font-['Mulish',sans-serif] font-bold text-[#e1e1e2] text-[20px] sm:text-[24px] md:text-[28px] leading-[22px] tracking-[0.14px] mb-[14px]">
          {title}
        </h3>

        {/* Date & Location */}
        <div className="flex items-center gap-[16px] md:gap-[24px] flex-wrap">
          {/* Date */}
          <div className="flex items-center gap-[8px]">
            <div className="w-[18px] h-[18px]">
              <svg className="w-full h-full" fill="none" viewBox="0 0 18 18">
                <g>
                  <path 
                    d="M6 1.5V3.75" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeMiterlimit="10" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M12 1.5V3.75" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeMiterlimit="10" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M2.625 6.8175H15.375" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeMiterlimit="10" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d={replaySvgPaths.p7a1c080} 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeMiterlimit="10" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M11.771 10.275H11.7778" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M11.771 12.525H11.7778" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M8.99661 10.275H9.00335" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M8.99661 12.525H9.00335" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M6.22073 10.275H6.22747" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d="M6.22073 12.525H6.22747" 
                    stroke="#F2F2F2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                </g>
              </svg>
            </div>
            <p className="font-['DM_Sans',sans-serif] font-normal text-[#f2f2f2] text-[11px] sm:text-[12px] leading-[18px]">
              {date}
            </p>
          </div>

          {/* Location */}
          <div className="flex items-center gap-[8px]">
            <div className="w-[13px] h-[16px]">
              <svg className="w-full h-full" fill="none" viewBox="0 0 14.2 17.2">
                <g>
                  <path 
                    d={replaySvgPaths.p3fe2f480} 
                    stroke="white" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                  <path 
                    d={replaySvgPaths.p26bd5180} 
                    stroke="white" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="1.2" 
                  />
                </g>
              </svg>
            </div>
            <p className="font-['DM_Sans',sans-serif] font-medium text-white text-[11px] sm:text-[12px] leading-[28px] truncate">
              {location}
            </p>
          </div>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-[12px] border-2 border-[#DE0035] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" 
           style={{ 
             boxShadow: '0 0 20px rgba(222, 0, 53, 0.5)' 
           }} 
      />
    </motion.div>
  );
}