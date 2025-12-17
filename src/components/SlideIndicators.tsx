import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface SlideIndicatorsProps {
  heroList: unknown[];
  currentIndex: number;
  onSlideChange: (index: number) => void;
}

const SlideIndicators = ({ heroList, currentIndex, onSlideChange }: SlideIndicatorsProps) => {
  const indicatorsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!indicatorsRef.current) return;

    const indicators = Array.from(indicatorsRef.current.children) as HTMLElement[];

    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        gsap.to(indicator, {
          width: 32,
          scale: 1.2,
          boxShadow: '0 0 12px rgba(249, 115, 22, 0.8)',
          background: 'rgba(249, 115, 22, 1)',
          duration: 0.4,
          ease: "back.out(2)",
        });
      } else {
        gsap.to(indicator, {
          width: 8,
          scale: 1,
          boxShadow: 'none',
          background: 'rgba(255, 255, 255, 0.3)',
          duration: 0.4,
          ease: "power2.out",
        });
      }
    });
  }, [currentIndex]);

  return (
    <div ref={indicatorsRef} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
      {heroList.map((_, index) => (
        <button
          key={index}
          onClick={() => onSlideChange(index)}
          className="rounded-full h-2 transition-all"
          style={{
            background: index === currentIndex
              ? 'rgba(249, 115, 22, 1)'
              : 'rgba(255, 255, 255, 0.3)',
          }}
          onMouseEnter={(e) => {
            if (index !== currentIndex) {
              gsap.to(e.currentTarget, {
                scale: 1.5,
                background: 'rgba(249, 115, 22, 0.6)',
                duration: 0.2,
              });
            }
          }}
          onMouseLeave={(e) => {
            if (index !== currentIndex) {
              gsap.to(e.currentTarget, {
                scale: 1,
                background: 'rgba(255, 255, 255, 0.3)',
                duration: 0.2,
              });
            }
          }}
          aria-label={`Slide ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default SlideIndicators;

