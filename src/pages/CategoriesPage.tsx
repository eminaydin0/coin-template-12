import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Gamepad2, 
  ArrowRight,
  Home,
  ChevronRight,
  Grid3x3,
  Sparkles
} from 'lucide-react';
import { getCategories } from '../services/api';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
  productCount?: number;
}

const CategoriesPage = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Kategoriler yükleniyor...');
        const response = await getCategories();
        console.log('API Response:', response);
        setCategories(response.data || []);
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <CommonBackground />
        <LoadingSpinner 
          size="xl" 
          text="Kategoriler Yükleniyor..." 
          variant="gaming" 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
      <SEOHead />
      
      {/* Common Background */}
      <CommonBackground />

      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full relative z-10">
        {/* Header */}
        <div className="w-full mb-10 px-4 sm:px-6 lg:px-8">
          <div className="w-full">
            <div 
              className="rounded-2xl p-8 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              }}
            >
              {/* Breadcrumb */}
              <div className="flex items-center flex-wrap gap-2 text-sm mb-6 relative z-10">
                <Link 
                  to="/" 
                  className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 transition-colors group"
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Ana Sayfa</span>
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <span className="text-orange-300 font-semibold">Kategoriler</span>
              </div>

              {/* Title Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <Grid3x3 className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                      Oyun Kategorileri
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                      Tüm oyun kategorilerini keşfedin ve istediğiniz oyunu bulun
                    </p>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className="px-4 py-2 rounded-xl flex items-center gap-2"
                    style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-300 text-sm font-bold">
                      {categories.length} Kategori
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              {categories.length === 0 ? (
                <div 
                  className="text-center py-24 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center mx-auto mb-6">
                    <Gamepad2 className="h-12 w-12 text-orange-400/60" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Kategori Bulunamadı
                  </h3>
                  <p className="text-gray-400 text-lg">Yakında yeni kategoriler eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {categories.map((category, index) => (
                    <CategoryCard key={category.id} category={category} index={index} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <CallToActionSection />
      </div>
    </div>
  );
};

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
    >
      <Link 
        to={`/oyunlar/${category.slug}`}
        className="block group h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.div
          className="relative overflow-hidden h-full flex flex-col rounded-2xl"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            backdropFilter: 'blur(10px)',
          }}
          whileHover={{ 
            y: -8,
            boxShadow: '0 20px 60px rgba(249, 115, 22, 0.3)',
            borderColor: 'rgba(249, 115, 22, 0.5)',
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Category Image */}
          <div className="relative h-48 overflow-hidden rounded-t-2xl">
            {category.url && !imageError ? (
              <motion.img
                src={category.url}
                alt={category.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{ scale: isHovered ? 1.08 : 1 }}
                transition={{ duration: 0.4 }}
                onError={() => setImageError(true)}
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-orange-500/30 via-orange-600/20 to-orange-700/10 flex items-center justify-center">
                <Gamepad2 className="h-16 w-16 text-orange-300/60" />
              </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
            
            {/* Product Count Badge */}
            {category.productCount && category.productCount > 0 && (
              <motion.div
                className="absolute top-3 right-3 rounded-lg px-3 py-1.5 z-10 flex items-center gap-1.5"
                style={{
                  background: 'rgba(249, 115, 22, 0.9)',
                  border: '1px solid rgba(251, 146, 60, 0.5)',
                }}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Sparkles className="h-3.5 w-3.5 text-white" />
                <span className="text-white text-xs font-bold">{category.productCount}+ ürün</span>
              </motion.div>
            )}

            {/* Hover Overlay */}
            <motion.div
              className="absolute inset-0 bg-orange-500/0 pointer-events-none"
              animate={{
                background: isHovered ? 'rgba(249, 115, 22, 0.1)' : 'rgba(249, 115, 22, 0)',
              }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <h3 className="text-white font-bold text-base mb-auto line-clamp-2 leading-snug transition-colors duration-300"
                style={{ color: isHovered ? 'rgb(251, 146, 60)' : 'rgb(255, 255, 255)' }}>
              {category.name}
            </h3>

            {/* Description */}
            {category.description && (
              <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
                {category.description}
              </p>
            )}

            {/* Action Section */}
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
              <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs font-medium">Kategoriyi Gör</span>
                <motion.div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                  }}
                  whileHover={{ 
                    scale: 1.1,
                    background: 'rgba(249, 115, 22, 0.25)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ArrowRight className="h-5 w-5 text-orange-400" />
                </motion.div>
              </div>
            </div>
          </div>

          {/* Shine Effect on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoriesPage;





