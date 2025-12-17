import { useEffect, useRef } from 'react';
import gsap from 'gsap';

interface FloatingElementsProps {
  count?: number;
  color?: string;
  size?: { min: number; max: number };
  speed?: { min: number; max: number };
  className?: string;
}

/**
 * FloatingElements Component
 * Creates beautiful floating particles/elements with GSAP animations
 */
const FloatingElements = ({
  count = 20,
  color = 'rgba(249, 115, 22, 0.4)',
  size = { min: 2, max: 6 },
  speed = { min: 3, max: 6 },
  className = '',
}: FloatingElementsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const particles = Array.from(containerRef.current.children);

    particles.forEach((particle, i) => {
      const duration = speed.min + Math.random() * (speed.max - speed.min);
      const xDistance = (Math.random() - 0.5) * 300;
      const yDistance = (Math.random() - 0.5) * 300;
      const rotation = Math.random() * 360;

      // Initial random position
      gsap.set(particle, {
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        opacity: Math.random() * 0.5 + 0.2,
      });

      // Floating animation
      gsap.to(particle, {
        x: `+=${xDistance}`,
        y: `+=${yDistance}`,
        rotation: `+=${rotation}`,
        opacity: Math.random() * 0.5 + 0.3,
        duration,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.1,
      });

      // Pulsing glow effect
      gsap.to(particle, {
        scale: 1.5,
        opacity: 0.6,
        duration: duration * 0.5,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        delay: i * 0.15,
      });
    });
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${size.min + Math.random() * (size.max - size.min)}px`,
            height: `${size.min + Math.random() * (size.max - size.min)}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            background: color,
            boxShadow: `0 0 ${Math.random() * 15 + 5}px ${color}`,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;

