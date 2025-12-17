import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseScrollRevealOptions {
  trigger?: string | HTMLElement;
  start?: string;
  end?: string;
  toggleActions?: string;
  once?: boolean;
  stagger?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  duration?: number;
  delay?: number;
}

/**
 * Hook for scroll-triggered reveal animations
 */
export const useScrollReveal = (options: UseScrollRevealOptions = {}) => {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const {
      trigger,
      start = 'top 85%',
      end = 'bottom 20%',
      toggleActions = 'play none none none',
      once = true,
      stagger = 0,
      direction = 'up',
      duration = 1,
      delay = 0,
    } = options;

    const directions = {
      up: { y: 60, x: 0 },
      down: { y: -60, x: 0 },
      left: { y: 0, x: 60 },
      right: { y: 0, x: -60 },
    };

    const dir = directions[direction];
    const target = trigger || elementRef.current;

    // If multiple children, animate each
    const children = elementRef.current.children.length > 0
      ? Array.from(elementRef.current.children)
      : [elementRef.current];

    children.forEach((child, index) => {
      gsap.fromTo(
        child as HTMLElement,
        {
          opacity: 0,
          y: dir.y,
          x: dir.x,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          duration,
          delay: delay + index * stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: target,
            start,
            end,
            toggleActions,
            once,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === target) {
          trigger.kill();
        }
      });
    };
  }, [options]);

  return elementRef;
};

export default useScrollReveal;

