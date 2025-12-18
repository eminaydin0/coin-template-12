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
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#107C10]/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header - HeroSection Style */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
              <Sparkles className="h-5 w-5 text-[#107C10]" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">
                Nasıl Çalışır?
              </h3>
              <p className="text-gray-400 text-sm">
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

        {/* CTA Button - HeroSection Style */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <Link
            to="/rehber"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 font-semibold text-white text-sm transition-all duration-200 bg-[#107C10] hover:bg-[#0E6B0E]"
          >
            <span>Detaylı Rehberi İncele</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
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
            <ArrowRight className="h-5 w-5 text-[#107C10]/40" />
          </div>
        )}

        <motion.div 
          className="relative border p-6 h-full flex flex-col transition-all duration-200 bg-[#1A1A1A]"
          style={{
            border: isHovered
              ? '1px solid #107C10'
              : '1px solid #333333',
          }}
        >
          {/* Step Number Badge */}
          <div className="flex items-start justify-between mb-4">
            <motion.div 
              className="w-10 h-10 flex items-center justify-center text-white font-semibold text-base flex-shrink-0 bg-[#107C10]"
            >
              {step.id}
            </motion.div>

            {/* Icon Container */}
            <motion.div 
              className="w-10 h-10 flex items-center justify-center flex-shrink-0 bg-[#1A1A1A] border border-[#333333]"
              style={{
                border: isHovered ? '1px solid #107C10' : '1px solid #333333',
              }}
              whileHover={{ scale: 1.05 }}
            >
              <step.icon className="h-5 w-5 text-[#107C10]" />
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h3 
              className="text-white font-semibold text-base mb-2 transition-colors duration-200"
              style={{ color: isHovered ? '#107C10' : '#ffffff' }}
            >
              {step.title}
            </h3>
            {step.description && (
              <p className="text-gray-400 text-sm">
                {step.description}
              </p>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 pt-4 border-t border-[#333333]">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-[#1A1A1A] overflow-hidden">
                <motion.div
                  className="h-full bg-[#107C10] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: isHovered ? '100%' : `${(step.id / totalSteps) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-xs text-gray-500 font-semibold">
                {step.id}/{totalSteps}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
  );
};

export default HowItWorksSection;





