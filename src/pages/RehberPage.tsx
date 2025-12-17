import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CreditCard, 
  ShoppingCart, 
  Download, 
  CheckCircle, 
  Gamepad2,
  Home,
  ChevronRight,
  ArrowRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const RehberPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Hesap Oluştur",
      description: "İlk olarak sitemize üye olun veya mevcut hesabınızla giriş yapın.",
      icon: CheckCircle,
      details: [
        "Sağ üst köşedeki 'Kayıt Ol' butonuna tıklayın",
        "Gerekli bilgileri doldurun",
        "E-posta doğrulaması yapın",
        "Hesabınız aktif hale gelir"
      ]
    },
    {
      id: 2,
      title: "Oyun Kategorisini Seç",
      description: "Aradığınız oyunu kategoriler arasından bulun.",
      icon: Gamepad2,
      details: [
        "Ana menüden 'Oyunlar' sekmesine tıklayın",
        "İstediğiniz oyun kategorisini seçin",
        "Oyun listesini inceleyin",
        "Fiyat ve özelliklerini karşılaştırın"
      ]
    },
    {
      id: 3,
      title: "Ürünü Sepete Ekle",
      description: "Beğendiğiniz ürünü sepetinize ekleyin.",
      icon: ShoppingCart,
      details: [
        "Ürün detay sayfasında özellikleri inceleyin",
        "'Sepete Ekle' butonuna tıklayın",
        "Miktar seçimi yapın",
        "Sepetinizi kontrol edin"
      ]
    },
    {
      id: 4,
      title: "Ödeme Yap",
      description: "Güvenli ödeme yöntemleriyle siparişinizi tamamlayın.",
      icon: CreditCard,
      details: [
        "Sepet sayfasından 'Ödemeye Geç' butonuna tıklayın",
        "Ödeme bilgilerinizi girin",
        "Banka transferi veya EFT ile ödeme yapın",
        "Ödeme onayını bekleyin"
      ]
    },
    {
      id: 5,
      title: "Kodunuzu Alın",
      description: "Ödeme onaylandıktan sonra oyun kodunuz teslim edilir.",
      icon: Download,
      details: [
        "Ödeme onaylandıktan sonra",
        "E-posta adresinize kod gönderilir",
        "Hesabınızdan siparişlerinizi takip edin",
        "Anında teslimat garantisi"
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CommonBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoadingSpinner 
            size="xl" 
            text="Rehber Yükleniyor..." 
            variant="gaming" 
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
      <SEOHead />
      
      {/* Common Background */}
      <CommonBackground />

      {/* Background Glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full relative z-10">
        {/* Header Section - CategoryDetailPage Stili */}
        <div className="w-full mb-10 px-4 sm:px-6 lg:px-8">
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
              {/* Breadcrumb */}
              <div className="flex items-center flex-wrap gap-2 text-sm mb-6 relative z-10">
                <Link 
                  to="/" 
                  className="flex items-center gap-1.5 text-gray-400 hover:text-orange-400 transition-colors group"
                >
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Ana Sayfa</span>
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-600" />
                <span className="text-orange-300 font-semibold">Rehber</span>
              </div>

              {/* Title Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
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
                      <BookOpen className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                      Rehber
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                      5 kolay adımda oyunlarınızı alın
                    </p>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="flex items-center gap-3">
                  <div
                    className="px-4 py-2 rounded-xl flex items-center gap-2"
                    style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-300 text-sm font-bold">
                      {steps.length} Adım
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {steps.map((step) => (
                  <StepCard key={step.id} step={step} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <CallToActionSection />
      </div>
    </div>
  );
};

// Step Card Component
interface Step {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

interface StepCardProps {
  step: Step;
}

const StepCard = ({ step }: StepCardProps) => {
  const Icon = step.icon;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: step.id * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        className="relative overflow-hidden transition-all duration-300 h-full flex flex-col"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)',
          border: isHovered
            ? '2px solid rgba(249, 115, 22, 0.6)'
            : '1px solid rgba(75, 85, 99, 0.3)',
          boxShadow: isHovered
            ? '0 25px 80px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(12px)',
          borderRadius: '24px',
        }}
      >
        {/* Animated Border Glow */}
        <motion.div
          className="absolute inset-0 rounded-[24px]"
          style={{
            background: isHovered
              ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(251, 146, 60, 0.2), rgba(249, 115, 22, 0.3))'
              : 'transparent',
            padding: '2px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
          animate={{
            opacity: isHovered ? [0.5, 1, 0.5] : 0,
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Top Accent Line */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-1"
          style={{
            background: isHovered
              ? 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.8), rgba(251, 146, 60, 0.8), rgba(249, 115, 22, 0.8), transparent)'
              : 'linear-gradient(90deg, transparent, rgba(249, 115, 22, 0.3), transparent)',
          }}
          animate={{
            backgroundPosition: isHovered ? ['0%', '100%', '0%'] : '0%',
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Shine Effect */}
        <motion.div
          className="absolute inset-0 z-10 pointer-events-none"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 0.8 }}
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
          }}
        />

        {/* Corner Accents */}
        <div className="absolute top-0 left-0 w-20 h-20 opacity-20">
          <div className="absolute top-2 left-2 w-12 h-12 border-t-2 border-l-2 border-orange-400 rounded-tl-lg" />
        </div>
        <div className="absolute bottom-0 right-0 w-20 h-20 opacity-20">
          <div className="absolute bottom-2 right-2 w-12 h-12 border-b-2 border-r-2 border-orange-400 rounded-br-lg" />
        </div>

        <div className="p-6 flex-1 flex flex-col relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-5">
            {/* Step Number Badge - Enhanced */}
            <motion.div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                border: '2px solid rgba(249, 115, 22, 0.4)',
                boxShadow: isHovered
                  ? '0 8px 24px rgba(249, 115, 22, 0.5), 0 0 20px rgba(249, 115, 22, 0.3)'
                  : '0 4px 16px rgba(249, 115, 22, 0.3)',
              }}
              whileHover={{ scale: 1.1, rotate: 5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="relative z-10">{step.id}</span>
            </motion.div>
            
            {/* Icon - Enhanced */}
            <motion.div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
              style={{
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.2))'
                  : 'rgba(249, 115, 22, 0.15)',
                border: isHovered
                  ? '2px solid rgba(249, 115, 22, 0.5)'
                  : '1px solid rgba(249, 115, 22, 0.3)',
                boxShadow: isHovered
                  ? '0 8px 24px rgba(249, 115, 22, 0.3)'
                  : '0 2px 8px rgba(249, 115, 22, 0.15)',
              }}
              whileHover={{ scale: 1.1, rotate: -5 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-transparent"
                animate={{
                  scale: isHovered ? [1, 1.2, 1] : 1,
                  opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Icon className="h-8 w-8 text-orange-300 relative z-10" />
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col space-y-5">
            {/* Title & Description */}
            <div>
              <motion.h3 
                className="text-white font-black text-xl mb-3 leading-tight transition-colors"
                style={{ color: isHovered ? 'rgb(251, 146, 60)' : 'rgb(255, 255, 255)' }}
              >
                {step.title}
              </motion.h3>
              <p className="text-gray-300 text-sm leading-relaxed font-medium">
                {step.description}
              </p>
            </div>

            {/* Details List - Enhanced */}
            <div className="space-y-3 flex-1">
              {step.details.map((detail, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: step.id * 0.1 + index * 0.05 }}
                >
                  <motion.div 
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                      boxShadow: '0 0 8px rgba(249, 115, 22, 0.5)',
                    }}
                    animate={{
                      scale: isHovered ? [1, 1.3, 1] : 1,
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
                  />
                  <span className="text-gray-300 text-sm leading-relaxed font-medium">{detail}</span>
                </motion.div>
              ))}
            </div>

            {/* Action Button - Enhanced */}
            <div className="mt-auto pt-5 border-t relative" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
              <motion.div
                className="flex items-center justify-between cursor-pointer"
                whileHover={{ x: 4 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Adım {step.id}</span>
                <motion.div 
                  className="flex items-center gap-2 px-4 py-2 rounded-lg"
                  style={{
                    background: isHovered 
                      ? 'rgba(249, 115, 22, 0.2)' 
                      : 'rgba(249, 115, 22, 0.1)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="text-sm font-bold text-orange-300">Detay</span>
                  <ArrowRight className="h-4 w-4 text-orange-300" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RehberPage;






