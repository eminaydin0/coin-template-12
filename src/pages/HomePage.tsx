import { useState, useEffect } from 'react';
import { getHomepageItems, getCategories } from '../services/api';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import ScrollToTopButton from '../components/ScrollToTopButton';
import NewsletterSignup from '../components/NewsletterSignup';
import CallToActionSection from '../components/CallToActionSection';
import HeroSection from '../components/HeroSection';
import PopularProductsSection from '../components/PopularProductsSection';
import MoreGamesSection from '../components/MoreGamesSection';
import BestSellingGamesSection from '../components/BestSellingGamesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import CategoriesSection from '../components/CategoriesSection';
import InteractiveShowcaseSection from '../components/InteractiveShowcaseSection';
import SplitScreenSection from '../components/SplitScreenSection';

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
  category?: {
    name: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  url?: string;
  description?: string;
}

// Shimmer Skeleton Component - Simplified
const ShimmerSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="h-full w-full bg-[#1A1A1A]" />
  </div>
);

const HomePage = () => {
  const [homepageItems, setHomepageItems] = useState<HomepageItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const { getHeroList } = useWebsite();
  const heroList = getHeroList();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [itemsResponse, categoriesResponse] = await Promise.all([
          getHomepageItems(20),
          getCategories()
        ]);
        setHomepageItems(itemsResponse.data || []);
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        // Silent error handling
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen pt-16 lg:pt-0 relative overflow-hidden bg-black">
        <SEOHead />

        <div className="w-full relative z-10">
          {/* Hero Section Shimmer */}
          <section className="w-full mb-12">
            <div className="w-full">
              <div className="h-[60vh] min-h-[450px] max-h-[600px] overflow-hidden">
                <ShimmerSkeleton className="h-full w-full" />
              </div>
            </div>
          </section>

          {/* Content Sections Shimmer */}
          <section className="w-full mb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShimmerSkeleton className="h-64 w-full" />
                <ShimmerSkeleton className="h-64 w-full" />
              </div>
              <ShimmerSkeleton className="h-96 w-full" />
              <ShimmerSkeleton className="h-64 w-full" />
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen lg:pt-0 pt-16 relative overflow-hidden bg-black"
    >
      <SEOHead />

      <div className="w-full relative z-10">
        {/* HERO SECTION */}
        <section className="w-full mb-12">
          <div className="w-full">
            <div className="h-[60vh] min-h-[450px] max-h-[600px] overflow-hidden relative">
              <HeroSection
                heroList={heroList}
                currentHeroIndex={currentHeroIndex}
                setCurrentHeroIndex={setCurrentHeroIndex}
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
              />
            </div>
          </div>
        </section>

        {/* CONTENT SECTIONS */}
        <section className="w-full space-y-12">
          {/* Row 1: Categories Section - Kategorileri önce göster */}
          {categories.length > 0 && (
            <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
              <div className="p-4 sm:p-6 lg:p-8">
                <ScrollRevealSection>
                  <CategoriesSection categories={categories} />
                </ScrollRevealSection>
              </div>
            </div>
          )}

          {/* Row 2: Popular Products - Popüler oyunlar */}
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <ScrollRevealSection>
                <PopularProductsSection />
              </ScrollRevealSection>
            </div>
          </div>

          {/* Row 3: Best Selling Games - En çok satanlar */}
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <ScrollRevealSection>
                <BestSellingGamesSection homepageItems={homepageItems} />
              </ScrollRevealSection>
            </div>
          </div>

          {/* Row 4: Interactive Showcase - Öne çıkan showcase */}
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <ScrollRevealSection>
                <InteractiveShowcaseSection />
              </ScrollRevealSection>
            </div>
          </div>

          {/* Row 5: Split Screen - Büyük gösterim */}
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <ScrollRevealSection>
                <SplitScreenSection />
              </ScrollRevealSection>
            </div>
          </div>

          {/* Row 6: More Games - Daha fazla oyun */}
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <ScrollRevealSection>
                <MoreGamesSection homepageItems={homepageItems} />
              </ScrollRevealSection>
            </div>
          </div>

          {/* Row 7: How It Works - Nasıl çalışır */}
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <ScrollRevealSection>
                <HowItWorksSection />
              </ScrollRevealSection>
            </div>
          </div>

          {/* Row 8: Newsletter & CTA - En altta */}
          <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ScrollRevealSection>
                  <NewsletterSignup />
                </ScrollRevealSection>
                <ScrollRevealSection>
                  <CallToActionSection variant="compact" />
                </ScrollRevealSection>
              </div>
            </div>
          </div>
        </section>

        {/* Scroll to Top Button */}
        <ScrollToTopButton />
      </div>
    </div>
  );
};

// Scroll Reveal Wrapper Component - Simplified
const ScrollRevealSection = ({
  children
}: {
  children: React.ReactNode;
}) => {
  return (
    <div>
      {children}
    </div>
  );
};


export default HomePage;
