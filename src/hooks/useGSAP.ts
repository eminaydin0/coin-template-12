import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook for GSAP animations
 * Provides easy access to GSAP with ScrollTrigger
 */
export const useGSAP = () => {
  const scopeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // GSAP animations can be added here
    }, scopeRef);

    return () => ctx.revert();
  }, []);

  return { scopeRef, gsap };
};

/**
 * Hook for scroll-triggered animations
 */
export const useScrollAnimation = (
  trigger: string | HTMLElement,
  animation: gsap.core.Tween | gsap.core.Timeline,
  options?: ScrollTrigger.Vars
) => {
  useEffect(() => {
    const scrollTrigger = ScrollTrigger.create({
      trigger,
      animation,
      start: 'top 80%',
      end: 'bottom 20%',
      toggleActions: 'play none none reverse',
      ...options,
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [trigger, animation, options]);
};

export default useGSAP;

