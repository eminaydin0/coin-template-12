import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
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
      <div className="min-h-screen lg:pt-0 pt-16 flex items-center justify-center relative overflow-hidden bg-black">
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
      <div className="min-h-screen lg:pt-0 pt-16 flex items-center justify-center relative overflow-hidden px-4 bg-black">
        <CommonBackground />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center p-10 max-w-md mx-auto relative z-10 bg-[#1A1A1A] border border-[#333333]"
          style={{
            clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
          }}
        >
          <div className="w-20 h-20 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center mx-auto mb-6">
            <Gamepad2 className="h-10 w-10 text-[#107C10]/60" />
          </div>
          <h2 className="text-3xl font-black text-white mb-3">Kategori Bulunamadı</h2>
          <p className="text-gray-400 mb-8 text-base">Aradığınız kategori mevcut değil.</p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/oyunlar" 
              className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white rounded-xl transition-all bg-[#107C10] hover:bg-[#0E6B0E]"
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
    <div className="min-h-screen lg:pt-0 pt-16 relative overflow-hidden gaming-scrollbar bg-black">
      <CommonBackground />
      
      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#107C10]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full relative z-10">
        {/* Header */}
        <div className="w-full mb-12 px-4 sm:px-6 lg:px-8">
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Breadcrumb */}
              <div className="flex items-center flex-wrap gap-2 text-sm mb-6 relative z-10">
                <Link 
                  to="/" 
                  className="flex items-center gap-1.5 text-gray-400 hover:text-[#107C10] transition-colors group"
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Ana Sayfa</span>
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <Link 
                  to="/oyunlar" 
                  className="text-gray-400 hover:text-[#107C10] transition-colors"
                >
                  Kategoriler
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <span className="text-[#107C10] font-semibold">{category.name}</span>
              </div>

              {/* Title Section - Homepage Style */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
                    <Grid3x3 className="h-5 w-5 text-[#107C10]" />
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold text-white mb-1">
                      {category.name}
                    </h1>
                    {category.description && (
                      <p className="text-gray-400 text-sm">
                        {category.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className="px-4 py-2 rounded-xl flex items-center gap-2 bg-[#1A1A1A] border border-[#333333]"
                  >
                    <Sparkles className="h-4 w-4 text-[#107C10]" />
                    <span className="text-[#107C10] text-sm font-bold">
                      {products.length} Ürün
                    </span>
                  </div>
                  {products.length > itemsPerPage && (
                    <div
                      className="px-4 py-2 rounded-xl bg-[#1A1A1A] border border-[#333333]"
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
                  className="text-center py-24 bg-[#1A1A1A] border border-[#333333]"
                  style={{
                    clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                  }}
                >
                  <div className="w-24 h-24 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center mx-auto mb-6">
                    <Gamepad2 className="h-12 w-12 text-[#107C10]/60" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Henüz Ürün Yok
                  </h3>
                  <p className="text-gray-400 text-lg">Yakında bu kategoriye yeni ürünler eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                    className="flex items-center gap-3 p-4 bg-[#1A1A1A] border border-[#333333]"
                    style={{
                      clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                    }}
                  >
                    {/* Previous Button */}
                    <motion.button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 bg-[#1A1A1A] border"
                      style={{
                        border: currentPage === 1 
                          ? '1px solid #333333'
                          : '1px solid #107C10',
                        opacity: currentPage === 1 ? 0.5 : 1,
                      }}
                      whileHover={currentPage !== 1 ? { 
                        scale: 1.05, 
                        borderColor: '#107C10',
                        backgroundColor: 'rgba(16, 124, 16, 0.1)',
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
                      className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all duration-300 bg-[#1A1A1A] border"
                      style={{
                        border: currentPage === totalPages 
                          ? '1px solid #333333'
                          : '1px solid #107C10',
                        opacity: currentPage === totalPages ? 0.5 : 1,
                      }}
                      whileHover={currentPage !== totalPages ? { 
                        scale: 1.05, 
                        borderColor: '#107C10',
                        backgroundColor: 'rgba(16, 124, 16, 0.1)',
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

        <div className="w-full px-4 sm:px-6 lg:px-8 mb-12">
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <CallToActionSection variant="compact" />
            </div>
          </div>
        </div>
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
      className="min-w-[44px] h-11 rounded-xl text-base font-bold text-white transition-all duration-300 relative overflow-hidden bg-[#1A1A1A] border"
      style={{
        border: isActive
          ? '1px solid #107C10'
          : '1px solid #333333',
        backgroundColor: isActive ? 'rgba(16, 124, 16, 0.15)' : '#1A1A1A',
      }}
      whileHover={{ 
        scale: 1.08, 
        borderColor: '#107C10',
        backgroundColor: isActive ? 'rgba(16, 124, 16, 0.25)' : 'rgba(16, 124, 16, 0.1)',
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
      <span className="relative z-10" style={{ color: isActive ? '#107C10' : '#ffffff' }}>{pageNum}</span>
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
        className="relative overflow-hidden h-full flex flex-col bg-[#1A1A1A] border border-[#333333] transition-all duration-200 hover:border-[#107C10]"
        style={{
          clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
        }}
        whileHover={{ 
          y: -8,
          boxShadow: '0 20px 60px rgba(16, 124, 16, 0.3)',
          borderColor: 'rgba(16, 124, 16, 0.5)',
        }}
        transition={{ duration: 0.3 }}
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
        
        {/* Product Image */}
        <div className="relative h-48 overflow-hidden">
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
            <div className="w-full h-full bg-gradient-to-br from-[#107C10]/30 via-[#107C10]/20 to-[#107C10]/10 flex items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-[#107C10]/60" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
          
          {/* Badges */}
          {product.isPopular && (
            <motion.div
              className="absolute top-3 right-3 rounded-lg px-3 py-1.5 z-10 flex items-center gap-1.5"
              style={{
                background: 'rgba(16, 124, 16, 0.9)',
                border: '1px solid rgba(16, 124, 16, 0.5)',
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
                border: '1px solid rgba(16, 124, 16, 0.4)',
                backdropFilter: 'blur(12px)',
              }}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Star className="h-4 w-4 text-[#107C10] fill-[#107C10]" />
              <span className="text-white text-sm font-bold">{product.rating}</span>
            </motion.div>
          )}

          {/* Hover Overlay */}
          <motion.div
            className="absolute inset-0 bg-[#107C10]/0 pointer-events-none"
            animate={{
              background: isHovered ? 'rgba(16, 124, 16, 0.1)' : 'rgba(16, 124, 16, 0)',
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <h3 className="text-white font-bold text-base mb-auto line-clamp-2 leading-snug transition-colors duration-300"
              style={{ color: isHovered ? '#107C10' : '#ffffff' }}>
            {product.name}
          </h3>

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: '#333333' }}>
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-gray-500 text-xs line-through mb-0.5">
                    {product.originalPrice}
                  </span>
                )}
                <span className="text-[#107C10] font-black text-lg">
                  {product.price}
                </span>
              </div>
              
              <motion.div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  background: 'rgba(16, 124, 16, 0.15)',
                  border: '1px solid rgba(16, 124, 16, 0.3)',
                }}
                whileHover={{ 
                  scale: 1.1,
                  background: 'rgba(16, 124, 16, 0.25)',
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap className="h-5 w-5 text-[#107C10]" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Shine Effect on Hover */}
        {isHovered && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none"
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default CategoryDetailPage;