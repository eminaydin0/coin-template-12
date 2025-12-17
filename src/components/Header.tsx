import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  User,
  LogOut,
  Menu,
  X,
  Search,
  ChevronDown,
  Settings,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWebsite } from '../context/WebsiteContext';
import { useCheckout } from '../context/CheckoutContext';

interface HeaderProps {
  onOpenSearch: () => void;
  hideHeader?: boolean;
}

const Header = ({ onOpenSearch, hideHeader = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const { getItemCount } = useCart();
  const { isCheckoutModalOpen } = useCheckout();
  const navigate = useNavigate();
  const location = useLocation();
  const { getInfoValue } = useWebsite();

  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (path: string) => (path === '/' ? location.pathname === '/' : location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((s) => !s);
  const toggleUserMenu = () => setIsUserMenuOpen((s) => !s);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (isUserMenuOpen && userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', onClick);
    return () => window.removeEventListener('mousedown', onClick);
  }, [isUserMenuOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k';
      if ((e.ctrlKey || e.metaKey) && isK) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenSearch]);

  useEffect(() => {
    const onScroll = () => {
      setIsCompact(window.scrollY > 50);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (hideHeader || isCheckoutModalOpen) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800"
      role="banner"
    >
      <div className={`relative transition-all duration-200 ${isCompact ? 'py-2' : 'py-3'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Ana sayfa">
              <div className="text-2xl font-bold text-white">
                {getInfoValue('TITLE') || 'Xbox'}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/') && location.pathname === '/'
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Ana Sayfa
              </Link>
              <Link
                to="/oyunlar"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/oyunlar')
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Oyunlar
              </Link>
              <Link
                to="/rehber"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/rehber')
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Rehber
              </Link>
              <Link
                to="/iletisim"
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  isActive('/iletisim')
                    ? 'text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                İletişim
              </Link>
              {isAuthenticated && (
                <Link
                  to="/siparislerim"
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    isActive('/siparislerim')
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Siparişlerim
                </Link>
              )}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Button */}
              <button
                onClick={onOpenSearch}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Ara"
              >
                <Search className="h-5 w-5" />
              </button>

              {isAuthenticated ? (
                <>
                  {/* Cart Button */}
                  <Link
                    to="/sepet"
                    className="relative p-2 text-gray-300 hover:text-white transition-colors"
                    aria-label="Sepet"
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-4 px-1 text-[10px] font-semibold text-white bg-[#107C10] rounded-full">
                        {getItemCount() > 99 ? '99+' : getItemCount()}
                      </span>
                    )}
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                      aria-expanded={isUserMenuOpen}
                      aria-haspopup="menu"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#107C10] flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <span className="hidden lg:inline max-w-[120px] truncate">
                        {user?.firstName || 'Kullanıcı'}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-gray-800 rounded shadow-lg overflow-hidden z-50"
                          role="menu"
                        >
                          <div className="px-4 py-3 border-b border-gray-800">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-[#107C10] flex items-center justify-center">
                                <User className="h-5 w-5 text-white" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="text-sm font-semibold text-white truncate">
                                  {user?.firstName} {user?.lastName}
                                </h3>
                                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                              </div>
                            </div>
                          </div>

                          <div className="p-2">
                            <Link
                              to="/profil"
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                            >
                              <Settings className="h-4 w-4" />
                              <span>Profil Ayarları</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/20 rounded transition-colors"
                            >
                              <LogOut className="h-4 w-4" />
                              <span>Çıkış Yap</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/giris-yap"
                    className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit-ol"
                    className="px-4 py-2 text-sm font-semibold text-white bg-[#107C10] hover:bg-[#0E6B0E] rounded transition-colors"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Actions */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={onOpenSearch}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Ara"
              >
                <Search className="h-5 w-5" />
              </button>

              {isAuthenticated && (
                <Link
                  to="/sepet"
                  className="relative p-2 text-gray-300 hover:text-white transition-colors"
                  aria-label="Sepet"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {getItemCount() > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-semibold text-white bg-[#107C10] rounded-full">
                      {getItemCount() > 99 ? '99+' : getItemCount()}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={toggleMenu}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                aria-label="Menü"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-[#1A1A1A] border-l border-gray-800 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full">
                <div className="px-4 py-4 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Menü</h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-1">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                        isActive('/') && location.pathname === '/'
                          ? 'text-white bg-gray-800'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      Ana Sayfa
                    </Link>
                    <Link
                      to="/oyunlar"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                        isActive('/oyunlar')
                          ? 'text-white bg-gray-800'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      Oyunlar
                    </Link>
                    <Link
                      to="/rehber"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                        isActive('/rehber')
                          ? 'text-white bg-gray-800'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      Rehber
                    </Link>
                    <Link
                      to="/iletisim"
                      onClick={() => setIsMenuOpen(false)}
                      className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                        isActive('/iletisim')
                          ? 'text-white bg-gray-800'
                          : 'text-gray-300 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      İletişim
                    </Link>
                    {isAuthenticated && (
                      <Link
                        to="/siparislerim"
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                          isActive('/siparislerim')
                            ? 'text-white bg-gray-800'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800'
                        }`}
                      >
                        Siparişlerim
                      </Link>
                    )}
                  </div>

                  {isAuthenticated ? (
                    <div className="mt-6 pt-6 border-t border-gray-800 space-y-1">
                      <div className="px-4 py-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#107C10] flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-white truncate">
                              {user?.firstName} {user?.lastName}
                            </div>
                            <div className="text-xs text-gray-400 truncate">{user?.email}</div>
                          </div>
                        </div>
                      </div>
                      <Link
                        to="/profil"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      >
                        Profil Ayarları
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 rounded transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  ) : (
                    <div className="mt-6 pt-6 border-t border-gray-800 space-y-2">
                      <Link
                        to="/giris-yap"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white hover:bg-gray-800 rounded transition-colors"
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        to="/kayit-ol"
                        onClick={() => setIsMenuOpen(false)}
                        className="block w-full px-4 py-3 text-sm font-semibold text-center text-white bg-[#107C10] hover:bg-[#0E6B0E] rounded transition-colors"
                      >
                        Kayıt Ol
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
