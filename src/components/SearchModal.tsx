import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Gamepad2, ArrowRight, Tag } from 'lucide-react';
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
        <mark key={i} className="bg-[#107C10]/40 text-[#14B814] rounded px-0.5 font-semibold">{part}</mark>
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

  // Modal pozisyonu - merkeze yerleştir
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (!isOpen) return;
    
    // Body scroll'unu engelle
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    
    const updatePosition = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 16;
      const maxWidth = 700;
      
      // Merkeze yerleştir
      const width = Math.min(maxWidth, viewportWidth - (padding * 2));
      const left = (viewportWidth - width) / 2;
      const top = Math.max(padding, viewportHeight * 0.15);
      
      setPosition({
        top: top,
        left: left,
        width: width,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  // Dış tıklamada kapat
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const searchButton = document.getElementById('search-button-container') || 
                          document.getElementById('search-button-container-mobile');
      // Eğer backdrop'a tıklandıysa veya search butonu dışında bir yere tıklandıysa kapat
      if (target.classList.contains('search-modal-backdrop') || 
          (searchButton && !searchButton.contains(target) && !target.closest('.search-modal-content'))) {
        handleClose();
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
            className="search-modal-backdrop fixed inset-0 z-[9998] bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.2 }}
            className="search-modal-content fixed z-[9999]"
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              width: `${position.width}px`,
              maxWidth: 'calc(100vw - 32px)',
            }}
          >
            {/* Main Container */}
            <div className="rounded-2xl overflow-hidden border shadow-2xl bg-gradient-to-b from-[#0A0A0A] via-[#111118] to-[#0A0A0A] border-[#107C10]/30 backdrop-blur-xl">
              {/* Search Input Bar */}
              <div className="relative px-4 py-4 border-b border-[#107C10]/20 bg-[#107C10]/5">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#107C10] to-[#0E6B0E] shadow-lg shadow-[#107C10]/30">
                      <Search className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 relative min-w-0">
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchInputChange}
                      placeholder="Oyun ara..."
                      className="w-full bg-transparent text-white placeholder-gray-400 text-base font-semibold focus:outline-none"
                      style={{ caretColor: '#107C10' }}
                      aria-autocomplete="list"
                      aria-controls="search-results"
                      aria-expanded={!!searchQuery}
                    />
                    {isSearching && (
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-[#107C10]/30 border-t-[#107C10] rounded-full animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <motion.button
                    onClick={handleClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#1A1A1A] border border-[#107C10]/20 hover:border-[#107C10]/40 transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-white" />
                  </motion.button>
                </div>
                {error && (
                  <p className="mt-3 text-xs text-[#14B814]/80 px-2">{error}</p>
                )}
              </div>

              {/* Results Container */}
              <div
                ref={listRef}
                id="search-results"
                className="max-h-[60vh] overflow-y-auto custom-scrollbar bg-[#0A0A0A]"
              >
                {isLoadingItems ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <div className="w-12 h-12 border-2 border-[#107C10]/30 border-t-[#107C10] rounded-full animate-spin mb-4" />
                    <h3 className="text-base font-bold text-white mb-1">Ürünler Yükleniyor</h3>
                    <p className="text-sm text-gray-400 px-4 text-center">Kategorilerden ürünler getiriliyor...</p>
                  </div>
                ) : searchQuery ? (
                  isSearching ? (
                    <div className="flex items-center justify-center py-16">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-5 h-5 border-2 border-[#107C10]/30 border-t-[#107C10] rounded-full animate-spin" />
                        <span className="text-sm">Aranıyor...</span>
                      </div>
                    </div>
                  ) : searchResults.length ? (
                    <div className="p-2">
                      {/* Results Count */}
                      <div className="px-4 py-2 mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#107C10]/20 border border-[#107C10]/30 text-[#14B814]">
                            {searchResults.length} Sonuç
                          </span>
                        </div>
                      </div>

                      {/* Results List */}
                      <div className="space-y-1">
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
                                className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                                  activeIndex === index
                                    ? 'bg-gradient-to-r from-[#107C10]/20 to-[#0E6B0E]/10 border border-[#107C10]/40'
                                    : 'hover:bg-[#107C10]/10 border border-transparent'
                                }`}
                                style={{
                                  boxShadow: activeIndex === index
                                    ? '0 4px 12px rgba(16, 124, 16, 0.2)'
                                    : 'none',
                                }}
                                whileHover={{ x: 2 }}
                              >
                                {/* Image/Icon */}
                                <div className="flex-shrink-0">
                                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#107C10]/20 bg-[#107C10]/10 flex items-center justify-center">
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
                                      <Gamepad2 className="h-6 w-6 text-[#107C10]/60" />
                                    </div>
                                  </div>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <h3 className="text-white font-bold text-sm mb-1 truncate">
                                    {highlight(item.name, searchQuery)}
                                  </h3>
                                  {item.category?.name && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <Tag className="h-3 w-3 text-[#107C10]/60" />
                                      <span className="text-xs text-gray-400 truncate">
                                        {highlight(item.category.name, searchQuery)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold px-2.5 py-0.5 rounded-lg bg-[#107C10]/20 text-[#14B814]">
                                      {formatPrice(item.price)}
                                    </span>
                                    {item.originalPrice && (
                                      <span className="text-xs text-gray-500 line-through">
                                        {formatPrice(item.originalPrice)}
                                      </span>
                                    )}
                                  </div>
                                </div>

                                {/* Arrow Icon */}
                                <div className="flex-shrink-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                    activeIndex === index
                                      ? 'bg-[#107C10]/20'
                                      : 'bg-[#1A1A1A]'
                                  }`}>
                                    <ArrowRight className="h-4 w-4 text-[#107C10]" />
                                  </div>
                                </div>
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 bg-[#107C10]/10 border border-[#107C10]/30"
                      >
                        <Search className="h-10 w-10 text-[#107C10]/60" />
                      </motion.div>
                      <h3 className="text-xl font-bold text-white mb-2">Sonuç Bulunamadı</h3>
                      <p className="text-sm text-gray-400 max-w-md px-2">
                        "{searchQuery}" için sonuç bulunamadı. Farklı bir arama terimi deneyin.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 }}
                      className="w-24 h-24 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br from-[#107C10]/15 to-[#0E6B0E]/10 border border-[#107C10]/30"
                    >
                      <Search className="h-12 w-12 text-[#107C10]/70" />
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-2xl font-bold text-white mb-3"
                    >
                      <span className="bg-gradient-to-r from-[#107C10] to-[#14B814] bg-clip-text text-transparent">
                        Oyun Ara
                      </span>
                    </motion.h3>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-sm text-gray-400 max-w-md px-2"
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
