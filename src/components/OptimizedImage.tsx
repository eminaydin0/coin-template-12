import { useState, useEffect, useRef, ImgHTMLAttributes } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'loading'> {
  src: string;
  alt: string;
  placeholder?: string;
  fallback?: React.ReactNode;
  className?: string;
  priority?: boolean; // If true, loads immediately (for above-the-fold images)
  blurDataURL?: string; // Base64 encoded blur placeholder
}

/**
 * OptimizedImage Component
 * - Lazy loading by default
 * - Blur placeholder support
 * - Error handling with fallback
 * - Smooth loading animations
 * - Intersection Observer for performance
 */
const OptimizedImage = ({
  src,
  alt,
  placeholder,
  fallback,
  className = '',
  priority = false,
  blurDataURL,
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Priority images load immediately
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before image enters viewport
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [priority, isInView]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
  };

  // Fallback component
  const defaultFallback = (
    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center">
      <div className="text-center">
        <svg
          className="w-12 h-12 text-orange-300/50 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <span className="text-gray-400 text-xs">Görsel yüklenemedi</span>
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Blur Placeholder */}
      {blurDataURL && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            opacity: 0.5,
          }}
        />
      )}

      {/* Placeholder */}
      {placeholder && !isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${placeholder})`,
            opacity: 0.3,
          }}
        />
      )}

      {/* Loading Skeleton */}
      {!isLoaded && !hasError && !blurDataURL && !placeholder && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}

      {/* Error Fallback */}
      {hasError && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
          >
            {fallback || defaultFallback}
          </motion.div>
        </AnimatePresence>
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <AnimatePresence>
          <motion.img
            ref={imgRef}
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={handleLoad}
            onError={handleError}
            initial={{ opacity: 0 }}
            animate={{ opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            {...props}
          />
        </AnimatePresence>
      )}

      {/* Loading Indicator (optional) */}
      {!isLoaded && !hasError && isInView && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500 rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;

