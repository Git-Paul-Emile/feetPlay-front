import { Search } from 'lucide-react';
import { motion } from 'motion/react';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function SearchBar({ 
  placeholder = 'Rechercher un événement...', 
  className = '',
  searchTerm,
  onSearchChange
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-[#1d1d1d] border border-white/10 rounded-xl text-white placeholder:text-gray-500 focus:outline-none focus:border-[#DE0035]/50 transition-all font-['Inter',sans-serif] text-sm"
        />
        {searchTerm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-[#DE0035] to-[#FF1744] text-white px-4 py-1.5 rounded-lg text-xs font-medium pointer-events-none"
          >
            {searchTerm.length} caractères
          </motion.div>
        )}
      </div>
    </div>
  );
}