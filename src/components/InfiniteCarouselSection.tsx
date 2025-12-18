import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHomepageItems } from '../services/api';
import { ArrowRight } from 'lucide-react';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  slug: string;
  url?: string;
}

const InfiniteCarouselSection = () => {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getHomepageItems(12);
        setItems(response.data || []);
      } catch (error) {
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadItems();
  }, []);

  if (isLoading || items.length === 0) return null;

  // Duplicate items for seamless loop
  const duplicatedItems = [...items, ...items, ...items];

  return (
    <div className="relative w-full overflow-hidden py-12">
      <div className="mb-8 text-center">
        <h3 className="text-3xl font-bold text-white mb-2">Sonsuz Koleksiyon</h3>
        <p className="text-gray-400">Kaydırmaya devam et, keşfetmeye devam et</p>
      </div>

      <div className="relative">
        {/* Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-6"
          animate={{
            x: [0, -(items.length * 320)], // items.length * (320px card width)
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            },
          }}
        >
          {duplicatedItems.map((item, index) => (
            <CarouselCard key={`${item.id}-${index}`} item={item} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const CarouselCard = ({ item }: { item: HomepageItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      className="flex-shrink-0 w-80"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -10 }}
    >
      <Link to={`/epin/${item.slug}`} className="block h-full">
        <div className="relative h-96 rounded-xl overflow-hidden border border-[#333333] bg-[#1a1a1a] group">
          {item.url && !imageError ? (
            <img
              src={item.url}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#107C10]/20 to-black">
              <span className="text-7xl">🎮</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
              {item.name}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-[#107C10] font-bold text-xl">
                {typeof item.price === 'string' ? item.price : `${item.price}₺`}
              </span>
              <motion.div
                animate={{ x: isHovered ? 5 : 0 }}
                className="w-10 h-10 flex items-center justify-center bg-[#107C10] rounded-full"
              >
                <ArrowRight className="w-5 h-5 text-white" />
              </motion.div>
            </div>
          </div>

          {isHovered && (
            <motion.div
              className="absolute inset-0 border-2 border-[#107C10] rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default InfiniteCarouselSection;

