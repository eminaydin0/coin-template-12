import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Enhanced Button Component with Micro-interactions
 * - Smooth hover effects
 * - Click feedback (ripple effect)
 * - Loading states
 * - Icon support
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) => {
  const baseClasses = 'relative font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden group';
  
  const variantClasses = {
    primary: 'text-black bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50',
    secondary: 'text-white bg-gray-700 hover:bg-gray-600 shadow-md hover:shadow-lg',
    outline: 'text-orange-400 border-2 border-orange-500 hover:bg-orange-500/10 hover:border-orange-400',
    ghost: 'text-gray-300 hover:text-orange-300 hover:bg-orange-500/10',
    danger: 'text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 hover:shadow-red-500/50',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${fullWidth ? 'w-full' : ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      whileHover={!isDisabled ? { 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!isDisabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      onMouseEnter={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = variant === 'primary' 
            ? '0 12px 32px rgba(249, 115, 22, 0.5)' 
            : e.currentTarget.style.boxShadow;
        }
      }}
      onMouseLeave={(e) => {
        if (!isDisabled) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = variant === 'primary'
            ? '0 8px 24px rgba(249, 115, 22, 0.4)'
            : e.currentTarget.style.boxShadow;
        }
      }}
      {...props}
    >
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
        }}
      />

      {/* Ripple effect on click */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
        }}
        whileTap={{
          scale: [1, 2],
          opacity: [0, 0.5, 0],
        }}
        transition={{ duration: 0.4 }}
      />

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {isLoading ? (
          <>
            <motion.div
              className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            />
            <span>Yükleniyor...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            <span>{children}</span>
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </span>
    </motion.button>
  );
};

export default Button;

