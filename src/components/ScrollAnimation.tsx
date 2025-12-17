import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollAnimationProps {
  children: ReactNode;
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'rotate';
  delay?: number;
  duration?: number;
  start?: string;
  end?: string;
  className?: string;
  once?: boolean;
}

/**
 * ScrollAnimation Component
 * Wraps children with scroll-triggered GSAP animations
 */
const ScrollAnimation = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.3,
  start = 'top 80%',
  end = 'bottom 20%',
  className = '',
  once = true,
}: ScrollAnimationProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    // Animation configurations
    const animations = {
      fadeIn: {
        from: { opacity: 0 },
        to: { opacity: 1 },
      },
      slideUp: {
        from: { opacity: 0, y: 50 },
        to: { opacity: 1, y: 0 },
      },
      slideLeft: {
        from: { opacity: 0, x: 50 },
        to: { opacity: 1, x: 0 },
      },
      slideRight: {
        from: { opacity: 0, x: -50 },
        to: { opacity: 1, x: 0 },
      },
      scale: {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
      },
      rotate: {
        from: { opacity: 0, rotation: -10 },
        to: { opacity: 1, rotation: 0 },
      },
    };

    const anim = animations[animation];

    // Set initial state
    gsap.set(element, anim.from);

    // Create scroll trigger animation
    const scrollTrigger = ScrollTrigger.create({
      trigger: element,
      start,
      end,
      animation: gsap.to(element, {
        ...anim.to,
        duration,
        delay,
        ease: 'power2.out',
      }),
      toggleActions: once ? 'play none none none' : 'play none none reverse',
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [animation, delay, duration, start, end, once]);

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  );
};

export default ScrollAnimation;

