import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHomepageItems } from '../services/api';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  slug: string;
  url?: string;
  rating?: number;
}

const MasonryGallerySection = () => {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getHomepageItems(15);
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

  // Create masonry layout with varying heights
  const masonryItems = items.map((item, index) => ({
    ...item,
    height: index % 3 === 0 ? 'h-80' : index % 3 === 1 ? 'h-64' : 'h-72',
    delay: index * 0.05,
  }));

  return (
    <div className="relative w-full">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-purple-600 to-pink-600 rounded-full"
          >
            <Sparkles className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-white">Galeri Koleksiyonu</h3>
            <p className="text-gray-400 text-sm">Asimetrik düzen ile keşfet</p>
          </div>
        </div>
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {masonryItems.map((item, index) => (
          <MasonryCard
            key={item.id}
            item={item}
            height={item.height}
            index={index}
            isHovered={hoveredId === item.id}
            onHover={() => setHoveredId(item.id)}
            onLeave={() => setHoveredId(null)}
          />
        ))}
      </div>
    </div>
  );
};

const MasonryCard = ({
  item,
  height,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  item: HomepageItem & { delay: number };
  height: string;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: item.delay, duration: 0.5 }}
      className={`break-inside-avoid mb-4 ${height} relative group cursor-pointer`}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      <Link to={`/epin/${item.slug}`} className="block h-full">
        <div className="relative h-full overflow-hidden rounded-xl border border-[#333333] bg-[#1a1a1a] transition-all duration-300 hover:border-[#107C10] hover:shadow-lg hover:shadow-[#107C10]/30">
          {/* Image */}
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
              <span className="text-6xl">🎮</span>
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

          {/* Content Overlay */}
          <div className="absolute inset-0 flex flex-col justify-end p-4">
            <motion.div
              initial={false}
              animate={{
                y: isHovered ? 0 : 20,
                opacity: isHovered ? 1 : 0.8,
              }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                {item.name}
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-[#107C10] font-bold text-xl">
                  {typeof item.price === 'string' ? item.price : `${item.price}₺`}
                </span>
                <motion.div
                  animate={{ x: isHovered ? 5 : 0 }}
                  className="w-8 h-8 flex items-center justify-center bg-[#107C10] rounded-full"
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Hover Glow Effect */}
          {isHovered && (
            <motion.div
              className="absolute inset-0 border-2 border-[#107C10] rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default MasonryGallerySection;

