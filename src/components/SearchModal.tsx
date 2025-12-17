import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Gamepad2, ShoppingCart, Loader2, ArrowRight, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategories, getCategoryProducts } from '../services/api';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  slug: string;
  url?: string;
  isPopular?: boolean;
  rating?: number;
  people?: number;
  category?: {
    name: string;
    slug?: string;
  };
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  homepageItems: HomepageItem[];
}

const useDebouncedCallback = (fn: (...args: any[]) => void, delay = 300) => {
  const timeout = useRef<number | null>(null);
  return useCallback(
    (...args: any[]) => {
      if (timeout.current) window.clearTimeout(timeout.current);
      timeout.current = window.setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
};

const highlight = (text: string, query: string) => {
  if (!query) return text;
  const q = query.trim();
  try {
    const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'));
    return parts.map((part, i) =>
      part.toLowerCase() === q.toLowerCase() ? (
        <mark key={i} className="bg-orange-500/40 text-orange-200 rounded px-0.5 font-semibold">{part}</mark>
      ) : (
        <span key={i}>{part}</span>
      )
    );
  } catch {
    return text;
  }
};

const SearchModal = ({ isOpen, onClose, homepageItems }: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<HomepageItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [allItems, setAllItems] = useState<HomepageItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (!isOpen) return;
    setTimeout(() => searchInputRef.current?.focus(), 100);
    loadAllItems();
  }, [isOpen]);

  const loadAllItems = async () => {
    setIsLoadingItems(true);
    setError(null);
    try {
      const categoriesResponse = await getCategories();
      const categories = categoriesResponse.data || [];
      const allProductsPromises = categories.map(async (category: any) => {
        try {
          const productsResponse = await getCategoryProducts(category.slug);
          const products = productsResponse.data || [];
          return products.map((product: any) => ({
            ...product,
            category: { name: category.name, slug: category.slug },
          }));
        } catch (e) {
          console.error(`Kategori ${category.name} ürünleri yüklenirken hata:`, e);
          return [];
        }
      });
      const allProductsArrays = await Promise.all(allProductsPromises);
      const flattened = allProductsArrays.flat();
      setAllItems(flattened);
    } catch (e) {
      console.error('Ürünler yüklenirken hata:', e);
      setError('Ürünler yüklenirken bir sorun oluştu. Anasayfa verileri gösteriliyor.');
      setAllItems(homepageItems);
    } finally {
      setIsLoadingItems(false);
    }
  };

  const itemsToSearch = useMemo(() => (allItems.length ? allItems : homepageItems), [allItems, homepageItems]);

  const runSearch = useCallback(
    (query: string) => {
      const q = query.toLowerCase().trim();
      if (!q) {
        setSearchResults([]);
        setActiveIndex(0);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);

      const filtered = itemsToSearch.filter((item) => {
        const name = item.name?.toLowerCase() || '';
        const cat = item.category?.name?.toLowerCase() || '';
        if (name.includes(q) || cat.includes(q)) return true;
        const qWords = q.split(' ').filter(Boolean);
        const nameWords = name.split(' ');
        const catWords = cat.split(' ');
        return qWords.some((w) => nameWords.some((nw) => nw.includes(w)) || catWords.some((cw) => cw.includes(w)));
      });

      const sorted = filtered.sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        if (aName === q && bName !== q) return -1;
        if (bName === q && aName !== q) return 1;
        if (aName.startsWith(q) && !bName.startsWith(q)) return -1;
        if (bName.startsWith(q) && !aName.startsWith(q)) return 1;
        if (aName.includes(q) && !bName.includes(q)) return -1;
        if (bName.includes(q) && !aName.includes(q)) return 1;
        return aName.localeCompare(bName);
      });

      setSearchResults(sorted);
      setActiveIndex(0);
      setIsSearching(false);
    },
    [itemsToSearch]
  );

  const debouncedSearch = useDebouncedCallback(runSearch, 250);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const formatPrice = (price: number | string) => {
    if (typeof price === 'string') return price;
    try {
      return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(price);
    } catch {
      return `${price} ₺`;
    }
  };

  const handleClose = () => {
    setSearchQuery('');
    setSearchResults([]);
    setAllItems([]);
    setIsLoadingItems(false);
    setActiveIndex(0);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
      if (!searchResults.length) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, searchResults.length - 1));
        const elements = listRef.current?.querySelectorAll('[data-row]');
        elements?.[Math.min(activeIndex + 1, searchResults.length - 1)]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        const elements = listRef.current?.querySelectorAll('[data-row]');
        elements?.[Math.max(activeIndex - 1, 0)]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
      if (e.key === 'Enter') {
        const target = searchResults[activeIndex];
        if (target) {
          const el = document.getElementById(`search-link-${target.id}`);
          (el as HTMLAnchorElement)?.click();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, searchResults, activeIndex]);

  // Arama butonunun pozisyonunu bul
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    
    // Body scroll'unu engelle
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    const updatePosition = () => {
      // Desktop için
      const desktopButton = document.getElementById('search-button-container');
      // Mobile için
      const mobileButton = document.getElementById('search-button-container-mobile');
      
      const button = desktopButton || mobileButton;
      if (button) {
        const rect = button.getBoundingClientRect();
        const isMobile = window.innerWidth < 768;
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 16;
        
        let left = isMobile ? padding : rect.left;
        let width = isMobile ? viewportWidth - (padding * 2) : Math.max(rect.width, 500);
        
        // Sağ taraftan taşmaması için kontrol
        if (left + width > viewportWidth - padding) {
          left = viewportWidth - width - padding;
          // Eğer hala taşıyorsa, genişliği ayarla
          if (left < padding) {
            left = padding;
            width = viewportWidth - (padding * 2);
          }
        }
        
        // Header'ın altında kalmasını garanti et
        let top = rect.bottom + 8;
        const header = document.querySelector('header');
        if (header) {
          const headerRect = header.getBoundingClientRect();
          const headerBottom = headerRect.bottom;
          // Eğer buton header'ın içindeyse, header'ın altına yerleştir
          if (rect.top < headerBottom) {
            top = headerBottom + 8;
          }
        }
        
        // Viewport'tan taşmaması için kontrol
        const maxHeight = viewportHeight - top - padding;
        if (maxHeight < 200) {
          top = Math.max(padding, viewportHeight - 400 - padding);
        }
        
        setPosition({
          top: top,
          left: left,
          width: width,
        });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Dış tıklamada kapat
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        const button = document.getElementById('search-button-container') || 
                      document.getElementById('search-button-container-mobile');
        if (button && !button.contains(e.target as Node)) {
          handleClose();
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed z-[9999] sm:max-w-[calc(100vw-32px)]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              maxWidth: 'calc(100vw - 16px)',
            }}
          >
            {/* Main Container */}
            <div
              className="rounded-xl overflow-hidden border shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.98) 0%, rgba(17, 24, 39, 0.98) 100%)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Search Input Bar */}
              <div className="relative px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-b" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="flex-shrink-0">
                    <div
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.15))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <Search className="h-4 w-4 sm:h-5 sm:w-5 text-orange-300" />
                    </div>
                  </div>
                  
                  <div className="flex-1 relative min-w-0">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Oyun ara..."
                      className="w-full bg-transparent text-white placeholder-gray-400 text-sm sm:text-base md:text-lg font-semibold focus:outline-none"
                      style={{ caretColor: 'rgba(249, 115, 22, 1)' }}
                      aria-autocomplete="list"
                      aria-controls="search-results"
                      aria-expanded={!!searchQuery}
                    />
                    {isSearching && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-orange-400" />
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{
                      background: 'rgba(75, 85, 99, 0.2)',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                    }}
                  >
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                  </motion.button>
                </div>
                {error && (
                  <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs text-orange-300/80 px-1 sm:px-2">{error}</p>
                )}
              </div>

              {/* Results Container */}
              <div
                ref={listRef}
                id="search-results"
                className="max-h-[60vh] sm:max-h-[65vh] md:max-h-[70vh] overflow-y-auto gaming-scrollbar"
                style={{
                  background: 'rgba(0, 0, 0, 0.2)',
                }}
              >
                {isLoadingItems ? (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-orange-500/30 border-t-orange-500 mb-3 sm:mb-4"
                    />
                    <h3 className="text-sm sm:text-base font-bold text-white mb-1">Ürünler Yükleniyor</h3>
                    <p className="text-xs sm:text-sm text-gray-400 px-4 text-center">Kategorilerden ürünler getiriliyor...</p>
                  </div>
                ) : searchQuery ? (
                  isSearching ? (
                    <div className="flex items-center justify-center py-12 sm:py-16">
                      <div className="flex items-center gap-2 sm:gap-3 text-gray-300">
                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-orange-400" />
                        <span className="text-xs sm:text-sm">Aranıyor...</span>
                      </div>
                    </div>
                  ) : searchResults.length ? (
                    <div className="p-1.5 sm:p-2">
                      {/* Results Count */}
                      <div className="px-3 sm:px-4 py-1.5 sm:py-2 mb-1.5 sm:mb-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full"
                            style={{
                              background: 'rgba(249, 115, 22, 0.15)',
                              border: '1px solid rgba(249, 115, 22, 0.3)',
                              color: 'rgba(249, 115, 22, 0.95)',
                            }}
                          >
                            {searchResults.length} Sonuç
                          </span>
                        </div>
                      </div>

                      {/* Results List */}
                      <div className="space-y-0.5 sm:space-y-1">
                        {searchResults.map((item, index) => (
                          <motion.div
                            key={item.id}
                            data-row
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.02 }}
                          >
                            <Link
                              id={`search-link-${item.id}`}
                              to={`/epin/${item.slug}`}
                              onClick={handleClose}
                              className="block"
                            >
                              <motion.div
                                className={`relative flex items-center gap-2 sm:gap-3 md:gap-4 px-2.5 sm:px-3 md:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl transition-all duration-200 ${
                                  activeIndex === index
                                    ? 'bg-gradient-to-r from-orange-500/20 to-orange-600/10'
                                    : 'hover:bg-white/5'
                                }`}
                                style={{
                                  border: activeIndex === index
                                    ? '1px solid rgba(249, 115, 22, 0.4)'
                                    : '1px solid transparent',
                                  boxShadow: activeIndex === index
                                    ? '0 4px 12px rgba(249, 115, 22, 0.15)'
                                    : 'none',
                                }}
                                whileHover={{ x: 2 }}
                              >
                                {/* Image/Icon */}
                                <div className="flex-shrink-0">
                                  <div
                                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl overflow-hidden border flex items-center justify-center"
                                    style={{
                                      background: 'rgba(249, 115, 22, 0.1)',
                                      border: '1px solid rgba(249, 115, 22, 0.25)',
                                    }}
                                  >
                                    {item.url ? (
                                      <img
                                        src={item.url}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                          const target = e.currentTarget as HTMLImageElement;
                                          target.style.display = 'none';
                                          const sib = target.nextElementSibling as HTMLElement;
                                          if (sib) sib.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div
                                      className="absolute inset-0 hidden items-center justify-center"
                                      style={{ display: item.url ? ('none' as any) : 'flex' }}
                                    >
                                      <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-orange-300/60" />
                                    </div>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-bold text-xs sm:text-sm mb-0.5 sm:mb-1 truncate">
                                    {highlight(item.name, searchQuery)}
                                  </h3>
                                  {item.category?.name && (
                                    <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                                      <Tag className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-400/60" />
                                      <span className="text-[10px] sm:text-xs text-gray-400 truncate">
                                        {highlight(item.category.name, searchQuery)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                                    <span
                                      className="text-xs sm:text-sm font-bold px-2 sm:px-2.5 py-0.5 rounded-md sm:rounded-lg"
                                      style={{
                                        background: 'rgba(249, 115, 22, 0.2)',
                                        color: 'rgba(251, 146, 60, 1)',
                                      }}
                                    >
                                      {formatPrice(item.price)}
                                    </span>
                                    {item.originalPrice && (
                                      <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                                        {formatPrice(item.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Arrow Icon */}
                                <div className="flex-shrink-0">
                                  <div
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-md sm:rounded-lg flex items-center justify-center"
                                    style={{
                                      background: activeIndex === index
                                        ? 'rgba(249, 115, 22, 0.2)'
                                        : 'rgba(75, 85, 99, 0.2)',
                                    }}
                                  >
                                    <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-300" />
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center px-4 sm:px-6">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-4"
                        style={{
                          background: 'rgba(249, 115, 22, 0.1)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <Search className="h-8 w-8 sm:h-10 sm:w-10 text-orange-300/60" />
                      </motion.div>
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1.5 sm:mb-2">Sonuç Bulunamadı</h3>
                      <p className="text-xs sm:text-sm text-gray-400 max-w-md px-2">
                        "{searchQuery}" için sonuç bulunamadı. Farklı bir arama terimi deneyin.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center px-4 sm:px-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-6"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(249, 115, 22, 0.1))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <Search className="h-10 w-10 sm:h-12 sm:w-12 text-orange-300/70" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3"
                    >
                      <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                        Oyun Ara
                      </span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-xs sm:text-sm text-gray-400 max-w-md px-2"
                    >
                      Oyun adı veya kategori yazarak arama yapabilirsiniz.
                    </motion.p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
