import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  CreditCard,
  Home,
  ChevronRight,
  ShoppingCart,
  Tag,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { getOrders } from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

interface Order {
  id: string;
  orderId: string;
  status: {
    text: string;
    color: string;
  };
  price: string;
  date: string;
}

// Get status info helper
const getStatusInfo = (statusText: string) => {
  switch (statusText) {
    case 'Ödeme Bekleniyor':
      return {
        text: 'Ödeme Bekleniyor',
        color: '#facc15',
        bgColor: 'rgba(234, 179, 8, 0.15)',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        icon: Clock
      };
    case 'Tamamlandı':
      return {
        text: 'Tamamlandı',
        color: '#4ade80',
        bgColor: 'rgba(34, 197, 94, 0.15)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        icon: CheckCircle
      };
    case 'İptal Edildi':
      return {
        text: 'İptal Edildi',
        color: '#f87171',
        bgColor: 'rgba(239, 68, 68, 0.15)',
        borderColor: 'rgba(239, 68, 68, 0.3)',
        icon: XCircle
      };
    default:
      return {
        text: statusText,
        color: '#9ca3af',
        bgColor: 'rgba(107, 114, 128, 0.15)',
        borderColor: 'rgba(107, 114, 128, 0.3)',
        icon: Clock
      };
  }
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Component mount olduğunda çalışacak
  useEffect(() => {
    const fetchOrders = async () => {
      if (!isAuthenticated) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await getOrders();
        setOrders(response.data || []);
      } catch (error) {
        console.error('Orders fetch error:', error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated]);

  // Storage event'ini dinle (login/logout için)
  useEffect(() => {
    const handleStorageChange = () => {
      // Storage değiştiğinde component'i yeniden render et
      window.location.reload();
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 relative overflow-hidden">
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
                    <span className="text-orange-300 font-semibold">Siparişlerim</span>
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
                          <ShoppingCart className="h-6 w-6 text-orange-400" />
                        </div>
                      </div>
                      
                      <div>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                          Siparişlerim
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                          Tüm siparişlerinizi buradan takip edebilirsiniz
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
                          SİPARİŞLERİM
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <section className="relative py-4">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="w-full">
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
                      <ShoppingCart className="h-12 w-12 text-orange-400/60" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3">
                      Siparişlerinizi görüntülemek için giriş yapın
                    </h3>
                    <p className="text-gray-400 text-lg mb-8">
                      Hesabınıza giriş yaparak siparişlerinizi takip edebilirsiniz.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link 
                        to="/giris-yap"
                        className="inline-flex items-center justify-center font-bold text-black py-3 px-6 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                      >
                        GİRİŞ YAP
                      </Link>
                      
                      <Link 
                        to="/kayit-ol"
                        className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all"
                        style={{
                          background: 'rgba(249, 115, 22, 0.2)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        KAYIT OL
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
          <CommonBackground />
          <LoadingSpinner 
            size="xl" 
            text="SİPARİŞLER YÜKLENİYOR..." 
            variant="gaming" 
          />
        </div>
      </>
    );
  }

  return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
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
                    <span className="text-orange-300 font-semibold">Siparişlerim</span>
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
                          <ShoppingCart className="h-6 w-6 text-orange-400" />
                        </div>
                      </div>
                      
                      <div>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                          Siparişlerim
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                          Tüm siparişlerinizi buradan takip edebilirsiniz
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
                          {orders.length} Sipariş
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          {/* Orders List or Empty State */}
          <section className="relative py-4">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="w-full">
                {orders.length === 0 ? (
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
                      <ShoppingCart className="h-12 w-12 text-orange-400/60" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3">
                      Henüz siparişiniz yok
                    </h3>
                    <p className="text-gray-400 text-lg mb-8">
                      İlk siparişinizi vermek için ürünlerimizi keşfedin ve sepetinize ekleyin.
                    </p>
                    
                    <Link 
                      to="/oyunlar"
                      className="inline-flex items-center gap-2 font-bold text-black py-3 px-6 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                    >
                      <Package className="h-5 w-5" />
                      <span>ÜRÜNLERİ KEŞFET</span>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order, index) => {
                      const statusInfo = getStatusInfo(order.status.text);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <OrderCard 
                          key={order.id} 
                          order={order} 
                          statusInfo={statusInfo} 
                          StatusIcon={StatusIcon}
                          index={index}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Call to Action Section */}
          <CallToActionSection />
        </div>
      </div>
    </>
  );
};

// Order Card Component
interface StatusInfo {
  text: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ComponentType<{ className?: string }>;
}

const OrderCard = ({ 
  order, 
  statusInfo, 
  StatusIcon,
  index
}: { 
  order: Order; 
  statusInfo: StatusInfo; 
  StatusIcon: React.ComponentType<{ className?: string }>;
  index: number;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <motion.div
        whileHover={{ y: -12, scale: 1.01 }}
        className="relative overflow-hidden transition-all duration-300"
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

        <div className="p-6 relative z-10">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4 mb-5">
            {/* Left: Order Info */}
            <div className="flex items-start gap-4 flex-1 min-w-0">
              {/* Order Icon - Enhanced */}
              <motion.div 
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.2))',
                  border: '2px solid rgba(249, 115, 22, 0.4)',
                  boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
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
                <Package className="h-7 w-7 text-orange-300 relative z-10" />
              </motion.div>
              
              {/* Order Details */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-black text-lg mb-2 leading-tight group-hover:text-orange-300 transition-colors">
                  Sipariş #{order.orderId}
                </h3>
                <div className="flex items-center gap-2 text-gray-300 text-sm font-medium">
                  <Calendar className="h-4 w-4 flex-shrink-0 text-orange-400" />
                  <span>{order.date}</span>
                </div>
              </div>
            </div>

            {/* Right: Status Badge - Enhanced */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold flex-shrink-0"
              style={{
                background: statusInfo.bgColor,
                border: `2px solid ${statusInfo.borderColor}`,
                boxShadow: isHovered ? `0 4px 16px ${statusInfo.borderColor}` : 'none',
              }}
              whileHover={{ scale: 1.05 }}
            >
              <StatusIcon className="h-5 w-5" style={{ color: statusInfo.color }} />
              <span style={{ color: statusInfo.color }}>{statusInfo.text}</span>
            </motion.div>
          </div>

          {/* Divider */}
          <div className="h-px mb-5" style={{ background: 'rgba(75, 85, 99, 0.3)' }}></div>

          {/* Bottom Row: Price and Payment */}
          <div className="flex items-center justify-between gap-4 mb-5">
            {/* Price - Enhanced */}
            <div className="flex-1">
              <motion.div 
                className="rounded-xl p-4 border relative overflow-hidden"
                style={{
                  background: isHovered
                    ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(251, 146, 60, 0.15))'
                    : 'rgba(249, 115, 22, 0.1)',
                  border: isHovered
                    ? '2px solid rgba(249, 115, 22, 0.4)'
                    : '1px solid rgba(249, 115, 22, 0.2)',
                  boxShadow: isHovered ? '0 4px 16px rgba(249, 115, 22, 0.2)' : 'none',
                }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-gray-300 text-xs font-bold uppercase tracking-wide">Toplam</span>
                  <span className="text-white font-black text-xl">{order.price}</span>
                </div>
              </motion.div>
            </div>

            {/* Payment Info - Enhanced */}
            <motion.div 
              className="flex items-center gap-2 px-4 py-3 rounded-xl flex-shrink-0" 
              style={{
                background: isHovered
                  ? 'rgba(75, 85, 99, 0.3)'
                  : 'rgba(75, 85, 99, 0.2)',
                border: '1px solid rgba(75, 85, 99, 0.3)',
              }}
              whileHover={{ scale: 1.05 }}
            >
              <CreditCard className="h-5 w-5 text-gray-300 flex-shrink-0" />
              <span className="text-gray-200 text-sm font-semibold whitespace-nowrap">Banka</span>
            </motion.div>
          </div>

          {/* Action Bar - Enhanced */}
          <div className="pt-5 border-t relative" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
            <motion.div
              className="flex items-center justify-between cursor-pointer"
              whileHover={{ x: 4 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sipariş Detayı</span>
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
                <span className="text-sm font-bold text-orange-300">Görüntüle</span>
                <Tag className="h-4 w-4 text-orange-300" />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrdersPage;





