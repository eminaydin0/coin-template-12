import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOut,
  Menu,
  X,
  ChevronDown,
  Settings,
  Home,
  Gamepad2,
  BookOpen,
  Mail,
  Package,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  UserCircle,
  SearchIcon,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWebsite } from '../context/WebsiteContext';
import { useCheckout } from '../context/CheckoutContext';
import { useSidebar } from '../context/SidebarContext';

interface HeaderProps {
  onOpenSearch: () => void;
  hideHeader?: boolean;
}

const Header = ({ onOpenSearch, hideHeader = false }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const tooltipRefs = useRef<{ [key: string]: { top: number; left: number } }>({});
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
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
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);

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

  if (hideHeader || isCheckoutModalOpen) return null;

  const navItems = [
    { path: '/', label: 'Ana Sayfa', icon: Home },
    { path: '/oyunlar', label: 'Oyunlar', icon: Gamepad2 },
    { path: '/rehber', label: 'Rehber', icon: BookOpen },
    { path: '/iletisim', label: 'İletişim', icon: Mail },
  ];

  if (isAuthenticated) {
    navItems.push({ path: '/siparislerim', label: 'Siparişlerim', icon: Package });
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex fixed left-0 top-0 bottom-0 z-50 flex-col transition-all duration-300 ease-in-out overflow-visible ${
          isSidebarOpen ? 'w-80' : 'w-20'
        } bg-gradient-to-b from-black via-[#0A0A0A] to-black border-r border-[#107C10]/30 shadow-2xl shadow-[#107C10]/10`}
      >
        {/* Logo Section */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-[#107C10]/20 bg-[#107C10]/5">
          {isSidebarOpen ? (
            <Link
              to="/"
              className="flex items-center gap-3 transition-all duration-300"
              aria-label="Ana sayfa"
            >
              <div className="w-11 h-11 flex items-center justify-center bg-gradient-to-br from-[#107C10] to-[#0E6B0E] rounded-xl shadow-lg shadow-[#107C10]/40">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <div className="text-xl font-bold text-white whitespace-nowrap">
                {getInfoValue('TITLE') || 'Xbox'}
              </div>
            </Link>
          ) : (
              <Link
                to="/"
              className="w-full flex items-center justify-center"
              aria-label="Ana sayfa"
            >
              <div className="w-9 h-9 flex items-center justify-center bg-gradient-to-br from-[#107C10] to-[#0E6B0E] rounded-xl shadow-lg shadow-[#107C10]/40">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="w-9 h-9 flex items-center justify-center text-[#107C10] hover:bg-[#107C10]/20 rounded-lg transition-all duration-200 hover:scale-110 border border-[#107C10]/30 flex-shrink-0"
            aria-label={isSidebarOpen ? 'Sidebar\'ı kapat' : 'Sidebar\'ı aç'}
          >
            {isSidebarOpen ? (
              <ChevronLeft className="h-5 w-5" />
            ) : (
              <ChevronRight className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 custom-scrollbar">
          <div className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={(e) => {
                    setHoveredItem(item.path);
                    const rect = e.currentTarget.getBoundingClientRect();
                    tooltipRefs.current[item.path] = { top: rect.top + rect.height / 2, left: 80 };
                  }}
                  onMouseLeave={() => {
                    setHoveredItem(null);
                  }}
                >
              <Link
                    to={item.path}
                    className={`group flex items-center gap-3 rounded-xl transition-all duration-200 relative ${
                      active
                        ? 'bg-gradient-to-r from-[#107C10] to-[#0E6B0E] text-white shadow-lg shadow-[#107C10]/40'
                        : 'text-gray-300 hover:bg-[#107C10]/10 hover:text-[#107C10]'
                    } ${!isSidebarOpen ? 'justify-center px-2 py-2.5' : 'px-3 py-3'}`}
                  >
                    <Icon className={`flex-shrink-0 transition-transform ${active ? 'scale-110' : ''} ${
                      isSidebarOpen ? 'h-5 w-5' : 'h-4 w-4'
                    }`} />
                    {isSidebarOpen && (
                      <span className="font-semibold text-sm transition-all duration-300">
                        {item.label}
                      </span>
                    )}
                    {active && isSidebarOpen && (
                      <div className="absolute right-3 w-2 h-2 bg-white rounded-full opacity-90" />
                    )}
              </Link>
                  {/* Tooltip for collapsed sidebar - Right side */}
                  {!isSidebarOpen && hoveredItem === item.path && tooltipRefs.current[item.path] && (
                    <div
                      className="fixed px-3 py-2 bg-[#1A1A1A] border border-[#107C10]/30 rounded-lg shadow-xl z-[100] whitespace-nowrap pointer-events-none transform -translate-y-1/2"
                      style={{ 
                        top: `${tooltipRefs.current[item.path].top}px`, 
                        left: `${tooltipRefs.current[item.path].left}px` 
                      }}
                    >
                      <span className="text-sm font-medium text-white">{item.label}</span>
                      <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1A1A1A] border-r border-b border-[#107C10]/30 rotate-45" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
            </nav>

        {/* Bottom Actions */}
        <div className="border-t border-[#107C10]/20 p-3 space-y-2 bg-[#0A0A0A]/50">
          {/* Search Button */}
          <div
            id="search-button-container"
            className="relative"
            onMouseEnter={(e) => {
              setHoveredItem('search');
              const rect = e.currentTarget.getBoundingClientRect();
              tooltipRefs.current['search'] = { top: rect.top + rect.height / 2, left: 80 };
            }}
            onMouseLeave={() => {
              setHoveredItem(null);
            }}
          >
            <button
              onClick={onOpenSearch}
              className={`w-full flex items-center gap-3 text-gray-300 hover:bg-[#107C10]/10 hover:text-[#107C10] rounded-xl transition-all duration-200 border border-transparent hover:border-[#107C10]/30 group ${
                isSidebarOpen ? 'px-3 py-3' : 'px-2 py-2.5 justify-center'
              }`}
            >
              <SearchIcon className={`flex-shrink-0 ${isSidebarOpen ? 'h-5 w-5' : 'h-4 w-4'}`} />
              {isSidebarOpen && (
                <span className="font-semibold text-sm">Ara</span>
              )}
            </button>
            {!isSidebarOpen && hoveredItem === 'search' && tooltipRefs.current['search'] && (
              <div
                className="fixed px-3 py-2 bg-[#1A1A1A] border border-[#107C10]/30 rounded-lg shadow-xl z-[100] whitespace-nowrap pointer-events-none transform -translate-y-1/2"
                style={{ 
                  top: `${tooltipRefs.current['search'].top}px`, 
                  left: `${tooltipRefs.current['search'].left}px` 
                }}
              >
                <span className="text-sm font-medium text-white">Ara (Ctrl+K)</span>
                <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1A1A1A] border-r border-b border-[#107C10]/30 rotate-45" />
              </div>
            )}
          </div>

              {isAuthenticated ? (
                <>
                  {/* Cart Button */}
              <div
                className="relative"
                onMouseEnter={(e) => {
                  setHoveredItem('cart');
                  const rect = e.currentTarget.getBoundingClientRect();
                  tooltipRefs.current['cart'] = { top: rect.top + rect.height / 2, left: 80 };
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                }}
              >
                  <Link
                    to="/sepet"
                  className={`relative w-full flex items-center gap-3 text-gray-300 hover:bg-[#107C10]/10 hover:text-[#107C10] rounded-xl transition-all duration-200 border border-transparent hover:border-[#107C10]/30 group ${
                    isSidebarOpen ? 'px-3 py-3' : 'px-2 py-2.5 justify-center'
                  }`}
                  >
                  <ShoppingBag className={`flex-shrink-0 ${isSidebarOpen ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  {isSidebarOpen && (
                    <span className="font-semibold text-sm">Sepet</span>
                  )}
                    {getItemCount() > 0 && (
                    <span className={`absolute flex items-center justify-center min-w-[22px] h-5 px-1.5 text-xs font-bold text-white bg-gradient-to-r from-[#107C10] to-[#0E6B0E] rounded-full shadow-lg shadow-[#107C10]/50 ${
                      isSidebarOpen ? 'right-3' : 'right-1 top-1'
                    }`}>
                        {getItemCount() > 99 ? '99+' : getItemCount()}
                      </span>
                    )}
                  </Link>
                {!isSidebarOpen && hoveredItem === 'cart' && tooltipRefs.current['cart'] && (
                  <div
                    className="fixed px-3 py-2 bg-[#1A1A1A] border border-[#107C10]/30 rounded-lg shadow-xl z-[100] whitespace-nowrap pointer-events-none transform -translate-y-1/2"
                    style={{ 
                      top: `${tooltipRefs.current['cart'].top}px`, 
                      left: `${tooltipRefs.current['cart'].left}px` 
                    }}
                  >
                    <span className="text-sm font-medium text-white">
                      Sepet {getItemCount() > 0 && `(${getItemCount()})`}
                    </span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1A1A1A] border-r border-b border-[#107C10]/30 rotate-45" />
                  </div>
                )}
              </div>

                  {/* User Menu */}
              <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={(e) => {
                  setHoveredItem('user');
                  const rect = e.currentTarget.getBoundingClientRect();
                  tooltipRefs.current['user'] = { top: rect.top + rect.height / 2, left: 80 };
                }}
                onMouseLeave={() => {
                  setHoveredItem(null);
                }}
              >
                    <button
                      onClick={toggleUserMenu}
                  className={`w-full flex items-center gap-3 text-gray-300 hover:bg-[#107C10]/10 hover:text-[#107C10] rounded-xl transition-all duration-200 border border-transparent hover:border-[#107C10]/30 group ${
                    isSidebarOpen ? 'px-3 py-3' : 'px-2 py-2.5 justify-center'
                  }`}
                >
                  <div className={`rounded-full bg-gradient-to-br from-[#107C10] to-[#0E6B0E] flex items-center justify-center flex-shrink-0 shadow-lg shadow-[#107C10]/30 ${
                    isSidebarOpen ? 'w-10 h-10' : 'w-8 h-8'
                  }`}>
                    <UserCircle className={`text-white ${isSidebarOpen ? 'h-5 w-5' : 'h-4 w-4'}`} />
                  </div>
                  {isSidebarOpen && (
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-sm font-semibold truncate">{user?.firstName || 'Kullanıcı'}</div>
                      </div>
                  )}
                  {isSidebarOpen && (
                      <ChevronDown
                      className={`h-4 w-4 transition-all duration-200 flex-shrink-0 ${
                        isUserMenuOpen ? 'rotate-180' : ''
                      }`}
                      />
                  )}
                    </button>
                {!isSidebarOpen && hoveredItem === 'user' && tooltipRefs.current['user'] && (
                  <div
                    className="fixed px-3 py-2 bg-[#1A1A1A] border border-[#107C10]/30 rounded-lg shadow-xl z-[100] whitespace-nowrap pointer-events-none transform -translate-y-1/2"
                    style={{ 
                      top: `${tooltipRefs.current['user'].top}px`, 
                      left: `${tooltipRefs.current['user'].left}px` 
                    }}
                  >
                    <span className="text-sm font-medium text-white">{user?.firstName || 'Kullanıcı'}</span>
                    <div className="absolute right-full top-1/2 -translate-y-1/2 w-2 h-2 bg-[#1A1A1A] border-r border-b border-[#107C10]/30 rotate-45" />
                  </div>
                )}

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                      className={`absolute bg-gradient-to-b from-[#1A1A1A] to-black border border-[#107C10]/40 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 backdrop-blur-xl ${
                        isSidebarOpen
                          ? 'bottom-full left-0 right-0 mb-2'
                          : 'bottom-full left-0 mb-2 w-64'
                      }`}
                          role="menu"
                        >
                      <div className="px-4 py-3 border-b border-[#107C10]/20 bg-[#107C10]/5">
                            <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#107C10] to-[#0E6B0E] flex items-center justify-center shadow-lg shadow-[#107C10]/30">
                            <UserCircle className="h-5 w-5 text-white" />
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
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-[#107C10]/10 rounded-lg transition-colors"
                            >
                              <Settings className="h-4 w-4" />
                              <span>Profil Ayarları</span>
                            </Link>
                            <button
                              onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
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
            <div
              className={`space-y-2 transition-all duration-300 ${
                isSidebarOpen ? 'opacity-100 max-h-96' : 'opacity-0 max-h-0 overflow-hidden'
              }`}
            >
                  <Link
                    to="/giris-yap"
                className="block w-full px-4 py-2.5 text-sm font-semibold text-center text-gray-300 hover:text-white hover:bg-[#107C10]/10 rounded-xl transition-all border border-transparent hover:border-[#107C10]/30"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit-ol"
                className="block w-full px-4 py-2.5 text-sm font-bold text-center text-white bg-gradient-to-r from-[#107C10] to-[#0E6B0E] hover:from-[#14B814] hover:to-[#107C10] rounded-xl transition-all shadow-lg shadow-[#107C10]/30 hover:shadow-[#107C10]/50"
                  >
                    Kayıt Ol
                  </Link>
                </div>
              )}
            </div>
      </aside>

      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-black border-b border-[#107C10]/20" role="banner">
        <div className="relative py-3">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Ana sayfa">
              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-[#107C10] to-[#0E6B0E] rounded-lg shadow-lg shadow-[#107C10]/30">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <div className="text-lg font-bold text-white">
                {getInfoValue('TITLE') || 'Xbox'}
              </div>
            </Link>

            {/* Mobile Actions */}
            <div className="flex items-center gap-2">
              <button
                id="search-button-container-mobile"
                onClick={onOpenSearch}
                className="p-2 text-gray-300 hover:text-[#107C10] transition-colors"
                aria-label="Ara"
              >
                <SearchIcon className="h-5 w-5" />
              </button>

              {isAuthenticated && (
                <Link
                  to="/sepet"
                  className="relative p-2 text-gray-300 hover:text-[#107C10] transition-colors"
                  aria-label="Sepet"
                >
                  <ShoppingBag className="h-5 w-5" />
                  {getItemCount() > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center min-w-[16px] h-4 px-1 text-[10px] font-semibold text-white bg-[#107C10] rounded-full">
                      {getItemCount() > 99 ? '99+' : getItemCount()}
                    </span>
                  )}
                </Link>
              )}

              <button
                onClick={toggleMenu}
                className="p-2 text-gray-300 hover:text-[#107C10] transition-colors"
                aria-label="Menü"
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
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
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          >
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="absolute right-0 top-0 bottom-0 w-80 bg-black border-l border-[#107C10]/20 shadow-xl"
              onClick={(e) => e.stopPropagation()}
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col h-full">
                  <div className="px-4 py-4 border-b border-[#107C10]/20">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">Menü</h2>
                    <button
                      onClick={() => setIsMenuOpen(false)}
                        className="p-2 text-gray-400 hover:text-[#107C10] transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="space-y-1">
                      {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.path);
                        return (
                    <Link
                            key={item.path}
                            to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                              active
                                ? 'text-white bg-[#107C10]'
                                : 'text-gray-300 hover:text-white hover:bg-[#107C10]/10'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                    </Link>
                        );
                      })}
                  </div>

                  {isAuthenticated ? (
                      <div className="mt-6 pt-6 border-t border-[#107C10]/20 space-y-1">
                      <div className="px-4 py-3 mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#107C10] flex items-center justify-center">
                              <UserCircle className="h-5 w-5 text-white" />
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
                          className="block px-4 py-3 text-sm font-medium text-gray-300 hover:text-white hover:bg-[#107C10]/10 rounded-lg transition-colors"
                      >
                        Profil Ayarları
                      </Link>
                      <button
                        onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                      >
                        Çıkış Yap
                      </button>
                    </div>
                  ) : (
                      <div className="mt-6 pt-6 border-t border-[#107C10]/20 space-y-2">
                      <Link
                        to="/giris-yap"
                        onClick={() => setIsMenuOpen(false)}
                          className="block w-full px-4 py-3 text-sm font-medium text-center text-gray-300 hover:text-white hover:bg-[#107C10]/10 rounded-lg transition-colors"
                      >
                        Giriş Yap
                      </Link>
                      <Link
                        to="/kayit-ol"
                        onClick={() => setIsMenuOpen(false)}
                          className="block w-full px-4 py-3 text-sm font-semibold text-center text-white bg-[#107C10] hover:bg-[#0E6B0E] rounded-lg transition-colors"
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
    </>
  );
};

export default Header;
