import { forwardRef, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  showPasswordToggle?: boolean;
  fullWidth?: boolean;
}

/**
 * Enhanced Input Component with Validation Feedback
 * - Real-time validation states
 * - Visual feedback (error/success)
 * - Smooth animations
 * - Password toggle support
 */
const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  success,
  helperText,
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  fullWidth = false,
  className = '',
  type,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);

  const inputType = showPasswordToggle && type === 'password' 
    ? (showPassword ? 'text' : 'password')
    : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const hasError = !!error;
  const hasSuccess = success && !hasError;
  const isActive = isFocused || hasValue;

  return (
    <div className={`space-y-1.5 ${fullWidth ? 'w-full' : ''}`}>
      {/* Label */}
      {label && (
        <label className="block text-sm font-medium text-gray-300">
          {label}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none z-10">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <motion.input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-2.5 rounded-lg
            bg-black/30 backdrop-blur-sm
            border-2 transition-all duration-300
            text-white placeholder-gray-500
            focus:outline-none
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || showPasswordToggle ? 'pr-10' : ''}
            ${hasError 
              ? 'border-red-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20' 
              : hasSuccess
              ? 'border-green-500 focus:border-green-400 focus:ring-2 focus:ring-green-500/20'
              : 'border-gray-600 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20'
            }
            ${isActive ? 'bg-black/40' : ''}
            ${className}
          `}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          whileFocus={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Right Icons */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10">
          {/* Success Icon */}
          <AnimatePresence>
            {hasSuccess && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error Icon */}
          <AnimatePresence>
            {hasError && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <AlertCircle className="w-5 h-5 text-red-500" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-300 transition-colors p-1"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          )}

          {/* Custom Right Icon */}
          {rightIcon && !hasError && !hasSuccess && !showPasswordToggle && (
            <div className="text-gray-400 pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Focus Indicator */}
        <motion.div
          className={`absolute inset-0 rounded-lg pointer-events-none ${
            hasError 
              ? 'bg-red-500/5' 
              : hasSuccess
              ? 'bg-green-500/5'
              : 'bg-orange-500/5'
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isFocused ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />
      </div>

      {/* Helper Text / Error Message */}
      <AnimatePresence>
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`text-xs ${
              hasError ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {error || helperText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

