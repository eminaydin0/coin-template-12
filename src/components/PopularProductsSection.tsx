import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight, Gamepad2, Star, Users, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
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
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'start', 
      dragFree: false,
      slidesToScroll: 1
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  );
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

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

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setSelectedIndex(emblaApi.selectedScrollSnap());
    };

    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi]);

  const scrollPrev = () => emblaApi?.scrollPrev();
  const scrollNext = () => emblaApi?.scrollNext();
  const scrollTo = (index: number) => emblaApi?.scrollTo(index);

  if (isLoading || homepageItems.length === 0) {
    return (
      <div className="flex items-center justify-center py-16">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent animate-spin" />
            <span className="text-white text-sm">
              Oyunlar Yükleniyor...
            </span>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center mx-auto mb-4">
              <Gamepad2 className="w-8 h-8 text-[#107C10]/60" />
            </div>
            <span className="text-gray-400 text-sm">
              Henüz popüler oyun bulunmuyor
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
                <TrendingUp className="h-5 w-5 text-[#107C10]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">
                  Popüler Oyunlar
                </h3>
                <p className="text-gray-400 text-sm">
                  En çok tercih edilen oyunlar
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex gap-4">
              {homepageItems.slice(0, 12).map((item, index) => (
                <div
                  key={item.id}
                  className="min-w-[240px] sm:min-w-[280px] flex-shrink-0"
                >
                  <ProductCard item={item} />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {homepageItems.length > 0 && (
            <>
              <button
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10]"
              >
                <ChevronLeft className="w-5 h-5 text-white" />
              </button>

              <button
                onClick={scrollNext}
                disabled={!canScrollNext}
                className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 flex items-center justify-center transition-all duration-200 disabled:opacity-0 disabled:pointer-events-none bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10]"
              >
                <ChevronRight className="w-5 h-5 text-white" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ item }: { item: HomepageItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/epin/${item.slug}`}
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden h-full flex flex-col bg-[#1A1A1A] border border-[#333333] transition-all duration-200 hover:border-[#107C10]"
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {item.url && !imageError ? (
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-[#107C10]/60" />
            </div>
          )}

          {/* Rating Badge */}
          {typeof item.rating === 'number' && (
            <div className="absolute top-3 left-3 px-2 py-1 flex items-center gap-1 bg-[#1A1A1A] border border-[#333333]">
              <Star className="h-3.5 w-3.5 text-[#107C10] fill-[#107C10]" />
              <span className="text-white text-xs font-semibold">{item.rating}</span>
            </div>
          )}

          {/* Popular Badge */}
          {item.isPopular && (
            <div className="absolute top-3 right-3 px-2 py-1 flex items-center gap-1 bg-[#107C10]">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
              <span className="text-white text-xs font-semibold">TREND</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category & Users */}
          <div className="flex items-center justify-between mb-3">
            {item.categoryName && (
              <span className="text-xs font-medium px-2 py-1 bg-[#1A1A1A] border border-[#333333] text-[#107C10]">
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
          <h3 className="text-white font-semibold text-sm mb-auto line-clamp-2 leading-snug transition-colors duration-200"
              style={{ color: isHovered ? '#107C10' : '#ffffff' }}>
            {item.name}
          </h3>

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t border-[#333333]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {item.originalPrice && (
                  <span className="text-gray-500 text-xs line-through mb-0.5">
                    {typeof item.originalPrice === 'string' 
                      ? item.originalPrice 
                      : `${item.originalPrice}₺`}
                  </span>
                )}
                <span className="text-[#107C10] font-semibold text-base">
                  {typeof item.price === 'string' ? item.price : `${item.price}₺`}
                </span>
              </div>
              
              <div className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10] transition-colors">
                <ArrowRight className="h-4 w-4 text-[#107C10]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PopularProductsSection;
