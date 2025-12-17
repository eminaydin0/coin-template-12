import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Home,
  ChevronRight,
  Headphones,
  Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const ContactPage = () => {
  const [loading, setLoading] = useState(true);
  const { getInfoValue } = useWebsite();

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const contactPhone = getInfoValue('CONTACT_PHONE');
  const contactEmail = getInfoValue('CONTACT_EMAIL');
  const contactAddress = getInfoValue('CONTACT_ADDRESS');

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <CommonBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoadingSpinner 
            size="xl" 
            text="İletişim Yükleniyor..." 
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
                <span className="text-orange-300 font-semibold">İletişim</span>
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
                      <Headphones className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                      İletişim & Destek
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                      7/24 müşteri desteği ile yanınızdayız
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
                      7/24 DESTEK
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              {(!contactPhone && !contactEmail && !contactAddress) ? (
                <div 
                  className="text-center py-24 rounded-2xl"
                  style={{
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center mx-auto mb-6">
                    <Headphones className="h-12 w-12 text-orange-400/60" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    İletişim bilgileri bulunamadı
                  </h3>
                  <p className="text-gray-400 text-lg">Yakında iletişim bilgileri eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {contactPhone && (
                <ContactCard
                  icon={Phone}
                  title="Telefon Desteği"
                  description="7/24 müşteri hizmetleri ile yanınızdayız"
                  contact={contactPhone}
                  contactLabel="Arama Yapın"
                  badgeText="TELEFON"
                  features={[
                    'Anında yanıt garantisi',
                    'Profesyonel destek ekibi',
                    'Türkçe müşteri hizmetleri'
                  ]}
                  buttonText="Hemen Ara"
                  buttonIcon={Phone}
                />
              )}

              {contactEmail && (
                <ContactCard
                  icon={Mail}
                  title="E-posta Desteği"
                  description="24 saat içinde detaylı yanıt alın"
                  contact={contactEmail}
                  contactLabel="E-posta Gönderin"
                  badgeText="E-POSTA"
                  features={[
                    'Detaylı yanıt garantisi',
                    'Teknik destek ekibi',
                    'Dosya ekleme imkanı'
                  ]}
                  buttonText="E-posta Gönder"
                  buttonIcon={Mail}
                />
              )}

              {contactAddress && (
                <ContactCard
                  icon={MapPin}
                  title="Ofis Adresi"
                  description="Merkez ofisimiz ve operasyon merkezi"
                  contact={contactAddress}
                  contactLabel="Ziyaret Edin"
                  badgeText="OFİS"
                  features={[
                    'Profesyonel ekip merkezi',
                    'Güvenli ve modern ofis',
                    'Kolay ulaşım imkanı'
                  ]}
                  buttonText="Konumu Gör"
                  buttonIcon={MapPin}
                />
              )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <CallToActionSection /> 
      </div>
    </div>
  );
};

// Contact Card Component
interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  contact: string;
  contactLabel: string;
  badgeText: string;
  features: string[];
  buttonText: string;
  buttonIcon: LucideIcon;
}

const ContactCard = ({
  icon: Icon,
  title,
  description,
  contact,
  contactLabel,
  badgeText,
  features,
  buttonText,
  buttonIcon: ButtonIcon
}: ContactCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

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
        className="relative overflow-hidden transition-all duration-300 h-full flex flex-col"
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
              {badgeText}
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col space-y-5">
            {/* Title & Description - Enhanced */}
            <div className="space-y-2">
              <motion.h3 
                className="text-white font-black text-xl mb-1 leading-tight transition-colors"
                style={{ color: isHovered ? 'rgb(251, 146, 60)' : 'rgb(255, 255, 255)' }}
              >
                {title}
              </motion.h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                {description}
              </p>
            </div>

            {/* Contact Info - Premium Design */}
            <motion.div 
              className="rounded-xl p-5 border relative overflow-hidden group/contact"
              style={{
                background: isHovered
                  ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.2))'
                  : 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                border: isHovered
                  ? '2px solid rgba(249, 115, 22, 0.5)'
                  : '1px solid rgba(249, 115, 22, 0.3)',
                boxShadow: isHovered 
                  ? '0 8px 24px rgba(249, 115, 22, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)' 
                  : '0 4px 12px rgba(249, 115, 22, 0.15)',
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              transition={{ duration: 0.2 }}
            >
              {/* Background Glow */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                animate={{
                  opacity: isHovered ? [0.3, 0.6, 0.3] : 0.2,
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              
              {/* Label */}
              <div className="flex items-center gap-2 mb-3 relative z-10">
                <motion.div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                    boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
                  }}
                  animate={{
                    scale: isHovered ? [1, 1.4, 1] : 1,
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <p className="text-orange-300 text-xs font-bold uppercase tracking-wider">
                  {contactLabel}
                </p>
              </div>
              
              {/* Contact Value */}
              <div className="relative z-10">
                <p className="text-white font-black text-base break-all leading-relaxed">
                  {contact}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-2 right-2 w-8 h-8 opacity-20">
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400 rounded-tr-lg" />
              </div>
            </motion.div>

            {/* Features - Premium List */}
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                <span className="text-xs font-bold text-orange-400/60 uppercase tracking-wider">Özellikler</span>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
              </div>
              
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  className="flex items-start gap-3 group/feature"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
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
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
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
                      transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.15 }}
                    />
                  </motion.div>
                  
                  {/* Feature Text */}
                  <div className="flex-1 pt-0.5">
                    <span className="text-gray-300 text-sm leading-relaxed font-medium group-hover/feature:text-orange-200 transition-colors">
                      {feature}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Button - Premium Design */}
            <div className="mt-auto pt-6 border-t relative" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
              <motion.div
                className="relative overflow-hidden rounded-xl p-4 cursor-pointer"
                style={{
                  background: isHovered
                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.2))'
                    : 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                  border: isHovered
                    ? '2px solid rgba(249, 115, 22, 0.5)'
                    : '1px solid rgba(249, 115, 22, 0.3)',
                  boxShadow: isHovered 
                    ? '0 8px 24px rgba(249, 115, 22, 0.3)' 
                    : '0 4px 12px rgba(249, 115, 22, 0.15)',
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                {/* Background Animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovered ? '100%' : '-100%' }}
                  transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }}
                />
                
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {buttonText}
                    </span>
                    <span className="text-sm font-black text-orange-300">
                      Hemen İletişime Geç
                    </span>
                  </div>
                  
                  <motion.div 
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
                    style={{
                      background: 'rgba(249, 115, 22, 0.3)',
                      border: '1px solid rgba(249, 115, 22, 0.5)',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ButtonIcon className="h-5 w-5 text-orange-200" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ContactPage;





