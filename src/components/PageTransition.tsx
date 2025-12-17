import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * PageTransition Component
 * Smooth page transitions using GSAP
 */
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLocationRef = useRef(location.pathname);

  useEffect(() => {
    if (!containerRef.current) return;

    // Only animate if pathname changed
    if (prevLocationRef.current !== location.pathname) {
      const container = containerRef.current;

      // Exit animation
      gsap.to(container, {
        opacity: 0,
        y: -30,
        scale: 0.98,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          // Reset position for enter animation
          gsap.set(container, {
            opacity: 0,
            y: 30,
            scale: 0.98,
          });

          // Enter animation
          gsap.to(container, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power3.out',
          });
        },
      });
    }

    prevLocationRef.current = location.pathname;
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="page-transition-container">
      {children}
    </div>
  );
};

export default PageTransition;

