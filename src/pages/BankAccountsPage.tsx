import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  CreditCard,
  Copy,
  CheckCircle,
  Home,
  ChevronRight,
  CreditCard as CreditCardIcon,
  Sparkles
} from 'lucide-react';
import { useWebsite } from '../context/WebsiteContext';
import SEOHead from '../components/SEOHead';
import LoadingSpinner from '../components/LoadingSpinner';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const BankAccountsPage = () => {
  const { websiteData, refreshData } = useWebsite();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // Component mount olduğunda verileri yükle
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!websiteData || !websiteData.bankAccounts) {
          refreshData();
        }
      } catch (error) {
        console.error('Bank accounts fetch error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [websiteData, refreshData]);

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const bankAccounts = websiteData?.bankAccounts || [];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
        <CommonBackground />
        <LoadingSpinner 
          size="xl" 
          text="Banka Hesapları Yükleniyor..." 
          variant="gaming" 
        />
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
                <span className="text-orange-300 font-semibold">Banka Hesapları</span>
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
                      <CreditCardIcon className="h-6 w-6 text-orange-400" />
                    </div>
                  </div>
                  
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                      Banka Hesapları
                    </h1>
                    <p className="text-gray-400 text-sm font-medium">
                      Güvenli ödeme için banka hesap bilgileri
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
                      {bankAccounts.length} HESAP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts List */}
        <section className="relative py-4">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              {bankAccounts.length === 0 ? (
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
                    <CreditCardIcon className="h-12 w-12 text-orange-400/60" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-3">
                    Banka hesabı bulunamadı
                  </h3>
                  <p className="text-gray-400 text-lg">Yakında yeni banka hesapları eklenecektir.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {bankAccounts.map((account, index) => (
                  <BankAccountCard
                    key={index}
                    account={account}
                    index={index}
                    copiedIndex={copiedIndex}
                    onCopy={copyToClipboard}
                  />
                ))}
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

// Bank Account Card Component
interface BankAccount {
  name: string;
  iban: string;
}

interface BankAccountCardProps {
  account: BankAccount;
  index: number;
  copiedIndex: number | null;
  onCopy: (text: string, index: number) => void;
}

const BankAccountCard = ({ account, index, copiedIndex, onCopy }: BankAccountCardProps) => {
  const isCopied = copiedIndex === index;
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
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
              <CreditCard className="h-7 w-7 text-orange-300 relative z-10" />
            </motion.div>
            
            {/* Badge */}
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
              BANKA
            </motion.div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col space-y-4">
            {/* Title & Description - Enhanced */}
            <div className="space-y-2">
              <motion.h3 
                className="text-white font-black text-lg mb-1 leading-tight transition-colors line-clamp-2"
                style={{ color: isHovered ? 'rgb(251, 146, 60)' : 'rgb(255, 255, 255)' }}
              >
                {account.name}
              </motion.h3>
              <p className="text-gray-400 text-sm leading-relaxed font-medium">
                Güvenli banka hesabı ile hızlı ödeme yapabilirsiniz.
              </p>
            </div>

            {/* IBAN Display - Premium Design */}
            <motion.div 
              className="rounded-xl p-5 border relative overflow-hidden group/iban"
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
                  IBAN
                </p>
              </div>
              
              {/* IBAN Value */}
              <div className="relative z-10">
                <p className="text-white font-black text-base break-all leading-relaxed font-mono">
                  {account.iban}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-2 right-2 w-8 h-8 opacity-20">
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-orange-400 rounded-tr-lg" />
              </div>
            </motion.div>

            {/* Action Button - Premium Design */}
            <div className="mt-auto pt-4 border-t relative" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
              <motion.button
                onClick={() => onCopy(account.iban, index)}
                className="relative overflow-hidden rounded-xl p-4 w-full cursor-pointer"
                style={{
                  background: isCopied
                    ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(22, 163, 74, 0.2))'
                    : isHovered
                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.2))'
                    : 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                  border: isCopied
                    ? '2px solid rgba(34, 197, 94, 0.5)'
                    : isHovered
                    ? '2px solid rgba(249, 115, 22, 0.5)'
                    : '1px solid rgba(249, 115, 22, 0.3)',
                  boxShadow: isHovered 
                    ? '0 8px 24px rgba(249, 115, 22, 0.3)' 
                    : '0 4px 12px rgba(249, 115, 22, 0.15)',
                }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {/* Background Animation */}
                {!isCopied && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: isHovered ? '100%' : '-100%' }}
                    transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }}
                  />
                )}
                
                <div className="flex items-center justify-center gap-2 relative z-10">
                  {isCopied ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-green-300 font-black text-sm">Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-5 w-5 text-orange-200" />
                      <span className="text-orange-200 font-black text-sm">Kopyala</span>
                    </>
                  )}
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BankAccountsPage;





