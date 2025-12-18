import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Gamepad2, Star, Users, TrendingUp, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { getHomepageItems } from '../services/api';

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
  categoryName?: string;
}

const PopularProductsSection = () => {
  const [homepageItems, setHomepageItems] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const loadPopularProducts = async () => {
    setIsLoading(true);
    try {
      const response = await getHomepageItems(20);
      setHomepageItems(response.data || []);
    } catch (error) {
      console.error('Popüler ürünler yüklenirken hata:', error);
      setHomepageItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPopularProducts();
  }, []);

  const displayItems = homepageItems.slice(0, 12);
  const itemsPerView = 4; // Desktop'ta 4 kart görünecek
  const maxIndex = Math.max(0, displayItems.length - itemsPerView);

  const goToSlide = (index: number) => {
    if (index >= 0 && index <= maxIndex) {
      setCurrentIndex(index);
    }
  };

  const nextSlide = () => {
    goToSlide(currentIndex >= maxIndex ? 0 : currentIndex + 1);
  };

  const prevSlide = () => {
    goToSlide(currentIndex <= 0 ? maxIndex : currentIndex - 1);
  };

  // Auto-play
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 4000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, maxIndex]);

  if (isLoading || homepageItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent animate-spin" />
            <span className="text-white text-sm">Oyunlar Yükleniyor...</span>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1A1A1A] border border-[#107C10]/30 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-[#107C10]/60" />
            </div>
            <span className="text-gray-400 text-sm">Henüz popüler oyun bulunmuyor</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col relative z-10">
        {/* Header with Navigation */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
              <TrendingUp className="h-5 w-5 text-[#107C10]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Popüler Oyunlar</h3>
              <p className="text-gray-400 text-sm">En çok tercih edilen oyunlar</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2">
            <motion.button
              onClick={prevSlide}
              className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10] transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-5 w-5 text-white" />
            </motion.button>
            <motion.button
              onClick={nextSlide}
              className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10] transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="h-5 w-5 text-white" />
            </motion.button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative overflow-hidden">
          <div
            ref={containerRef}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {displayItems.map((item, index) => (
              <div
                key={item.id}
                className="flex-shrink-0 px-3"
                style={{
                  width: `${100 / itemsPerView}%`,
                }}
              >
                <ProductCard item={item} index={index} currentIndex={currentIndex} />
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-8 h-1 bg-[#1A1A1A] overflow-hidden">
            <motion.div
              className="h-full bg-[#107C10]"
              initial={{ width: 0 }}
              animate={{
                width: `${((currentIndex + itemsPerView) / displayItems.length) * 100}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className="relative"
              >
                <div className="w-2 h-2 rounded-full bg-[#333333] transition-all duration-300" />
                {index === currentIndex && (
                  <motion.div
                    className="absolute inset-0 w-2 h-2 rounded-full bg-[#107C10]"
                    layoutId="activeDot"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ 
  item, 
  index,
  currentIndex 
}: { 
  item: HomepageItem; 
  index: number;
  currentIndex: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const isVisible = index >= currentIndex && index < currentIndex + 4;
  const isActive = index === currentIndex || index === currentIndex + 1 || index === currentIndex + 2;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, delay: (index - currentIndex) * 0.1 }}
        >
          <Link
            to={`/epin/${item.slug}`}
            className="block group h-full"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="relative overflow-hidden h-full flex flex-col bg-[#1A1A1A] border border-[#107C10]/20 transition-all duration-300 hover:border-[#107C10] hover:shadow-lg hover:shadow-[#107C10]/20"
              style={{
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                transform: isActive && isHovered ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
              }}
            >
              {/* Corner Accents */}
              <div className="absolute top-0 left-0 w-16 h-16 z-10 pointer-events-none">
                <div 
                  className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#107C10]/60" 
                  style={{ clipPath: 'polygon(0 0, 16px 0, 0 16px)' }} 
                />
              </div>
              <div className="absolute top-0 right-0 w-16 h-16 z-10 pointer-events-none">
                <div 
                  className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#107C10]/60" 
                  style={{ clipPath: 'polygon(calc(100% - 16px) 0, 100% 0, 100% 16px)' }} 
                />
              </div>
              <div className="absolute bottom-0 left-0 w-16 h-16 z-10 pointer-events-none">
                <div 
                  className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-[#107C10]/60" 
                  style={{ clipPath: 'polygon(0 calc(100% - 16px), 0 100%, 16px 100%)' }} 
                />
              </div>
              <div className="absolute bottom-0 right-0 w-16 h-16 z-10 pointer-events-none">
                <div 
                  className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#107C10]/60" 
                  style={{ clipPath: 'polygon(calc(100% - 16px) 100%, 100% 100%, 100% calc(100% - 16px))' }} 
                />
              </div>

              {/* Two Diagonal Green Stripes at Bottom Right */}
              <div 
                className="absolute bottom-0 right-0 h-1.5 bg-[#107C10] z-10"
                style={{
                  width: '60%',
                  transform: 'skewY(-3deg)',
                  transformOrigin: 'bottom right',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 85%)',
                }}
              />
              <div 
                className="absolute bottom-0 right-0 h-1.5 bg-[#14B814] z-10"
                style={{
                  width: '40%',
                  transform: 'skewY(-5deg) translateY(-2px)',
                  transformOrigin: 'bottom right',
                  clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 80%)',
                }}
              />
              
              {/* Image Section */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#107C10]/10 to-black">
                {item.url && !imageError ? (
                  <img
                    src={item.url}
                    alt={item.name}
                    className={`w-full h-full object-cover transition-transform duration-300 ${
                      isHovered ? 'scale-110' : 'scale-100'
                    }`}
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
                    <Gamepad2 className="h-16 w-16 text-[#107C10]/60" />
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Rating Badge */}
                {typeof item.rating === 'number' && (
                  <div className="absolute top-3 left-3 px-2.5 py-1.5 flex items-center gap-1.5 bg-[#107C10]/90 backdrop-blur-sm border border-[#107C10] rounded-lg z-20">
                    <Star className="h-3.5 w-3.5 text-white fill-white" />
                    <span className="text-white text-xs font-semibold">{item.rating}</span>
                  </div>
                )}

                {/* Popular Badge */}
                {item.isPopular && (
                  <div className="absolute top-3 right-3 px-2.5 py-1.5 flex items-center gap-1.5 bg-[#107C10] border border-[#107C10] rounded-lg z-20">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                    <span className="text-white text-xs font-semibold">TREND</span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-[#1A1A1A] to-black">
                {/* Category & Users */}
                <div className="flex items-center justify-between mb-3">
                  {item.categoryName && (
                    <span className="text-xs font-medium px-2.5 py-1 bg-[#107C10]/20 border border-[#107C10]/30 text-[#107C10] rounded">
                      {item.categoryName}
                    </span>
                  )}
                  {item.people !== undefined && item.people > 0 && (
                    <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
                      <Users className="h-3.5 w-3.5" />
                      <span>{item.people.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Title */}
                <h3
                  className="text-white font-semibold text-base mb-auto line-clamp-2 leading-snug transition-colors duration-300"
                  style={{ color: isHovered ? '#107C10' : '#ffffff' }}
                >
                  {item.name}
                </h3>

                {/* Price Section */}
                <div className="mt-4 pt-4 border-t border-[#107C10]/20">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {item.originalPrice && (
                        <span className="text-gray-500 text-xs line-through mb-0.5">
                          {typeof item.originalPrice === 'string'
                            ? item.originalPrice
                            : `${item.originalPrice}₺`}
                        </span>
                      )}
                      <span className="text-[#107C10] font-bold text-lg">
                        {typeof item.price === 'string' ? item.price : `${item.price}₺`}
                      </span>
                    </div>

                    <div className="w-10 h-10 flex items-center justify-center bg-[#107C10]/20 border border-[#107C10] hover:bg-[#107C10] transition-all duration-300 rounded-lg group-hover:scale-110">
                      <ArrowRight className="h-5 w-5 text-[#107C10] group-hover:text-white transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Glow Effect */}
              {isHovered && (
                <div className="absolute inset-0 border-2 border-[#107C10] pointer-events-none opacity-50" 
                  style={{
                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                  }} 
                />
              )}
            </div>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PopularProductsSection;
