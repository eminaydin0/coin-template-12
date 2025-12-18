import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Clock, ShieldCheck, Sparkles, Headphones, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface CallToActionSectionProps {
  variant?: 'compact' | 'full';
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ variant = 'full' }) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const content = (
    <div className="relative overflow-hidden">
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(16, 124, 16, 0.3) 0%, transparent 70%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      <div className="relative z-10">
        {/* Header - Asymmetric Design */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-start gap-4">
            <motion.div 
              className="relative w-16 h-16 flex items-center justify-center bg-[#1A1A1A] border-2 border-[#107C10]"
              style={{
                clipPath: 'polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)',
              }}
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <Headphones className="h-8 w-8 text-[#107C10]" />
              <motion.div
                className="absolute inset-0 bg-[#107C10]/20"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              />
            </motion.div>
            <div className="flex-1">
              <motion.h3 
                className="text-2xl font-bold text-white mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Hâlâ Sorularınız mı Var?
              </motion.h3>
              <motion.p 
                className="text-gray-400 text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                7/24 uzman ekibimiz yanınızda. Anında yanıt alın!
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Features - Diagonal Layout with Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: ShieldCheck, label: 'Güvenli', desc: 'SSL Şifreli', color: '#107C10' },
            { icon: Zap, label: 'Hızlı', desc: 'Anında Yanıt', color: '#14B814' },
            { icon: Clock, label: '7/24', desc: 'Kesintisiz', color: '#107C10' },
          ].map((feature, index) => (
            <motion.div
              key={index}
              className="relative group"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <motion.div
                className="relative p-5 bg-[#1A1A1A] border border-[#333333] h-full flex flex-col items-center text-center transition-all duration-300"
                style={{
                  clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
                }}
                whileHover={{
                  borderColor: feature.color,
                  y: -5,
                  boxShadow: `0 10px 30px ${feature.color}40`,
                }}
              >
                {/* Corner Accents */}
                <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none">
                  <div 
                    className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2"
                    style={{ 
                      borderColor: hoveredCard === index ? feature.color : '#107C10/60',
                      clipPath: 'polygon(0 0, 12px 0, 0 12px)' 
                    }} 
                  />
                </div>
                <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none">
                  <div 
                    className="absolute top-0 right-0 w-full h-full border-t-2 border-r-2"
                    style={{ 
                      borderColor: hoveredCard === index ? feature.color : '#107C10/60',
                      clipPath: 'polygon(calc(100% - 12px) 0, 100% 0, 100% 12px)' 
                    }} 
                  />
                </div>

                {/* Icon with Pulse Effect */}
                <motion.div
                  className="relative w-14 h-14 flex items-center justify-center mb-3 bg-[#1A1A1A] border border-[#333333]"
                  style={{
                    clipPath: 'polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)',
                  }}
                  animate={{
                    borderColor: hoveredCard === index ? [feature.color, '#107C10', feature.color] : '#333333',
                  }}
                  transition={{ duration: 1.5, repeat: hoveredCard === index ? Infinity : 0 }}
                >
                  <feature.icon className="h-7 w-7" style={{ color: feature.color }} />
                  {hoveredCard === index && (
                    <motion.div
                      className="absolute inset-0 border-2"
                      style={{ borderColor: feature.color }}
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <h4 className="text-white font-bold text-sm mb-1">{feature.label}</h4>
                <p className="text-gray-500 text-xs">{feature.desc}</p>

                {/* Diagonal Stripe on Hover */}
                {hoveredCard === index && (
                  <motion.div
                    className="absolute bottom-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#107C10] to-transparent"
                    style={{ width: '60%' }}
                    initial={{ width: 0 }}
                    animate={{ width: '60%' }}
                    exit={{ width: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons - Modern Design with Icons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/canli-destek" aria-label="Canlı Destek sayfasına git" className="flex-1 group">
            <motion.button
              className="w-full relative overflow-hidden inline-flex items-center justify-center gap-3 px-6 py-4 font-bold text-white text-sm transition-all duration-300 bg-[#107C10] hover:bg-[#0E6B0E]"
              style={{
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <MessageCircle className="h-5 w-5" />
              </motion.div>
              <span>Canlı Destek</span>
              <motion.div
                className="absolute right-4"
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.button>
          </Link>

          <Link to="/iletisim" aria-label="İletişim sayfasına git" className="flex-1 group">
            <motion.button
              className="w-full relative overflow-hidden inline-flex items-center justify-center gap-3 px-6 py-4 font-bold text-white text-sm border-2 transition-all duration-300 bg-[#1A1A1A] border-[#107C10] hover:bg-[#107C10]/10 hover:border-[#14B814]"
              style={{
                clipPath: 'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Clock className="h-5 w-5" />
              <span>İletişim</span>
              <motion.div
                className="absolute right-4"
                initial={{ x: -10, opacity: 0 }}
                whileHover={{ x: 0, opacity: 1 }}
              >
                <ArrowRight className="h-4 w-4" />
              </motion.div>
            </motion.button>
          </Link>
        </div>

        {/* Floating Stats */}
        <motion.div
          className="mt-6 flex items-center justify-center gap-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-[#107C10]" />
            <span className="text-gray-400 text-xs">Ortalama Yanıt Süresi: <span className="text-[#107C10] font-bold">2 dk</span></span>
          </div>
          <div className="w-px h-4 bg-[#333333]" />
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#107C10]" />
            <span className="text-gray-400 text-xs">Memnuniyet: <span className="text-[#107C10] font-bold">%98</span></span>
          </div>
        </motion.div>
      </div>
    </div>
  );

  // Ana sayfada compact variant kullanılıyorsa, sadece içeriği döndür
  if (variant === 'compact') {
    return content;
  }

  // Diğer sayfalarda full variant için homepage stili container
  return (
    <section className="relative">
      <div className="w-full bg-black" style={{ border: '1px solid #333333' }}>
        <div className="p-4 sm:p-6 lg:p-8">
          {content}
        </div>
      </div>
    </section>
  );
};

export default CallToActionSection;





