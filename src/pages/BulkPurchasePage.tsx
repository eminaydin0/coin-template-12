import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  DollarSign, 
  Package, 
  Home,
  ChevronRight,
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactForm from '../components/ContactForm';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const BulkPurchasePage = () => {
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
                <span className="text-orange-300 font-semibold">Toplu Satın Alım</span>
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
                      <ShoppingBag className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                      Toplu Satın Alım
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                      Büyük miktarlarda oyun parası ve PIN satın alımı
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
                      BÜYÜK MİKTARLAR
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Purchase Features List */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: DollarSign,
                  title: "Uygun Fiyat",
                  description: "Büyük miktarlarda alım yaparak en uygun fiyatlardan yararlanın",
                  features: ["Özel indirimler", "Toplu alım avantajları"],
                  badge: "UYGUN"
                },
                {
                  icon: Package,
                  title: "Hızlı Teslimat",
                  description: "Toplu alımlarınız için özel hızlı teslimat seçenekleri",
                  features: ["Anında teslim", "Özel kargo hizmeti"],
                  badge: "HIZLI"
                },
                {
                  icon: Users,
                  title: "Özel Destek",
                  description: "Toplu alım müşterilerimiz için özel destek ekibi",
                  features: ["7/24 destek", "Özel müşteri hizmetleri"],
                  badge: "ÖZEL"
                }
              ].map((feature, index) => (
                <BulkFeatureCard key={index} feature={feature} />
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div 
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
              <div className="p-6 sm:p-8 lg:p-10">
                <ContactForm
                  title="Toplu Satın Alım"
                  description="Büyük miktarlarda oyun parası ve PIN satın alımı için talebinizi gönderin. Size en uygun fiyatları sunacağız."
                  method="Toptan Alım"
                  backLink="/"
                  backText="Ana sayfaya dön"
                />
              </div>
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

// Bulk Feature Card Component
interface BulkFeature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  features: string[];
  badge: string;
}

interface BulkFeatureCardProps {
  feature: BulkFeature;
}

const BulkFeatureCard = ({ feature }: BulkFeatureCardProps) => {
  const Icon = feature.icon;
  const [isHovered, setIsHovered] = React.useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        whileHover={{ y: -12, scale: 1.02 }}
        className="relative overflow-hidden transition-all duration-300 h-full flex flex-col rounded-2xl"
        style={{
          background: isHovered
            ? 'linear-gradient(135deg, rgba(17, 24, 39, 0.98) 0%, rgba(31, 41, 55, 0.95) 100%)'
            : 'linear-gradient(135deg, rgba(17, 24, 39, 0.9) 0%, rgba(31, 41, 55, 0.8) 100%)',
          border: isHovered
            ? '2px solid rgba(249, 115, 22, 0.6)'
            : '1px solid rgba(75, 85, 99, 0.3)',
          backdropFilter: 'blur(12px)',
          boxShadow: isHovered
            ? '0 25px 80px rgba(249, 115, 22, 0.4), 0 0 60px rgba(249, 115, 22, 0.2)'
            : '0 8px 32px rgba(0, 0, 0, 0.4)',
          borderRadius: '24px',
        }}
      >
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
          <div className="flex items-center justify-between gap-3 mb-4">
            {/* Icon - Enhanced */}
            <motion.div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
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
              <Icon className="h-7 w-7 text-orange-300 relative z-10" />
            </motion.div>
            
            {/* Badge - Enhanced */}
            <motion.div 
              className="px-3 py-1.5 rounded-xl text-xs font-bold flex-shrink-0"
              style={{
                background: isHovered
                  ? 'rgba(249, 115, 22, 0.25)'
                  : 'rgba(249, 115, 22, 0.2)',
                border: isHovered
                  ? '2px solid rgba(249, 115, 22, 0.5)'
                  : '1px solid rgba(249, 115, 22, 0.35)',
                color: 'rgba(249, 115, 22, 0.95)',
                boxShadow: isHovered ? '0 4px 16px rgba(249, 115, 22, 0.2)' : 'none',
              }}
              whileHover={{ scale: 1.05 }}
            >
              {feature.badge}
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Title & Description - Enhanced */}
            <div className="space-y-2">
              <motion.h3 
                className="text-white font-black text-lg mb-1 leading-tight transition-colors"
                style={{ color: isHovered ? 'rgb(251, 146, 60)' : 'rgb(255, 255, 255)' }}
              >
                {feature.title}
              </motion.h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {feature.description}
              </p>
            </div>

            {/* Features List - Premium */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                <span className="text-xs font-bold text-orange-400/60 uppercase tracking-wider">Özellikler</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              </div>
              
              {feature.features.map((item, idx) => (
                <motion.div 
                  key={idx} 
                  className="flex items-start gap-3 group/feature"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                >
                  {/* Icon Container */}
                  <motion.div 
                    className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 relative overflow-hidden"
                    style={{
                      background: isHovered
                        ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.3), rgba(251, 146, 60, 0.25))'
                        : 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                    }}
                    whileHover={{ scale: 1.15, rotate: 5 }}
                    animate={{
                      boxShadow: isHovered 
                        ? '0 0 12px rgba(249, 115, 22, 0.4)' 
                        : '0 0 4px rgba(249, 115, 22, 0.2)',
                    }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-orange-400/40 to-transparent"
                      animate={{
                        scale: isHovered ? [1, 1.3, 1] : 1,
                        opacity: isHovered ? [0.4, 0.7, 0.4] : 0.3,
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                    />
                    <motion.div 
                      className="w-2 h-2 rounded-full relative z-10"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                        boxShadow: '0 0 6px rgba(249, 115, 22, 0.8)',
                      }}
                      animate={{
                        scale: isHovered ? [1, 1.2, 1] : 1,
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.15 }}
                    />
                  </motion.div>
                  
                  {/* Feature Text */}
                  <div className="flex-1 pt-0.5">
                    <span className="text-gray-300 text-sm leading-relaxed font-medium group-hover/feature:text-orange-200 transition-colors">
                      {item}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BulkPurchasePage;





