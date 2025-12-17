import { motion } from 'framer-motion';

interface SkeletonLoaderProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'game-card' | 'avatar' | 'button';
  width?: string | number;
  height?: string | number;
  className?: string;
  count?: number;
  animation?: 'pulse' | 'wave' | 'shimmer';
}

/**
 * SkeletonLoader - Modern skeleton loading component
 * Provides smooth loading animations for content placeholders
 */
const SkeletonLoader = ({
  variant = 'rectangular',
  width,
  height,
  className = '',
  count = 1,
  animation = 'shimmer',
}: SkeletonLoaderProps) => {
  // Animation variants
  const animationVariants = {
    pulse: {
      animate: {
        opacity: [0.5, 1, 0.5],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
    wave: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
      },
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
      style: {
        background: 'linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%)',
        backgroundSize: '200% 100%',
      },
    },
    shimmer: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
      },
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: 'linear',
      },
      style: {
        background: 'linear-gradient(90deg, #1a1a1a 0%, #2d2d2d 20%, #1a1a1a 40%, #1a1a1a 100%)',
        backgroundSize: '200% 100%',
      },
    },
  };

  const selectedAnimation = animationVariants[animation];

  // Base skeleton styles
  const baseClasses = 'bg-gray-800 rounded';

  // Variant-specific styles
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-lg h-48',
    'game-card': 'rounded-lg h-64',
    avatar: 'rounded-full w-12 h-12',
    button: 'rounded-lg h-10',
  };

  const variantStyle = {
    text: { width: width || '100%', height: height || '1rem' },
    circular: { width: width || '3rem', height: height || '3rem' },
    rectangular: { width: width || '100%', height: height || '3rem' },
    card: { width: width || '100%', height: height || '12rem' },
    'game-card': { width: width || '100%', height: height || '16rem' },
    avatar: { width: width || '3rem', height: height || '3rem' },
    button: { width: width || '8rem', height: height || '2.5rem' },
  };

  const skeletonContent = (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{
        ...variantStyle[variant],
        ...selectedAnimation.style,
      }}
      animate={selectedAnimation.animate}
      transition={selectedAnimation.transition}
      role="status"
      aria-label="Yükleniyor"
    />
  );

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }).map((_, index) => (
          <motion.div
            key={index}
            className={`${baseClasses} ${variantClasses[variant]} ${className}`}
            style={{
              ...variantStyle[variant],
              ...selectedAnimation.style,
            }}
            animate={selectedAnimation.animate}
            transition={{
              ...selectedAnimation.transition,
              delay: index * 0.1,
            }}
            role="status"
            aria-label="Yükleniyor"
          />
        ))}
      </div>
    );
  }

  return skeletonContent;
};

/**
 * Pre-built skeleton components for common use cases
 */

// Game Card Skeleton
export const GameCardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-orange-500/20 ${className}`}>
    <SkeletonLoader variant="game-card" className="w-full" />
    <div className="p-4 space-y-3">
      <SkeletonLoader variant="text" width="80%" height="1.25rem" />
      <SkeletonLoader variant="text" width="60%" height="1rem" />
      <div className="flex gap-2 mt-4">
        <SkeletonLoader variant="button" width="6rem" />
        <SkeletonLoader variant="button" width="4rem" />
      </div>
    </div>
  </div>
);

// Product Card Skeleton
export const ProductCardSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`bg-black/20 backdrop-blur-sm rounded-lg overflow-hidden border border-orange-500/20 ${className}`}>
    <SkeletonLoader variant="card" className="w-full" />
    <div className="p-4 space-y-2">
      <SkeletonLoader variant="text" width="90%" />
      <SkeletonLoader variant="text" width="70%" />
      <SkeletonLoader variant="text" width="50%" height="0.875rem" />
    </div>
  </div>
);

// Text Skeleton (for paragraphs)
export const TextSkeleton = ({ lines = 3, className = '' }: { lines?: number; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    <SkeletonLoader variant="text" count={lines} />
  </div>
);

// Avatar Skeleton
export const AvatarSkeleton = ({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg'; className?: string }) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  return <SkeletonLoader variant="avatar" className={`${sizes[size]} ${className}`} />;
};

// List Item Skeleton
export const ListItemSkeleton = ({ className = '' }: { className?: string }) => (
  <div className={`flex items-center gap-4 ${className}`}>
    <SkeletonLoader variant="avatar" />
    <div className="flex-1 space-y-2">
      <SkeletonLoader variant="text" width="60%" />
      <SkeletonLoader variant="text" width="40%" height="0.875rem" />
    </div>
  </div>
);

// Table Skeleton
export const TableSkeleton = ({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) => (
  <div className="space-y-2">
    {/* Header */}
    <div className="flex gap-4">
      {Array.from({ length: cols }).map((_, i) => (
        <SkeletonLoader key={`header-${i}`} variant="text" width="100%" height="1.5rem" />
      ))}
    </div>
    {/* Rows */}
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div key={`row-${rowIndex}`} className="flex gap-4">
        {Array.from({ length: cols }).map((_, colIndex) => (
          <SkeletonLoader key={`cell-${rowIndex}-${colIndex}`} variant="text" width="100%" />
        ))}
      </div>
    ))}
  </div>
);

// Grid Skeleton (for game/product grids)
export const GridSkeleton = ({
  items = 8,
  variant = 'game-card',
  className = '',
}: {
  items?: number;
  variant?: 'game-card' | 'card';
  className?: string;
}) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
    {Array.from({ length: items }).map((_, index) =>
      variant === 'game-card' ? (
        <GameCardSkeleton key={index} />
      ) : (
        <ProductCardSkeleton key={index} />
      )
    )}
  </div>
);

export default SkeletonLoader;

