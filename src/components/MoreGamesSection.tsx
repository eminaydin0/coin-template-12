import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gamepad2, Users, TrendingUp } from 'lucide-react';

interface HomepageItem {
  id: string;
  name: string;
  price: number | string;
  originalPrice?: number | string;
  slug: string;
  url?: string;
  isPopular?: boolean;
  people?: number;
  categoryName?: string;
}

interface MoreGamesSectionProps {
  homepageItems: HomepageItem[];
}

const MoreGamesSection = ({ homepageItems }: MoreGamesSectionProps) => {
  const moreGames = homepageItems.slice(10, Math.min(homepageItems.length, 30));

  if (moreGames.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <div className="flex flex-col relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
              <Gamepad2 className="h-5 w-5 text-[#107C10]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Daha Fazla Oyun
              </h3>
              <p className="text-gray-400 text-sm">
                Geniş oyun koleksiyonumuz
              </p>
            </div>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {moreGames.map((item) => (
            <MoreGameCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MoreGameCard = ({ item }: { item: HomepageItem }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  return (
    <Link
      to={`/epin/${item.slug}`}
      className="block group h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden h-full flex flex-col bg-[#1A1A1A] border border-[#333333] transition-all duration-200 hover:border-[#107C10]"
      >
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          {item.url && !imageError ? (
            <img
              src={item.url}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-[#1A1A1A] flex items-center justify-center">
              <Gamepad2 className="h-16 w-16 text-[#107C10]/60" />
            </div>
          )}

          {/* Popular Badge */}
          {item.isPopular && (
            <div className="absolute top-3 right-3 px-2 py-1 flex items-center gap-1 bg-[#107C10]">
              <TrendingUp className="h-3.5 w-3.5 text-white" />
              <span className="text-white text-xs font-semibold">TREND</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category & Users */}
          <div className="flex items-center justify-between mb-3">
            {item.categoryName && (
              <span className="text-xs font-medium px-2 py-1 bg-[#1A1A1A] border border-[#333333] text-[#107C10]">
                {item.categoryName}
              </span>
            )}
            {item.people !== undefined && item.people > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-400 ml-auto">
                <Users className="h-3.5 w-3.5" />
                <span>{item.people.toLocaleString()}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-white font-semibold text-sm mb-auto line-clamp-2 leading-snug transition-colors duration-200"
              style={{ color: isHovered ? '#107C10' : '#ffffff' }}>
            {item.name}
          </h3>

          {/* Price Section */}
          <div className="mt-4 pt-4 border-t border-[#333333]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                {item.originalPrice && item.originalPrice !== item.price && (
                  <span className="text-gray-500 text-xs line-through mb-0.5">
                    {typeof item.originalPrice === 'string' 
                      ? item.originalPrice 
                      : `${item.originalPrice}₺`}
                  </span>
                )}
                <span className="text-[#107C10] font-semibold text-base">
                  {typeof item.price === 'string' ? item.price : `${item.price}₺`}
                </span>
              </div>
              
              <div className="w-8 h-8 flex items-center justify-center bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10] transition-colors">
                <ArrowRight className="h-4 w-4 text-[#107C10]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MoreGamesSection;
