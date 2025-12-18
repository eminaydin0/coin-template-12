import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Gamepad2, Flame, Star, Users, ArrowRight } from 'lucide-react';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  slug: string;
  url?: string;
  isPopular?: boolean;
  rating?: number;
  people?: number;
  categoryName?: string;
}

interface BestSellingGamesSectionProps {
  homepageItems: HomepageItem[];
}

const BestSellingGamesSection: React.FC<BestSellingGamesSectionProps> = ({ homepageItems }) => {
  const [bestSellingGames, setBestSellingGames] = useState<HomepageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (homepageItems.length > 0) {
      setBestSellingGames(homepageItems.slice(0, 8));
      setIsLoading(false);
    }
  }, [homepageItems]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-[#107C10] border-t-transparent animate-spin" />
          <span className="text-white text-sm">
            Oyunlar Yükleniyor...
          </span>
        </div>
      </div>
    );
  }

  if (bestSellingGames.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-[#1A1A1A] border border-[#333333] flex items-center justify-center mx-auto mb-4">
          <Gamepad2 className="w-8 h-8 text-[#107C10]/60" />
        </div>
        <span className="text-gray-400 text-sm">
          Henüz en çok satan oyun bulunmuyor
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col relative z-10">
        {/* Header - HeroSection Style */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
              <Flame className="h-5 w-5 text-[#107C10]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                En Çok Satan Oyunlar
              </h3>
              <p className="text-gray-400 text-sm">
                Oyuncuların en çok tercih ettikleri oyunlar
              </p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {bestSellingGames.map((game, index) => (
            <BestSellingCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </div>
  );
};

const BestSellingCard = ({ game }: { game: HomepageItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/epin/${game.slug}`}
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
        <div className="relative h-48 overflow-hidden">
          {game.url && !imageError ? (
            <img
              src={game.url}
              alt={game.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-[#107C10]/60" />
            </div>
          )}

          {/* Best Seller Badge */}
          <div className="absolute top-3 right-3 px-2 py-1 flex items-center gap-1 bg-[#107C10]">
            <Flame className="h-3.5 w-3.5 text-white" />
            <span className="text-white text-xs font-semibold">EN ÇOK SATAN</span>
          </div>

          {/* Rating Badge */}
          {game.rating && (
            <div className="absolute top-3 left-3 px-2 py-1 flex items-center gap-1 bg-[#1A1A1A] border border-[#333333]">
              <Star className="h-3.5 w-3.5 text-[#107C10] fill-[#107C10]" />
              <span className="text-white text-xs font-semibold">{game.rating}</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category & Users */}
          <div className="flex items-center justify-between mb-3">
            {game.categoryName && (
              <span className="text-xs font-medium px-2 py-1 bg-[#1A1A1A] border border-[#333333] text-[#107C10]">
                {game.categoryName}
              </span>
            )}
            {game.people !== undefined && game.people > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
                <Users className="h-3.5 w-3.5" />
                <span>{game.people.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm mb-auto line-clamp-2 leading-snug transition-colors duration-200"
              style={{ color: isHovered ? '#107C10' : '#ffffff' }}>
            {game.name}
          </h3>

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t border-[#333333]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {game.originalPrice && game.originalPrice !== game.price && (
                  <span className="text-gray-500 text-xs line-through mb-0.5">
                    {typeof game.originalPrice === 'string' 
                      ? game.originalPrice 
                      : `${game.originalPrice}₺`}
                  </span>
                )}
                <span className="text-[#107C10] font-semibold text-base">
                  {typeof game.price === 'string' ? game.price : `${game.price}₺`}
                </span>
              </div>
              
              <div className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10] transition-colors">
                <ArrowRight className="h-4 w-4 text-[#107C10]" />
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

export default BestSellingGamesSection;
