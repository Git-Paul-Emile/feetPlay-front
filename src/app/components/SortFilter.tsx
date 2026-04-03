import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, SlidersHorizontal, Check } from 'lucide-react';

export type SortOption = 'date-asc' | 'date-desc' | 'name-asc' | 'name-desc' | 'category' | 'price-asc' | 'price-desc';

interface SortFilterProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

const sortOptions = [
  { value: 'date-asc', label: 'Date : Plus récent', icon: '📅' },
  { value: 'date-desc', label: 'Date : Plus ancien', icon: '📅' },
  { value: 'name-asc', label: 'Nom : A → Z', icon: '🔤' },
  { value: 'name-desc', label: 'Nom : Z → A', icon: '🔤' },
  { value: 'category', label: 'Catégorie', icon: '🏷️' },
  { value: 'price-asc', label: 'Prix : Gratuit en premier', icon: '💰' },
  { value: 'price-desc', label: 'Prix : Payant en premier', icon: '💰' },
] as const;

export function SortFilter({ currentSort, onSortChange }: SortFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentOption = sortOptions.find(opt => opt.value === currentSort);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-[rgba(255,255,255,0.1)] to-[rgba(255,255,255,0.05)] backdrop-blur-md border border-white/10 hover:border-[#DE0035]/50 transition-all group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <SlidersHorizontal className="w-5 h-5 text-[#CDFF71]" />
        <div className="flex flex-col items-start">
          <span className="text-[10px] text-gray-400 uppercase tracking-wide font-['Inter',sans-serif]">
            Trier par
          </span>
          <span className="text-sm font-medium text-white font-['Inter',sans-serif]">
            {currentOption?.label}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#DE0035]" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 right-0 w-[280px] rounded-xl bg-[#1d1d1d] border border-white/10 shadow-2xl overflow-hidden z-50"
          >
            <div className="p-2">
              {sortOptions.map((option, index) => (
                <motion.button
                  key={option.value}
                  onClick={() => {
                    onSortChange(option.value as SortOption);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all ${
                    currentSort === option.value
                      ? 'bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white'
                      : 'hover:bg-white/5 text-gray-300'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{option.icon}</span>
                    <span className="text-sm font-['Inter',sans-serif] font-medium">
                      {option.label}
                    </span>
                  </div>
                  {currentSort === option.value && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-black/30 border-t border-white/5">
              <p className="text-[10px] text-gray-500 text-center font-['Inter',sans-serif]">
                {sortOptions.length} options de tri disponibles
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
