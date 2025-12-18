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
    <div className="min-h-screen lg:pt-0 pt-16 relative overflow-hidden bg-black">
      <SEOHead />
      
      {/* Common Background */}
      <CommonBackground />

      <div className="w-full relative z-10">
        {/* Header Section - Homepage Style */}
        <div className="w-full mb-12">
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Breadcrumb */}
              <div className="flex items-center flex-wrap gap-2 text-sm mb-6">
                <Link 
                  to="/" 
                  className="flex items-center gap-1.5 text-gray-400 hover:text-[#107C10] transition-colors group"
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Ana Sayfa</span>
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <span className="text-[#107C10] font-semibold">Kategoriler</span>
              </div>

              {/* Title Section - Homepage Header Style */}
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
                  <Grid3x3 className="h-5 w-5 text-[#107C10]" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">
                    Oyun Kategorileri
                  </h1>
                  <p className="text-gray-400 text-sm">
                    Tüm oyun kategorilerini keşfedin ve istediğiniz oyunu bulun
                  </p>
                </div>
                {categories.length > 0 && (
                  <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-[#107C10]/20 border border-[#107C10]/30 rounded-lg">
                    <Sparkles className="h-4 w-4 text-[#107C10]" />
                    <span className="text-[#107C10] text-sm font-semibold">
                      {categories.length} Kategori
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <section className="relative">
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              {categories.length === 0 ? (
                <div className="text-center py-24">
                  <div className="w-16 h-16 bg-[#1A1A1A] border border-[#107C10]/30 flex items-center justify-center mx-auto mb-4">
                    <Gamepad2 className="w-8 h-8 text-[#107C10]/60" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    Kategori Bulunamadı
                  </h3>
                  <p className="text-gray-400 text-sm">Yakında yeni kategoriler eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
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
    <Link
      to={`/oyunlar/${category.slug}`}
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden h-full flex flex-col bg-[#1A1A1A] border border-[#333333] transition-all duration-200 hover:border-[#107C10]"
        style={{
          clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
        }}
      >
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-16 h-16 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(0 0, 16px 0, 0 16px)' }} />
        </div>
        <div className="absolute top-0 right-0 w-16 h-16 z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(calc(100% - 16px) 0, 100% 0, 100% 16px)' }} />
        </div>
        <div className="absolute bottom-0 left-0 w-16 h-16 z-10 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(0 calc(100% - 16px), 0 100%, 16px 100%)' }} />
        </div>
        <div className="absolute bottom-0 right-0 w-16 h-16 z-10 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(calc(100% - 16px) 100%, 100% 100%, 100% calc(100% - 16px))' }} />
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
          {category.url && !imageError ? (
            <img
              src={category.url}
              alt={category.name}
              className={`w-full h-full object-cover transition-transform duration-300 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
              <Grid3x3 className="h-16 w-16 text-[#107C10]/60" />
            </div>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

          {/* Product Count Badge */}
          {category.productCount && category.productCount > 0 && (
            <div className="absolute top-3 right-3 px-2.5 py-1.5 flex items-center gap-1.5 bg-[#107C10]/90 backdrop-blur-sm border border-[#107C10] rounded-lg z-20">
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span className="text-white text-xs font-semibold">{category.productCount}+</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col bg-gradient-to-b from-[#1A1A1A] to-black">
          {/* Category Name */}
          <h3 className="text-white font-semibold text-base mb-auto line-clamp-2 leading-snug transition-colors duration-300"
              style={{ color: isHovered ? '#107C10' : '#ffffff' }}>
            {category.name}
          </h3>

          {/* Description */}
          {category.description && (
            <p className="text-gray-400 text-sm mt-2 line-clamp-2 leading-relaxed">
              {category.description}
            </p>
          )}

          {/* Action Section */}
          <div className="mt-4 pt-4 border-t border-[#107C10]/20">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs font-medium">Kategoriyi Gör</span>
              <div className="w-10 h-10 flex items-center justify-center bg-[#107C10]/20 border border-[#107C10] hover:bg-[#107C10] transition-all duration-300 rounded-lg group-hover:scale-110">
                <ArrowRight className="h-5 w-5 text-[#107C10] group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>
        </div>

        {/* Hover Glow Effect */}
        {isHovered && (
          <>
            <div className="absolute inset-0 border-2 border-[#107C10] pointer-events-none opacity-50" 
              style={{
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
              }} />
            {/* Corner Glow on Hover */}
            <div className="absolute top-0 left-0 w-16 h-16 z-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#107C10] shadow-[0_0_12px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(0 0, 16px 0, 0 16px)' }} />
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 z-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#107C10] shadow-[0_0_12px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(calc(100% - 16px) 0, 100% 0, 100% 16px)' }} />
            </div>
            <div className="absolute bottom-0 left-0 w-16 h-16 z-10 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-[#107C10] shadow-[0_0_12px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(0 calc(100% - 16px), 0 100%, 16px 100%)' }} />
            </div>
            <div className="absolute bottom-0 right-0 w-16 h-16 z-10 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#107C10] shadow-[0_0_12px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(calc(100% - 16px) 100%, 100% 100%, 100% calc(100% - 16px))' }} />
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default CategoriesPage;





