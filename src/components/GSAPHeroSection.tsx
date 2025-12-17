import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Rocket, Eye, ArrowRight, Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

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

/**
 * Enhanced Hero Section with GSAP Animations
 * - Smooth text animations
 * - Parallax effects
 * - Scroll-triggered animations
 */
export default function GSAPHeroSection({
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
  
  // GSAP refs
  const heroRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const clamp = (i: number, l: number) => ((i % l) + l) % l;
  const current = heroList[currentHeroIndex];

  // GSAP Animations on mount and slide change
  useEffect(() => {
    if (!heroRef.current || !current) return;

    const ctx = gsap.context(() => {
      // Title animation - Split text effect
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          {
            opacity: 0,
            y: 50,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            delay: 0.2,
          }
        );
      }

      // Subtitle animation - Fade and slide
      if (subtitleRef.current) {
        gsap.fromTo(
          subtitleRef.current,
          {
            opacity: 0,
            y: 30,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.4,
          }
        );
      }

      // Badge animation - Scale and bounce
      if (badgeRef.current) {
        gsap.fromTo(
          badgeRef.current,
          {
            opacity: 0,
            scale: 0.5,
            rotation: -10,
          },
          {
            opacity: 1,
            scale: 1,
            rotation: 0,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: 0.1,
          }
        );
      }

      // Buttons animation - Stagger
      if (buttonsRef.current) {
        const buttons = buttonsRef.current.children;
        gsap.fromTo(
          buttons,
          {
            opacity: 0,
            y: 20,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.1,
            delay: 0.6,
          }
        );
      }

      // Image parallax effect
      if (imageRef.current) {
        gsap.fromTo(
          imageRef.current,
          {
            scale: 1.1,
            opacity: 0,
          },
          {
            scale: 1,
            opacity: 0.85,
            duration: 1.2,
            ease: "power2.out",
          }
        );

        // Parallax on scroll
        ScrollTrigger.create({
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            if (imageRef.current) {
              gsap.to(imageRef.current, {
                y: self.progress * 100,
                scale: 1 + self.progress * 0.1,
                duration: 0.3,
              });
            }
          },
        });
      }

      // Floating animation for badge
      if (badgeRef.current) {
        gsap.to(badgeRef.current, {
          y: -10,
          duration: 2,
          ease: "power1.inOut",
          yoyo: true,
          repeat: -1,
        });
      }

    }, heroRef);

    return () => ctx.revert();
  }, [currentHeroIndex, current]);

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
      className="relative h-full w-full flex items-center justify-center overflow-hidden"
      style={{
        clipPath: 'polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)',
        border: '3px solid transparent',
        background: 'linear-gradient(black, black) padding-box, linear-gradient(135deg, rgba(249, 115, 22, 0.6), rgba(251, 146, 60, 0.4), rgba(249, 115, 22, 0.6)) border-box',
      }}
    >
      {/* Enhanced Decorative Corner Elements */}
      <div className="absolute top-0 left-0 w-8 h-8 z-30">
        <div className="absolute top-0 left-0 w-full h-full border-t-4 border-l-4 border-orange-400" />
        <div className="absolute top-1 left-1 w-3 h-3 bg-orange-400/50" />
      </div>
      <div className="absolute top-0 right-0 w-8 h-8 z-30">
        <div className="absolute top-0 right-0 w-full h-full border-t-4 border-r-4 border-orange-400" />
        <div className="absolute top-1 right-1 w-3 h-3 bg-orange-400/50" />
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8 z-30">
        <div className="absolute bottom-0 left-0 w-full h-full border-b-4 border-l-4 border-orange-400" />
        <div className="absolute bottom-1 left-1 w-3 h-3 bg-orange-400/50" />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 z-30">
        <div className="absolute bottom-0 right-0 w-full h-full border-b-4 border-r-4 border-orange-400" />
        <div className="absolute bottom-1 right-1 w-3 h-3 bg-orange-400/50" />
      </div>

      {/* Animated Border Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1), rgba(251, 146, 60, 0.1))',
          clipPath: 'polygon(30px 0, calc(100% - 30px) 0, 100% 30px, 100% calc(100% - 30px), calc(100% - 30px) 100%, 30px 100%, 0 calc(100% - 30px), 0 30px)',
        }}
      />

      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.url}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            ref={imageRef}
            src={current.url}
            alt={current.slogan}
            className="absolute inset-0 w-full h-full"
            style={{ 
              objectFit: 'cover',
              objectPosition: 'center center',
              filter: 'brightness(0.9) contrast(1.1)',
            }}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Enhanced Multi-layer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/65 to-black/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30" />
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(249, 115, 22, 0.2) 0%, transparent 70%)',
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Content - GSAP Animated */}
      <div className="relative z-10 text-center max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Minimal Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full backdrop-blur-md border border-orange-500/30 bg-black/30"
        >
          <Rocket className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-xs font-medium text-orange-300 uppercase tracking-wider">
            Gaming Platform
          </span>
        </div>

        {/* Clean Main Heading */}
        <h1
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight"
        >
          <span className="bg-gradient-to-r from-orange-300 via-orange-200 to-orange-400 bg-clip-text text-transparent">
            {current.slogan}
          </span>
        </h1>

        {/* Clean Subtitle */}
        <p
          ref={subtitleRef}
          className="text-base sm:text-lg md:text-xl font-normal text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          {[current.short1, current.short2, current.short3].filter(Boolean).join(" • ")}
        </p>

        {/* Clean Action Buttons */}
        <div
          ref={buttonsRef}
          className="flex justify-center gap-4 mt-8 flex-wrap"
        >
          <Link
            to="/oyunlar"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold text-white text-sm overflow-hidden transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
            }}
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                y: -2,
                boxShadow: '0 6px 24px rgba(249, 115, 22, 0.5)',
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                y: 0,
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
                duration: 0.3,
                ease: "power2.out",
              });
            }}
          >
            <Rocket className="h-4 w-4" />
            <span>Keşfet</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/rehber"
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg font-semibold text-white text-sm backdrop-blur-md transition-all border border-orange-500/30 bg-black/20"
            onMouseEnter={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1.05,
                y: -2,
                background: 'rgba(249, 115, 22, 0.1)',
                borderColor: 'rgba(249, 115, 22, 0.5)',
                duration: 0.3,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              gsap.to(e.currentTarget, {
                scale: 1,
                y: 0,
                background: 'rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(249, 115, 22, 0.3)',
                duration: 0.3,
                ease: "power2.out",
              });
            }}
          >
            <Eye className="h-4 w-4" />
            <span>Nasıl Çalışır</span>
          </Link>
        </div>
      </div>

      {/* Clean Navigation Controls */}
      {heroList.length > 1 && (
        <>
          {/* Previous Button */}
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md border border-orange-500/30 bg-black/40 transition-all hover:bg-black/60 hover:border-orange-500/50"
            aria-label="Önceki slide"
          >
            <ChevronLeft className="h-5 w-5 text-orange-300" />
          </button>

          {/* Next Button */}
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md border border-orange-500/30 bg-black/40 transition-all hover:bg-black/60 hover:border-orange-500/50"
            aria-label="Sonraki slide"
          >
            <ChevronRight className="h-5 w-5 text-orange-300" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-lg flex items-center justify-center backdrop-blur-md border border-orange-500/30 bg-black/40 transition-all hover:bg-black/60 hover:border-orange-500/50"
            aria-label={isPlaying ? "Duraklat" : "Oynat"}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-orange-300" />
            ) : (
              <Play className="h-4 w-4 text-orange-300 ml-0.5" />
            )}
          </button>
        </>
      )}

      {/* Clean Slide Indicators */}
      {heroList.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {heroList.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentHeroIndex ? 'w-8' : 'w-2'
              } h-2`}
              style={{
                background: index === currentHeroIndex
                  ? 'rgba(249, 115, 22, 1)'
                  : 'rgba(255, 255, 255, 0.3)',
                boxShadow: index === currentHeroIndex
                  ? '0 0 8px rgba(249, 115, 22, 0.5)'
                  : 'none',
              }}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Clean Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 z-20 bg-black/20">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-orange-400 to-orange-500 transition-all duration-300"
          style={{
            width: "calc(var(--p,0)*100%)",
          }}
        />
      </div>
    </section>
  );
}

