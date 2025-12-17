import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, ShieldCheck, Sparkles, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallToActionSectionProps {
  variant?: 'compact' | 'full';
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ variant = 'full' }) => {
  const content = (
    <div className="flex flex-col h-full">
      {/* Modern Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
            }}
          >
            <Headphones className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-1">
              Hâlâ Sorularınız mı Var?
            </h3>
            <p className="text-gray-400 text-sm font-medium">7/24 uzman ekibimiz yanınızda</p>
          </div>
        </div>
      </motion.div>

      {/* Features Grid - Modern */}
      <div className="grid grid-cols-3 gap-3 mb-6 flex-shrink-0">
        <motion.div 
          className="flex flex-col items-center gap-2 rounded-2xl border p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          whileHover={{ 
            y: -4,
            border: '1px solid rgba(249, 115, 22, 0.5)',
            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <ShieldCheck className="h-5 w-5 text-orange-400" />
          </motion.div>
          <p className="text-xs font-bold text-white text-center">Güvenli</p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-2 rounded-2xl border p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          whileHover={{ 
            y: -4,
            border: '1px solid rgba(249, 115, 22, 0.5)',
            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Sparkles className="h-5 w-5 text-orange-400" />
          </motion.div>
          <p className="text-xs font-bold text-white text-center">Hızlı</p>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center gap-2 rounded-2xl border p-4 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          whileHover={{ 
            y: -4,
            border: '1px solid rgba(249, 115, 22, 0.5)',
            boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-1"
            style={{
              background: 'rgba(249, 115, 22, 0.15)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Clock className="h-5 w-5 text-orange-400" />
          </motion.div>
          <p className="text-xs font-bold text-white text-center">7/24</p>
        </motion.div>
      </div>

      {/* Action Buttons - Modern */}
      <div className="flex flex-col gap-3 flex-1 justify-end">
        <Link to="/canli-destek" aria-label="Canlı Destek sayfasına git" className="group">
          <motion.button
            className="w-full relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-black text-white text-sm transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
              boxShadow: '0 4px 20px rgba(249, 115, 22, 0.5)',
            }}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: '0 8px 30px rgba(249, 115, 22, 0.7)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <MessageCircle className="h-5 w-5 relative z-10" />
            <span className="relative z-10">Canlı Destek</span>
          </motion.button>
        </Link>

        <Link to="/iletisim" aria-label="İletişim sayfasına git" className="group">
          <motion.button
            className="w-full relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-black text-white text-sm border transition-all"
            style={{
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.4)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.2)',
            }}
            whileHover={{ 
              scale: 1.02,
              border: '1px solid rgba(249, 115, 22, 0.6)',
              boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-500/10 to-transparent"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <Clock className="h-5 w-5 relative z-10" />
            <span className="relative z-10">İletişim</span>
          </motion.button>
        </Link>
      </div>
    </div>
  );

  // Ana sayfada compact variant kullanılıyorsa, sadece içeriği döndür
  if (variant === 'compact') {
    return content;
  }

  // Diğer sayfalarda full variant için container ve max-width ekle
  return (
    <section className="relative py-8">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div 
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            {content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;





