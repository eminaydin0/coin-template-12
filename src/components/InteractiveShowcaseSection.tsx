import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { getHomepageItems } from '../services/api';
import { ArrowRight, Play, Pause, Sparkles } from 'lucide-react';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  slug: string;
  url?: string;
  rating?: number;
}

const InteractiveShowcaseSection = () => {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 200 };
  const x = useSpring(useTransform(mouseX, (v) => v / 20), springConfig);
  const y = useSpring(useTransform(mouseY, (v) => v / 20), springConfig);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getHomepageItems(8);
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
    if (!isPlaying || items.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % items.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isPlaying, items.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  if (isLoading || items.length === 0) return null;

  const activeItem = items[activeIndex];

  return (
    <div className="relative w-full">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
            <Sparkles className="h-5 w-5 text-[#107C10]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">Öne Çıkan Oyunlar</h3>
            <p className="text-gray-400 text-sm">Seçkin oyun koleksiyonumuz</p>
          </div>
        </div>
      </div>

      <div 
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
        className="relative w-full h-[600px] overflow-hidden bg-gradient-to-br from-[#0a0a0a] via-[#1a1a1a] to-black rounded-lg border border-[#333333]"
      >
      {/* Parallax Background Layers */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        style={{ x, y, scale: 1.1 }}
      >
        {activeItem.url && (
          <img 
            src={activeItem.url} 
            alt={activeItem.name}
            className="w-full h-full object-cover blur-3xl"
          />
        )}
      </motion.div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Active Item Showcase */}
          <motion.div
            key={activeItem.id}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-[#107C10]/50 bg-[#1a1a1a]">
              {activeItem.url ? (
                <img 
                  src={activeItem.url} 
                  alt={activeItem.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-6xl">🎮</div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              {/* Floating Price Badge */}
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="absolute top-6 right-6 px-4 py-2 bg-[#107C10] rounded-lg"
              >
                <span className="text-white font-bold text-xl">
                  {typeof activeItem.price === 'string' ? activeItem.price : `${activeItem.price}₺`}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Info & Navigation */}
          <div className="space-y-6">
            <motion.div
              key={`info-${activeItem.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-5xl font-bold text-white mb-4 leading-tight">
                {activeItem.name}
              </h2>
              <p className="text-gray-300 text-lg mb-6">
                Keşfetmeye hazır mısın? Bu oyun seni bekliyor!
              </p>
              
              <Link
                to={`/epin/${activeItem.slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#107C10] hover:bg-[#14B814] rounded-lg text-white font-semibold text-lg transition-all group"
              >
                Hemen İncele
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Item Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveIndex(index);
                    setIsPlaying(false);
                    setTimeout(() => setIsPlaying(true), 100);
                  }}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    index === activeIndex 
                      ? 'border-[#107C10] scale-110' 
                      : 'border-transparent opacity-50 hover:opacity-75'
                  }`}
                >
                  {item.url ? (
                    <img 
                      src={item.url} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
                      <span className="text-2xl">🎮</span>
                    </div>
                  )}
                  {index === activeIndex && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 border-2 border-[#107C10] rounded-lg"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Play/Pause Control */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span className="text-sm">Duraklat</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Devam Et</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a1a1a]">
        <motion.div
          className="h-full bg-[#107C10]"
          initial={{ width: 0 }}
          animate={{ width: isPlaying ? '100%' : '0%' }}
          transition={{ duration: 3.5, repeat: isPlaying ? Infinity : 0, ease: "linear" }}
        />
      </div>
      </div>
    </div>
  );
};

export default InteractiveShowcaseSection;

