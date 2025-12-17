import { Link } from 'react-router-dom';
import { 
  CheckCircle, 
  Gamepad2, 
  ShoppingCart, 
  CreditCard, 
  Download,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  const steps = [
    { 
      id: 1, 
      title: "Hesap Oluştur", 
      description: "Hızlı ve kolay kayıt",
      icon: CheckCircle
    },
    { 
      id: 2, 
      title: "Oyun Seç", 
      description: "Binlerce oyun arasından seç",
      icon: Gamepad2
    },
    { 
      id: 3, 
      title: "Sepete Ekle", 
      description: "Favorilerini sepete ekle",
      icon: ShoppingCart
    },
    { 
      id: 4, 
      title: "Ödeme Yap", 
      description: "Güvenli ödeme sistemi",
      icon: CreditCard
    },
    { 
      id: 5, 
      title: "Kodunu Al", 
      description: "Anında kod teslimatı",
      icon: Download
    }
  ];

  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
                  border: '1px solid rgba(249, 115, 22, 0.3)',
                  boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
                }}
              >
                <Sparkles className="h-6 w-6 text-orange-400" />
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                Nasıl Çalışır?
              </h3>
              <p className="text-gray-400 text-sm font-medium">
                5 kolay adımda oyunlarınızı alın ve oynamaya başlayın
              </p>
            </div>
          </div>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <StepCard step={step} index={index} totalSteps={steps.length} />
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Link
            to="/rehber"
            className="group relative inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl font-black text-white text-sm transition-all overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
              boxShadow: '0 4px 20px rgba(249, 115, 22, 0.5)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(249, 115, 22, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(249, 115, 22, 0.5)';
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 1 }}
            />
            <span className="relative z-10">Detaylı Rehberi İncele</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform relative z-10" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const StepCard = ({ step, index, totalSteps }: { 
  step: { 
    id: number; 
    title: string; 
    description?: string;
    icon: any;
  }; 
  index: number; 
  totalSteps: number 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
      <motion.div 
        className="group relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* Connection Arrow for Desktop */}
        {step.id < totalSteps && (
          <div className="hidden lg:block absolute top-1/2 -right-3 z-20">
            <ArrowRight className="h-5 w-5 text-orange-400/40" />
          </div>
        )}

        <motion.div 
          className="relative rounded-2xl border p-6 h-full flex flex-col transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: isHovered
              ? '1px solid rgba(249, 115, 22, 0.5)'
              : '1px solid rgba(75, 85, 99, 0.3)',
            boxShadow: isHovered
              ? '0 20px 60px rgba(249, 115, 22, 0.3)'
              : '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {/* Step Number Badge */}
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg flex-shrink-0"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
              }}
            >
              {step.id}
            </motion.div>

            {/* Icon Container */}
            <motion.div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
              style={{
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.2))'
                  : 'rgba(249, 115, 22, 0.15)',
                border: isHovered
                  ? '1px solid rgba(249, 115, 22, 0.5)'
                  : '1px solid rgba(249, 115, 22, 0.3)',
                boxShadow: isHovered
                  ? '0 8px 24px rgba(249, 115, 22, 0.3)'
                  : '0 2px 8px rgba(249, 115, 22, 0.15)',
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-transparent"
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <step.icon className="h-7 w-7 text-orange-300 relative z-10" />
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h3 
              className="text-white font-black text-lg mb-2 transition-colors duration-300"
              style={{ color: isHovered ? 'rgb(251, 146, 60)' : 'rgb(255, 255, 255)' }}
            >
              {step.title}
            </h3>
            {step.description && (
              <p className="text-gray-400 text-sm font-medium">
                {step.description}
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-gray-700/50 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: isHovered ? '100%' : `${(step.id / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-500 font-bold">
                {step.id}/{totalSteps}
              </span>
            </div>
          </div>

          {/* Shine Effect on Hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none rounded-2xl"
            initial={{ x: '-100%' }}
            animate={{ x: isHovered ? '100%' : '-100%' }}
            transition={{ duration: 0.6 }}
          />
        </motion.div>
      </motion.div>
  );
};

export default HowItWorksSection;





