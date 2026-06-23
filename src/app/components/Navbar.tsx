import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Search, User, Menu, X, ChevronDown, MapPin, Ticket, Clock, Heart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../../imports/svg-z30khrsoqy";
import { NotificationCenter } from './NotificationCenter';
import { useAuth } from '../contexts/AuthContext';
import { useLocationContext, ALL_COUNTRIES } from '../contexts/LocationContext';

const countries = [
  ALL_COUNTRIES,
  { code: 'CG', name: 'Congo' },
  { code: 'GA', name: 'Gabon' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'CF', name: 'RCA' },
  { code: 'TD', name: 'TCHAD' },
  { code: 'CD', name: 'RDC' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const { selectedCountry, setSelectedCountry } = useLocationContext();
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0a]/90 backdrop-blur-xl shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-14 md:h-16 lg:h-18 xl:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <img
              src="/logo blanc.png"
              alt="Fééti Play"
              className="h-7 md:h-8 lg:h-9 xl:h-10 w-auto object-contain"
            />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden xl:flex items-center gap-12">
            <Link
              to="/"
              className={`font-['Inter',sans-serif] text-base 2xl:text-lg transition-colors ${
                location.pathname === '/'
                  ? 'text-white font-bold'
                  : 'text-white font-normal hover:opacity-80'
              }`}
            >
              Acceuil
            </Link>
            
            <button className="flex items-center gap-1 font-['Inter',sans-serif] text-white text-base 2xl:text-lg font-normal hover:opacity-80 transition-opacity">
              <Link to="/live" className="text-white">En Live</Link>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            <button className="flex items-center gap-1 font-['Inter',sans-serif] text-white text-base 2xl:text-lg font-normal hover:opacity-80 transition-opacity">
              <Link to="/replay" className="text-white">Replay</Link>
              <ChevronDown className="w-4 h-4" />
            </button>

            <Link
              to="/createurs"
              className="font-['Inter',sans-serif] text-white text-base 2xl:text-lg font-normal hover:opacity-80 transition-opacity"
            >
              Créateurs
            </Link>

            <Link
              to="/agenda"
              className="font-['Inter',sans-serif] text-white text-base 2xl:text-lg font-normal hover:opacity-80 transition-opacity"
            >
              Agenda
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="group relative w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(205,255,113,0.5)] border border-white/20"
              style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(205, 255, 113, 0.1) 100%))" }}
              aria-label="Rechercher"
            >
              <Search className="w-5 h-5 text-[#CDFF71] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(205,255,113,1)]" strokeWidth={2.5} />
            </button>

            {/* Flag/Location Button with Dropdown */}
            <div className="relative hidden md:block">
              <button
                className="group relative w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] border border-white/20"
                style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%))" }}
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                aria-label="Sélectionner un pays"
              >
                <MapPin className="w-5 h-5 text-white transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,1)]" strokeWidth={2.5} />
              </button>

              {/* Country Dropdown Menu */}
              <AnimatePresence>
                {countryDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <div className="py-2">
                      {countries.map((country) => (
                        <button
                          key={country.code}
                          className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 rounded-lg ${
                            selectedCountry.code === country.code ? 'bg-white/10 text-[#CDFF71]' : 'text-white'
                          }`}
                          onClick={() => {
                            setSelectedCountry(country);
                            setCountryDropdownOpen(false);
                          }}
                        >
                          <MapPin className="w-4 h-4 flex-shrink-0" strokeWidth={2} />
                          <span className="font-['Inter',sans-serif] text-sm">{country.name}</span>
                          {selectedCountry.code === country.code && (
                            <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notification Center */}
            <div className="hidden md:block">
              <NotificationCenter />
            </div>

            {/* Profile Button */}
            <div className="relative">
              {isAuthenticated && user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="group relative w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(205,255,113,0.5)] border border-white/20 overflow-hidden"
                    style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(205, 255, 113, 0.1) 100%))" }}
                    aria-label="Menu utilisateur"
                  >
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-[#CDFF71]" strokeWidth={2.5} />
                    )}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 top-full mt-2 w-52 bg-[#111] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-white text-sm font-semibold truncate">{user.name}</p>
                          <p className="text-white/40 text-xs truncate">{user.email}</p>
                        </div>
                        {[
                          { to: '/profile', icon: User, label: 'Mon profil' },
                          { to: '/my-tickets', icon: Ticket, label: 'Mes tickets' },
                          { to: '/favorites', icon: Heart, label: 'Favoris' },
                          { to: '/watch-history', icon: Clock, label: 'Historique' },
                        ].map(item => (
                          <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white text-sm transition-colors">
                            <item.icon className="w-4 h-4" />{item.label}
                          </Link>
                        ))}
                        <button
                          onClick={async () => { await logout(); setUserMenuOpen(false); navigate('/'); }}
                          className="flex items-center gap-3 w-full px-4 py-3 text-[#DE0035] hover:bg-white/5 text-sm transition-colors border-t border-white/10"
                        >
                          <LogOut className="w-4 h-4" />Déconnexion
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to="/login">
                  <button
                    className="group relative w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300 hover:shadow-[0_0_25px_rgba(205,255,113,0.5)] border border-white/20"
                    style={{ backgroundImage: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(205, 255, 113, 0.1) 100%))" }}
                    aria-label="Profil"
                  >
                    <User className="w-5 h-5 text-[#CDFF71] transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(205,255,113,1)]" strokeWidth={2.5} />
                  </button>
                </Link>
              )}
            </div>
            
            {/* Mobile Menu Toggle */}
            <button
              className="xl:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-gray-800">
            <div className="flex flex-col gap-1 py-4">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-white/10 text-white font-bold' 
                    : 'text-gray-300 hover:bg-white/5'
                }`}
              >
                Acceuil
              </Link>
              <Link
                to="/live"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                En Live
              </Link>
              <Link
                to="/replay"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Replay
              </Link>
              <Link
                to="/createurs"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Créateurs
              </Link>
              <Link
                to="/agenda"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Agenda
              </Link>
              
              {/* Mobile Login Link */}
              <div className="border-t border-gray-800 mt-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-3 text-[#CDFF71] hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar Dropdown */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-white/10"
            >
              <div className="py-4 md:py-6">
                <div className="relative max-w-3xl mx-auto">
                  <form onSubmit={handleSearch}>
                    <input
                      type="text"
                      placeholder="Rechercher des événements, chaînes, créateurs..."
                      className="w-full px-5 md:px-6 py-3 md:py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white placeholder:text-white/50 font-['Inter',sans-serif] text-sm md:text-base focus:outline-none focus:border-[#CDFF71] focus:ring-2 focus:ring-[#CDFF71]/30 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      aria-label="Rechercher"
                    >
                      <Search className="w-5 h-5 text-[#CDFF71]" />
                    </button>
                  </form>
                  
                  {/* Quick Search Suggestions */}
                  {searchQuery.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl overflow-hidden"
                    >
                      <div className="p-2">
                        <button
                          onClick={() => {
                            handleSearch(new Event('submit') as any);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-white/10 rounded-lg transition-colors flex items-center gap-3 text-white"
                        >
                          <Search className="w-4 h-4 text-[#CDFF71]" />
                          <span className="font-['Inter',sans-serif] text-sm">
                            Rechercher "<span className="text-[#CDFF71]">{searchQuery}</span>"
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}