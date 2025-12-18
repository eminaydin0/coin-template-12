import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getHomepageItems } from '../services/api';
import { ArrowRight, Zap } from 'lucide-react';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  slug: string;
  url?: string;
}

const ParallaxScrollSection = () => {
  const [items, setItems] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <div className="relative w-full py-24 overflow-hidden">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent animate-spin" />
        </div>
      </div>
    );
  }

  if (items.length === 0) return null;

  return (
    <div className="relative w-full py-24 overflow-hidden">
      <div className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-3 px-6 py-3 bg-[#107C10]/20 border border-[#107C10] rounded-full mb-4"
        >
          <Zap className="h-5 w-5 text-[#107C10]" />
          <span className="text-[#107C10] font-semibold">Parallax Deneyimi</span>
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white"
        >
          Kaydır ve Keşfet
        </motion.h3>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Parallax Layers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const parallaxOffset = index % 3 === 0 ? -80 : index % 3 === 1 ? -50 : -120;
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ 
                  opacity: 1, 
                  y: parallaxOffset 
                }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ 
                  delay: index * 0.1,
                  duration: 0.8,
                  ease: "easeOut"
                }}
                className="relative"
              >
                <ParallaxCard item={item} index={index} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const ParallaxCard = ({ item, index }: { item: HomepageItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative h-96"
    >
      <Link to={`/epin/${item.slug}`} className="block h-full">
        <div className="relative h-full rounded-2xl overflow-hidden border-2 border-[#333333] bg-[#1a1a1a] group">
          {item.url && !imageError ? (
            <motion.img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.5 }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#107C10]/20 to-black">
              <span className="text-7xl">🎮</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <motion.div
              animate={{ y: isHovered ? 0 : 20 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-white font-bold text-xl mb-3">{item.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-[#107C10] font-bold text-2xl">
                  {typeof item.price === 'string' ? item.price : `${item.price}₺`}
                </span>
                <motion.div
                  animate={{ rotate: isHovered ? 45 : 0 }}
                  className="w-10 h-10 flex items-center justify-center bg-[#107C10] rounded-full"
                >
                  <ArrowRight className="w-5 h-5 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {isHovered && (
            <motion.div
              className="absolute inset-0 border-4 border-[#107C10] rounded-2xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ParallaxScrollSection;

