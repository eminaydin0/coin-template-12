import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Eye, ArrowRight, Play, Pause, ChevronLeft, ChevronRight, Sparkles, Star, Gamepad2 } from "lucide-react";
import SlideIndicators from "./SlideIndicators";

interface HeroItem {
  slogan: string;
  short1: string;
  short2: string;
  short3: string;
  url: string;
}

interface Props {
  heroList: HeroItem[];
  currentHeroIndex: number;
  setCurrentHeroIndex: React.Dispatch<React.SetStateAction<number>>;
  isPlaying: boolean;
  setIsPlaying: (v: boolean) => void;
}

export default function HeroSection({
  heroList,
  currentHeroIndex,
  setCurrentHeroIndex,
  isPlaying,
  setIsPlaying,
}: Props) {
  const DURATION = 8000;
  const progressRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(performance.now());
  const [imageLoaded, setImageLoaded] = useState(false);

  const heroRef = useRef<HTMLElement>(null);

  const clamp = (i: number, l: number) => ((i % l) + l) % l;
  const current = heroList[currentHeroIndex];

  /** autoplay */
  useEffect(() => {
    if (!isPlaying || !heroList.length || heroList.length <= 1) return;

    startTimeRef.current = performance.now();
    if (progressRef.current) {
      progressRef.current.style.setProperty("--p", "0");
    }

    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - startTimeRef.current;
      const t = Math.min(1, elapsed / DURATION);

      if (progressRef.current) {
        progressRef.current.style.setProperty("--p", t.toString());
      }

      if (t >= 1) {
        setCurrentHeroIndex((p) => clamp(p + 1, heroList.length));
      } else {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [isPlaying, currentHeroIndex, heroList.length, setCurrentHeroIndex]);

  if (!current || !heroList.length) {
    return null;
  }

  const goToSlide = (index: number) => {
    setCurrentHeroIndex(clamp(index, heroList.length));
  };

  const goToPrev = () => {
    setCurrentHeroIndex((p) => clamp(p - 1, heroList.length));
  };

  const goToNext = () => {
    setCurrentHeroIndex((p) => clamp(p + 1, heroList.length));
  };

  return (
    <section 
      ref={heroRef}
      className="relative h-full w-full flex flex-col lg:flex-row overflow-hidden bg-black"
      style={{
        background: '#000000',
        border: '1px solid #333333',
      }}
    >

      {/* Photo Section - Top on mobile, Left on desktop */}
      <div className="w-full lg:w-1/2 h-64 sm:h-80 md:h-96 lg:h-full relative overflow-hidden flex items-center justify-center p-4 sm:p-6 lg:p-0">
        <AnimatePresence mode="wait">
          <div
            key={current.url}
            className="w-full h-full flex items-center justify-center"
          >
            <img
              src={current.url}
              alt={current.slogan}
              className="max-w-full max-h-full object-contain"
              style={{ 
                opacity: imageLoaded ? 1 : 0,
                objectPosition: 'center center',
              }}
              onLoad={() => setImageLoaded(true)}
            />
          </div>
        </AnimatePresence>
      </div>


      {/* Text Section - Bottom on mobile, Right on desktop */}
      <div className="w-full lg:w-1/2 h-auto lg:h-full flex items-center justify-center relative z-10 px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 lg:py-0">
        <div className="text-center max-w-2xl w-full">
        <AnimatePresence mode="wait">
          <div key={current.slogan}>
            {/* Main Heading - Balanced */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-4 sm:mb-6 leading-tight">
              {current.slogan}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl font-normal text-gray-300 mb-6 sm:mb-8 lg:mb-10 leading-relaxed">
              {[current.short1, current.short2, current.short3].filter(Boolean).join(" • ")}
            </p>

            {/* Action Buttons */}
            <div className="flex justify-center gap-3 sm:gap-4 mt-6 sm:mt-8 flex-wrap">
              <Link
                to="/oyunlar"
                className="group relative inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-white text-xs sm:text-sm transition-all duration-200 bg-[#107C10] hover:bg-[#0E6B0E]"
              >
                <Rocket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Keşfet</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                to="/rehber"
                className="group inline-flex items-center gap-2 sm:gap-2.5 px-4 sm:px-6 py-2.5 sm:py-3 font-semibold text-white text-xs sm:text-sm transition-all duration-200 border border-[#107C10] hover:bg-[#107C10]/10"
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span>Nasıl Çalışır</span>
              </Link>
            </div>
          </div>
        </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls - Refined */}
      {heroList.length > 1 && (
        <>
          {/* Previous Button */}
          <motion.button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 group bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Önceki slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#107C10] transition-colors" />
          </motion.button>

          {/* Next Button */}
          <motion.button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 group bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Sonraki slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:text-[#107C10] transition-colors" />
          </motion.button>

          {/* Play/Pause Button */}
          <motion.button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-2 sm:top-4 right-2 sm:right-4 z-20 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center transition-all duration-200 group bg-[#1A1A1A] border border-[#333333] hover:border-[#107C10]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={isPlaying ? "Duraklat" : "Oynat"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-[#107C10] transition-colors" />
            ) : (
              <Play className="h-4 w-4 sm:h-5 sm:w-5 text-white group-hover:text-[#107C10] transition-colors ml-0.5" />
            )}
          </motion.button>
        </>
      )}

      {/* Slide Indicators */}
      {heroList.length > 1 && (
        <SlideIndicators
          heroList={heroList}
          currentIndex={currentHeroIndex}
          onSlideChange={goToSlide}
        />
      )}

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-20 bg-[#1A1A1A] overflow-hidden">
        <div
          ref={progressRef}
          className="h-full bg-[#107C10]"
          style={{
            width: "calc(var(--p,0)*100%)",
          }}
        />
      </div>
    </section>
  );
}
