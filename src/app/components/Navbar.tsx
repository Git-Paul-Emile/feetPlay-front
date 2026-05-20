import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { Search, User, Menu, X, ChevronDown, LogOut, Video } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../../imports/svg-z30khrsoqy";
import profileSvgPaths from "../../imports/svg-2f5i9mgwjd";
import { useAuth } from '../contexts/AuthContext';
import { useCreatorAuth } from '../contexts/CreatorAuthContext';

const countries = [
  { code: 'CG', name: 'Congo' },
  { code: 'GA', name: 'Gabon' },
  { code: 'CM', name: 'Cameroun' },
  { code: 'CF', name: 'RCA' },
  { code: 'TD', name: 'TCHAD' },
  { code: 'CD', name: 'RDC' },
];

function getInitials(name?: string | null): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function ProfileAvatar({ avatar, name }: { avatar?: string | null; name?: string | null }) {
  const [broken, setBroken] = useState(false);
  const initials = getInitials(name);

  if (avatar && !broken) {
    return (
      <img
        src={avatar}
        alt={name ?? ''}
        className="w-7 h-7 rounded-full object-cover"
        onError={() => setBroken(true)}
      />
    );
  }
  if (initials) {
    return (
      <span className="w-7 h-7 rounded-full bg-[#CDFF71]/20 flex items-center justify-center text-[#CDFF71] font-bold text-xs leading-none">
        {initials}
      </span>
    );
  }
  return <User className="w-4 h-4 text-[#CDFF71]" />;
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { isAuthenticated: isCreator } = useCreatorAuth();

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const close = (e: MouseEvent) => {
      const target = e.target as Element;
      if (!target.closest('[data-profile-menu]')) setProfileMenuOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [profileMenuOpen]);

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
          <Link to="/" className="flex items-center flex-shrink-0 hover:opacity-80 transition-opacity">
            <img src="/fplay_2.png" alt="Fééti" className="h-[60px] md:h-[70px] lg:h-[80px] xl:h-[100px] w-auto object-contain" />
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
              to="/chaines"
              className="font-['Inter',sans-serif] text-white text-base 2xl:text-lg font-normal hover:opacity-80 transition-opacity"
            >
              Chaines
            </Link>
            
            <Link
              to="/agenda"
              className="font-['Inter',sans-serif] text-white text-base 2xl:text-lg font-normal hover:opacity-80 transition-opacity"
            >
              Agenda
            </Link>

            <Link
              to={isCreator ? "/creator/dashboard" : "/creator/login"}
              className="flex items-center gap-1.5 font-['Inter',sans-serif] text-[#CDFF71] text-base 2xl:text-lg font-semibold hover:opacity-80 transition-opacity"
            >
              <Video className="w-4 h-4" />
              Créateurs
            </Link>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
            {/* Search Button */}
            <button 
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-105 transition-transform" 
              style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
              aria-label="Rechercher"
            >
              <div className="w-4 h-4 md:w-4 md:h-4">
                <svg className="w-full h-full" fill="none" viewBox="0 0 10.3888 10.2499">
                  <path d={svgPaths.p23740d80} stroke="#CDFF71" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
                </svg>
              </div>
            </button>

            {/* Flag/Location Button with Dropdown */}
            <div className="relative hidden md:block">
              <button
                className="w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-105 transition-transform"
                style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
                onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
                aria-label="Sélectionner un pays"
              >
                <div className="w-3 h-3 md:w-4 md:h-4">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 16.4287 23.2858">
                    <g>
                      <path d="M0.50011 0.50011V22.7858" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={svgPaths.pd909fc0} stroke="white" strokeLinecap="round" strokeLinejoin="round" />
                    </g>
                  </svg>
                </div>
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
                          className={`w-full px-4 py-2.5 text-left hover:bg-white/10 transition-colors flex items-center gap-3 ${
                            selectedCountry.code === country.code ? 'bg-white/10 text-[#CDFF71]' : 'text-white'
                          }`}
                          onClick={() => {
                            setSelectedCountry(country);
                            setCountryDropdownOpen(false);
                          }}
                        >
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16.4287 23.2858">
                            <g>
                              <path d="M0.50011 0.50011V22.7858" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                              <path d={svgPaths.pd909fc0} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                          </svg>
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

            {/* Profile Button */}
            <div className="relative" data-profile-menu>
              {isAuthenticated ? (
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="group w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(205,255,113,0.3)]"
                  style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
                  aria-label="Menu profil"
                >
                  <ProfileAvatar avatar={user?.avatar} name={user?.name} />
                </button>
              ) : (
              <Link to="/login">
                <button
                  className="group w-10 h-10 md:w-12 md:h-12 backdrop-blur-[5px] rounded-[28px] flex items-center justify-center hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(205,255,113,0.3)]"
                  style={{ backgroundImage: "linear-gradient(88.1659deg, rgba(255, 255, 255, 0.3) 0%, rgba(32, 11, 11, 0.3) 100%))" }}
                  aria-label="Profil"
                >
                  <div className="w-[17px] h-[18.5px] md:w-[18px] md:h-[19.5px] relative transition-transform duration-300 group-hover:scale-110">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 17.4999 18.5088">
                      {/* Head Circle */}
                      <path
                        d={profileSvgPaths.p23740d80}
                        stroke="#CDFF71"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:stroke-[2] group-hover:drop-shadow-[0_0_8px_rgba(205,255,113,0.8)]"
                      />
                      {/* Body */}
                      <path
                        d={profileSvgPaths.p398fea00}
                        stroke="#CDFF71"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        className="transition-all duration-300 group-hover:stroke-[2] group-hover:drop-shadow-[0_0_8px_rgba(205,255,113,0.8)]"
                      />
                    </svg>
                  </div>
                </button>
              </Link>
              )}

              {/* Dropdown menu profil (utilisateur connecté) */}
              <AnimatePresence>
                {isAuthenticated && profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-52 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/20 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-white font-semibold text-sm truncate">{user?.name}</p>
                      <p className="text-[#999999] text-xs truncate">{user?.email}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to={isCreator ? "/creator/dashboard" : "/creator/login"}
                        onClick={() => setProfileMenuOpen(false)}
                        className="w-full px-4 py-2.5 text-left text-[#CDFF71] hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Video className="w-4 h-4" />
                        {isCreator ? "Mon espace créateur" : "Devenir créateur"}
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-red-400 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
                to="/chaines"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Chaines
              </Link>
              <Link
                to="/agenda"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
              >
                Agenda
              </Link>
              <Link
                to={isCreator ? "/creator/dashboard" : "/creator/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-3 text-[#CDFF71] hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 font-semibold"
              >
                <Video className="w-4 h-4" />
                {isCreator ? "Mon espace créateur" : "Devenir créateur"}
              </Link>

              {/* Mobile auth section */}
              <div className="border-t border-gray-800 mt-2 pt-2">
                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2">
                      <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                      <p className="text-[#999999] text-xs truncate">{user?.email}</p>
                    </div>
                    <button
                      onClick={() => { setMobileMenuOpen(false); void handleLogout(); }}
                      className="w-full px-4 py-3 text-red-400 hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2 text-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      Se déconnecter
                    </button>
                  </>
                ) : (
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-4 py-3 text-[#CDFF71] hover:bg-white/5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    Se connecter
                  </Link>
                )}
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