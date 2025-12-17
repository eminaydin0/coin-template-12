import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Evet',
  cancelText = 'Hayır',
}: ConfirmModalProps) => {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [confirming, setConfirming] = useState(false);

  // ESC & Enter kısayolları + focus trap
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter') {
        e.preventDefault();
        doConfirm();
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'a,button,input,textarea,select,[tabindex]:not([tabindex="-1"])'
        );
        if (!focusable || !focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const doConfirm = () => {
    if (confirming) return;
    setConfirming(true);
    try {
      onConfirm();
    } finally {
      setConfirming(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-live="polite">
        {/* Backdrop */}
        <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onClose}
          aria-label="Pencereyi kapat"
        />

        {/* Modal */}
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-desc"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md rounded-2xl border overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Close Button */}
          <motion.button
            whileHover={reduceMotion ? undefined : { scale: 1.1 }}
            whileTap={reduceMotion ? undefined : { scale: 0.9 }}
            onClick={onClose}
            className="absolute right-4 top-4 z-10 rounded-xl p-2 text-gray-400 hover:text-white transition-colors"
            style={{
              background: 'rgba(75, 85, 99, 0.3)',
              border: '1px solid rgba(75, 85, 99, 0.4)',
            }}
            aria-label="Kapat"
          >
            <X className="h-5 w-5" />
          </motion.button>

          {/* Header with Icon */}
          <div 
            className="p-6 border-b text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.1) 100%)',
              borderColor: 'rgba(75, 85, 99, 0.3)',
            }}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 300 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.2) 100%)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                boxShadow: '0 4px 16px rgba(239, 68, 68, 0.2)',
              }}
            >
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </motion.div>
            <h3 id="confirm-title" className="text-xl font-black text-white mb-2">
              {title}
            </h3>
            <p id="confirm-desc" className="text-sm text-gray-300 leading-relaxed">
              {message}
            </p>
          </div>

          {/* Warning Badge */}
          <div className="p-5 text-center">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
              }}
            >
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-400 text-xs font-bold">Bu işlem geri alınamaz!</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-6 pt-0 flex gap-3">
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: 'rgba(75, 85, 99, 0.3)',
                border: '1px solid rgba(75, 85, 99, 0.4)',
              }}
            >
              {cancelText}
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={reduceMotion ? undefined : { scale: 1.02 }}
              whileTap={reduceMotion ? undefined : { scale: 0.98 }}
              onClick={doConfirm}
              disabled={confirming}
              className="flex-1 px-4 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: confirming 
                  ? 'rgba(75, 85, 99, 0.3)'
                  : 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.25) 100%)',
                border: confirming
                  ? '1px solid rgba(75, 85, 99, 0.4)'
                  : '1px solid rgba(239, 68, 68, 0.5)',
                boxShadow: confirming ? 'none' : '0 4px 16px rgba(239, 68, 68, 0.2)',
              }}
            >
              {confirming ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>İşleniyor...</span>
                </div>
              ) : (
                confirmText
              )}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;





