import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gamepad2, 
  ArrowLeft,
  ChevronRight,
  Home,
  ChevronLeft,
  MoreHorizontal,
  Star,
  TrendingUp,
  Sparkles,
  Grid3x3,
  Zap
} from 'lucide-react';
import { getCategoryDetail, getCategoryProducts } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CallToActionSection from '../components/CallToActionSection';
import CommonBackground from '../components/CommonBackground'; 

interface Product {
  id: string;
  name: string;
  price: string; 
  originalPrice?: string;
  slug: string;
  url?: string;
  isPopular?: boolean;
  rating?: number;
  description?: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
}

const CategoryDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  useEffect(() => {
    const fetchData = async () => {
      if (!slug) return;
      
      try {
        const [categoryResponse, productsResponse] = await Promise.all([
          getCategoryDetail(slug),
          getCategoryProducts(slug)
        ]);
        
        setCategory(categoryResponse.data);
        setProducts(productsResponse.data || []);
      } catch (error) {
        console.error('Kategori verileri yüklenirken hata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <CommonBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <LoadingSpinner 
            size="xl" 
            text="Veriler Yükleniyor..." 
            variant="gaming"
          />
        </motion.div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden px-4">
        <CommonBackground />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center p-10 rounded-2xl border max-w-md mx-auto relative z-10"
          style={{
            background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center mx-auto mb-6">
            <Gamepad2 className="h-10 w-10 text-orange-400/60" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Kategori Bulunamadı</h2>
          <p className="text-gray-400 mb-8 text-base">Aradığınız kategori mevcut değil.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/oyunlar" 
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-black rounded-xl transition-all bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_rgba(249,115,22,0.7)]"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Kategoriler Sayfasına Dön</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
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
                <Link 
                  to="/oyunlar" 
                  className="text-gray-400 hover:text-orange-400 transition-colors"
                >
                  Kategoriler
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <span className="text-orange-300 font-semibold">{category.name}</span>
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
                      {category.name}
                    </h1>
                    {category.description && (
                      <p className="text-gray-400 text-sm font-medium">
                        {category.description}
                      </p>
                    )}
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
                      {products.length} Ürün
                    </span>
                  </div>
                  {products.length > itemsPerPage && (
                    <div
                      className="px-4 py-2 rounded-xl"
                      style={{
                        background: 'rgba(75, 85, 99, 0.2)',
                        border: '1px solid rgba(75, 85, 99, 0.3)',
                      }}
                    >
                      <span className="text-gray-300 text-sm font-bold">
                        Sayfa {currentPage}/{totalPages}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              {products.length === 0 ? (
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
                    Henüz Ürün Yok
                  </h3>
                  <p className="text-gray-400 text-lg">Yakında bu kategoriye yeni ürünler eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {currentProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Pagination */}
        {products.length > itemsPerPage && (
          <section className="relative py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="w-full">
                <div className="flex justify-center">
                  <div 
                    className="flex items-center gap-3 rounded-2xl p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {/* Previous Button */}
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300"
                      style={{
                        background: currentPage === 1 
                          ? 'rgba(75, 85, 99, 0.2)'
                          : 'rgba(249, 115, 22, 0.2)',
                        border: currentPage === 1 
                          ? '1px solid rgba(75, 85, 99, 0.3)'
                          : '1px solid rgba(249, 115, 22, 0.3)',
                        opacity: currentPage === 1 ? 0.5 : 1,
                      }}
                      whileHover={currentPage !== 1 ? { 
                        scale: 1.05, 
                        background: 'rgba(249, 115, 22, 0.3)' 
                      } : {}}
                      whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span>Önceki</span>
                    </motion.button>

                    {/* Page Numbers */}
                    <div className="flex items-center gap-2">
                      {currentPage > 3 && (
                        <>
                          <PageButton pageNum={1} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                          {currentPage > 4 && (
                            <span className="text-gray-500 px-2">
                              <MoreHorizontal className="h-5 w-5" />
                            </span>
                          )}
                        </>
                      )}

                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }

                        if (pageNum < 1 || pageNum > totalPages) return null;
                        return (
                          <PageButton 
                            key={pageNum} 
                            pageNum={pageNum} 
                            currentPage={currentPage} 
                            setCurrentPage={setCurrentPage} 
                          />
                        );
                      })}

                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && (
                            <span className="text-gray-500 px-2">
                              <MoreHorizontal className="h-5 w-5" />
                            </span>
                          )}
                          <PageButton pageNum={totalPages} currentPage={currentPage} setCurrentPage={setCurrentPage} />
                        </>
                      )}
                    </div>

                    {/* Next Button */}
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300"
                      style={{
                        background: currentPage === totalPages 
                          ? 'rgba(75, 85, 99, 0.2)'
                          : 'rgba(249, 115, 22, 0.2)',
                        border: currentPage === totalPages 
                          ? '1px solid rgba(75, 85, 99, 0.3)'
                          : '1px solid rgba(249, 115, 22, 0.3)',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                      }}
                      whileHover={currentPage !== totalPages ? { 
                        scale: 1.05, 
                        background: 'rgba(249, 115, 22, 0.3)' 
                      } : {}}
                      whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
                    >
                      <span>Sonraki</span>
                      <ChevronRight className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        <CallToActionSection />
      </div>
    </div>
  );
};

const PageButton = ({ 
  pageNum, 
  currentPage, 
  setCurrentPage 
}: { 
  pageNum: number; 
  currentPage: number; 
  setCurrentPage: (page: number) => void;
}) => {
  const isActive = pageNum === currentPage;
  
  return (
    <motion.button
      onClick={() => setCurrentPage(pageNum)}
      className="min-w-[44px] h-11 rounded-xl text-base font-bold text-white transition-all duration-300 relative overflow-hidden"
      style={{
        background: isActive
          ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.4) 0%, rgba(234, 88, 12, 0.3) 100%)'
          : 'rgba(249, 115, 22, 0.15)',
        border: isActive
          ? '1px solid rgba(249, 115, 22, 0.6)'
          : '1px solid rgba(249, 115, 22, 0.3)',
        boxShadow: isActive ? '0 4px 20px rgba(249, 115, 22, 0.3)' : 'none',
      }}
      whileHover={{ 
        scale: 1.08, 
        background: isActive 
          ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.5) 0%, rgba(234, 88, 12, 0.4) 100%)'
          : 'rgba(249, 115, 22, 0.25)',
      }}
      whileTap={{ scale: 0.95 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
        />
      )}
      <span className="relative z-10">{pageNum}</span>
    </motion.button>
  );
};

const ProductCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link 
      to={`/epin/${product.slug}`}
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
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden rounded-t-2xl">
          <AnimatePresence>
            {product.url && !imageError ? (
              <motion.img
                src={product.url}
                alt={product.name}
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
          </AnimatePresence>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Badges */}
          {product.isPopular && (
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
              <TrendingUp className="h-3.5 w-3.5 text-white" />
              <span className="text-white text-xs font-bold">TREND</span>
            </motion.div>
          )}

          {product.rating && (
            <motion.div
              className="absolute top-3 left-3 rounded-lg px-3 py-1.5 z-10 flex items-center gap-1.5"
              style={{
                background: 'rgba(0, 0, 0, 0.6)',
                border: '1px solid rgba(249, 115, 22, 0.4)',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
              <span className="text-white text-sm font-bold">{product.rating}</span>
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
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-gray-500 text-xs line-through mb-0.5">
                    {product.originalPrice}
                  </span>
                )}
                <span className="text-orange-400 font-black text-lg">
                  {product.price}
                </span>
              </div>
              
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
                <Zap className="h-5 w-5 text-orange-400" />
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
  );
};

export default CategoryDetailPage;