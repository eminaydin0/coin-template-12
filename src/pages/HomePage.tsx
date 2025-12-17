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
      <div className="min-h-screen pt-16 relative overflow-hidden bg-black">
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
      className="min-h-screen pt-16 relative overflow-hidden bg-black"
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
        <section className="w-full mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            {/* Row 1: Popular Products */}
            <ScrollRevealSection>
              <PopularProductsSection />
            </ScrollRevealSection>

            {/* Row 2: Categories Section */}
            {categories.length > 0 && (
              <ScrollRevealSection>
                <CategoriesSection categories={categories} />
              </ScrollRevealSection>
            )}

            {/* Row 3: Best Selling Games */}
            <ScrollRevealSection>
              <BestSellingGamesSection homepageItems={homepageItems} />
            </ScrollRevealSection>

            {/* Row 4: More Games */}
            <ScrollRevealSection>
              <MoreGamesSection homepageItems={homepageItems} />
            </ScrollRevealSection>

            {/* Row 5: How It Works */}
            <ScrollRevealSection>
              <HowItWorksSection />
            </ScrollRevealSection>

            {/* Row 6: Newsletter & CTA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollRevealSection>
                <NewsletterSignup />
              </ScrollRevealSection>
              <ScrollRevealSection>
                <CallToActionSection variant="compact" />
              </ScrollRevealSection>
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
