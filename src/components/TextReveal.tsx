import { useEffect, useRef, ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface TextRevealProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

/**
 * TextReveal Component
 * Beautiful text reveal animation using GSAP
 */
const TextReveal = ({
  children,
  delay = 0,
  duration = 1,
  className = '',
  direction = 'up',
}: TextRevealProps) => {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;

    const directions = {
      up: { y: 50, x: 0 },
      down: { y: -50, x: 0 },
      left: { y: 0, x: 50 },
      right: { y: 0, x: -50 },
    };

    const dir = directions[direction];

    gsap.fromTo(
      textRef.current,
      {
        opacity: 0,
        y: dir.y,
        x: dir.x,
        clipPath: 'inset(0 100% 0 0)',
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        clipPath: 'inset(0 0% 0 0)',
        duration,
        delay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [delay, duration, direction]);

  return (
    <div ref={textRef} className={className}>
      {children}
    </div>
  );
};

export default TextReveal;

