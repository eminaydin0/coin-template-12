import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowRight, Grid3x3 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
}

interface CategoriesSectionProps {
  categories: Category[];
}

const initials = (name?: string) =>
  (name || '?')
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();

const CategoriesSection = ({ categories }: CategoriesSectionProps) => {
  if (!categories.length) return null;

  return (
    <section className="relative w-full">
      {/* Header - HeroSection Style */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
            <Grid3x3 className="h-5 w-5 text-[#107C10]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              Kategoriler
            </h3>
            <p className="text-gray-400 text-sm">
              Tüm oyun kategorilerini keşfedin
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <CategoryCard key={category.id || category.slug} category={category} index={index} />
        ))}
      </div>
    </section>
  );
};

export default CategoriesSection;

const CategoryCard = ({ category, index }: { category: Category; index: number }) => {
  const [error, setError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={`/oyunlar/${category.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="block group"
    >
      <div
        className="relative bg-[#1A1A1A] border border-[#333333] p-4 h-full flex flex-col transition-all duration-200 hover:border-[#107C10] overflow-hidden"
        style={{
          clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
        }}
      >
        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-12 h-12 z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(0 0, 12px 0, 0 12px)' }} />
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 z-10 pointer-events-none">
          <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(calc(100% - 12px) 0, 100% 0, 100% 12px)' }} />
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-12 z-10 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(0 calc(100% - 12px), 0 100%, 12px 100%)' }} />
        </div>
        <div className="absolute bottom-0 right-0 w-12 h-12 z-10 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#107C10]/60" 
            style={{ clipPath: 'polygon(calc(100% - 12px) 100%, 100% 100%, 100% calc(100% - 12px))' }} />
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
        
        <div className="flex flex-col items-center justify-center h-full relative z-0">
          {/* Image/Icon */}
          <div className="relative w-16 h-16 mb-3 flex items-center justify-center bg-[#000000] border border-[#333333]">
            {!error && category.url ? (
              <img
                src={category.url}
                alt={category.name}
                className="w-full h-full object-cover"
                onError={() => setError(true)}
              />
            ) : (
              <span className="text-[#107C10] font-semibold text-sm">
                {initials(category.name)}
              </span>
            )}
          </div>

          {/* Category Name */}
          <h3 className="text-sm font-medium text-white text-center line-clamp-2 min-h-[2.5rem] transition-colors"
              style={{ color: isHovered ? '#107C10' : '#ffffff' }}>
            {category.name}
          </h3>
        </div>

        {/* Hover Glow Effect */}
        {isHovered && (
          <>
            <div className="absolute inset-0 border-2 border-[#107C10] pointer-events-none opacity-50" 
              style={{
                clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
              }} />
            {/* Corner Glow on Hover */}
            <div className="absolute top-0 left-0 w-12 h-12 z-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-[#107C10] shadow-[0_0_10px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(0 0, 12px 0, 0 12px)' }} />
            </div>
            <div className="absolute top-0 right-0 w-12 h-12 z-10 pointer-events-none">
              <div className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2 border-[#107C10] shadow-[0_0_10px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(calc(100% - 12px) 0, 100% 0, 100% 12px)' }} />
            </div>
            <div className="absolute bottom-0 left-0 w-12 h-12 z-10 pointer-events-none">
              <div className="absolute bottom-0 left-0 w-full h-full border-b-2 border-l-2 border-[#107C10] shadow-[0_0_10px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(0 calc(100% - 12px), 0 100%, 12px 100%)' }} />
            </div>
            <div className="absolute bottom-0 right-0 w-12 h-12 z-10 pointer-events-none">
              <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-[#107C10] shadow-[0_0_10px_rgba(16,124,16,0.8)]" 
                style={{ clipPath: 'polygon(calc(100% - 12px) 100%, 100% 100%, 100% calc(100% - 12px))' }} />
            </div>
          </>
        )}
      </div>
    </Link>
  );
};
