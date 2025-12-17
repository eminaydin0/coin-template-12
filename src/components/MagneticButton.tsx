import { useRef, useEffect, ReactNode, MouseEvent } from 'react';
import gsap from 'gsap';

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  className?: string;
  onClick?: () => void;
  [key: string]: unknown;
}

/**
 * MagneticButton Component
 * Button that follows mouse cursor with magnetic effect
 */
const MagneticButton = ({
  children,
  strength = 0.3,
  className = '',
  onClick,
  ...props
}: MagneticButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const xTo = useRef<gsap.QuickTo>();
  const yTo = useRef<gsap.QuickTo>();

  useEffect(() => {
    if (!buttonRef.current) return;

    xTo.current = gsap.quickTo(buttonRef.current, 'x', {
      duration: 1,
      ease: 'power3.out',
    });

    yTo.current = gsap.quickTo(buttonRef.current, 'y', {
      duration: 1,
      ease: 'power3.out',
    });
  }, []);

  const handleMouseMove = (e: MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || !xTo.current || !yTo.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    xTo.current(x * strength);
    yTo.current(y * strength);
  };

  const handleMouseLeave = () => {
    if (!xTo.current || !yTo.current) return;
    xTo.current(0);
    yTo.current(0);
  };

  return (
    <button
      ref={buttonRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default MagneticButton;

