import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getHomepageItems } from '../services/api';
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  slug: string;
  url?: string;
  rating?: number;
}

const SplitScreenSection = () => {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getHomepageItems(6);
        setItems(response.data || []);
      } catch (error) {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [items.length]);

  if (isLoading || items.length === 0) return null;

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % items.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + items.length) % items.length);

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
            <Zap className="h-5 w-5 text-[#107C10]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Özel Gösterim</h3>
            <p className="text-gray-400 text-sm">Seçkin oyunlarımızı keşfedin</p>
          </div>
        </div>
      </div>

      <div className="relative w-full h-[600px] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
        {/* Left: Image Side */}
        <div className="relative overflow-hidden bg-[#0a0a0a]">
          <AnimatePresence mode="wait">
            {items.map((item, index) => {
              if (index !== activeIndex) return null;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 100 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-9xl">🎮</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Right: Content Side */}
        <div className="relative bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center p-12">
          <AnimatePresence mode="wait">
            {items.map((item, index) => {
              if (index !== activeIndex) return null;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-md space-y-6"
                >
                  <div>
                    <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                      {item.name}
                    </h2>
                    <p className="text-gray-300 text-lg">
                      Özel fırsatlar ve benzersiz deneyimler seni bekliyor.
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-gray-400 text-sm mb-1">Fiyat</div>
                      <div className="text-[#107C10] font-bold text-3xl">
                        {typeof item.price === 'string' ? item.price : `${item.price}₺`}
                      </div>
                    </div>
                  </div>

                  <Link
                    to={`/epin/${item.slug}`}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-[#107C10] hover:bg-[#14B814] rounded-lg text-white font-semibold text-lg transition-all group"
                  >
                    Detayları Gör
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Navigation */}
          <div className="absolute bottom-8 right-8 flex gap-3">
            <button
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm border border-[#333333] hover:border-[#107C10] rounded-lg transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center bg-black/50 backdrop-blur-sm border border-[#333333] hover:border-[#107C10] rounded-lg transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === activeIndex ? 'bg-[#107C10] w-8' : 'bg-[#333333]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SplitScreenSection;

