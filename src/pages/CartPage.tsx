import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Trash2, 
  CreditCard,
  Shield,
  Gamepad2,
  Plus,
  Minus,
  Package,
  Home,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ConfirmModal from '../components/ConfirmModal';
import CheckoutModal from '../components/CheckoutModal';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';

const CartPage = () => {
  const { cart, loading, removeItem, clearCart, updateItemQuantity, getTotal: getCartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [updatingItem, setUpdatingItem] = useState<string | null>(null);
  const [showClearModal, setShowClearModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Component mount kontrolü
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const parsePrice = (priceString: string): number => {
    if (!priceString) return 0;
    
    // Önce ₺ işaretini ve boşlukları kaldır
    let cleanPrice = priceString.replace('₺', '').replace(/\s/g, '');
    
    // Binlik ayırıcı noktaları kaldır (örn: 1.325,00 -> 1325,00)
    cleanPrice = cleanPrice.replace(/\./g, '');
    
    // Virgülü noktaya çevir (1325,00 -> 1325.00)
    cleanPrice = cleanPrice.replace(',', '.');
    
    const parsed = parseFloat(cleanPrice);
    return isNaN(parsed) ? 0 : parsed;
  };

  // API'den gelen fiyatın birim fiyat mı toplam fiyat mı olduğunu kontrol et
  // Eğer API toplam fiyat döndürüyorsa, birim fiyatı hesapla
  // Eğer API birim fiyat döndürüyorsa, doğrudan kullan
  // API'den gelen fiyatın birim fiyat mı toplam fiyat mı olduğunu tespit et
  const getUnitPrice = (price: string, quantity: number): number => {
    const parsedPrice = parsePrice(price);
    
    // Eğer quantity 1'den büyükse ve fiyat quantity ile çarpıldığında makul bir değer çıkıyorsa
    // bu muhtemelen toplam fiyattır
    if (quantity > 1) {
      // Fiyatın makul bir birim fiyat olup olmadığını kontrol et
      // Örnek: 1700 ÷ 2 = 850 (makul birim fiyat)
      const potentialUnitPrice = parsedPrice / quantity;
      if (potentialUnitPrice >= 50 && potentialUnitPrice <= 5000) {
        console.log(`getUnitPrice - Toplam fiyat tespit edildi: ${parsedPrice} ÷ ${quantity} = ${potentialUnitPrice}`);
        return potentialUnitPrice;
      }
    }
    
    console.log(`getUnitPrice - Birim fiyat olarak kabul edildi: ${parsedPrice}`);
    return parsedPrice;
  };

  // Toplam fiyatı hesapla (birim fiyat × miktar)
  const calculateItemTotal = (price: string, quantity: number): string => {
    const unitPrice = getUnitPrice(price, quantity);
    const total = unitPrice * quantity;
    console.log(`calculateItemTotal - Birim: ${unitPrice}, Quantity: ${quantity}, Total: ${total}`);
    return `₺${total.toFixed(2).replace('.', ',')}`;
  };

  const formatUnitPrice = (price: string, quantity: number): string => {
    const unitPrice = getUnitPrice(price, quantity);
    return `₺${unitPrice.toFixed(2).replace('.', ',')}`;
  };

  const getTotalQuantity = (): number => {
    return cart.reduce((total, item) => total + item.piece, 0);
  };

  // CartContext'teki getTotal fonksiyonunu kullan
  const getTotal = (): string => {
    return getCartTotal();
  };

  const handleRemoveItem = async (basketId: string) => {
    setUpdatingItem(basketId);
    await removeItem(basketId);
    setUpdatingItem(null);
  };

  const handleClearCart = async () => {
    setShowClearModal(true);
  };

  const handleConfirmClearCart = async () => {
    await clearCart();
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/giris-yap');
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleQuantityUpdate = async (basketId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    setUpdatingItem(basketId);
    await updateItemQuantity(basketId, newQuantity);
    setUpdatingItem(null);
  };

  // Component mount olana kadar bekle
  if (!isMounted) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen relative overflow-hidden">
          <CommonBackground />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoadingSpinner 
              size="xl" 
              text="YÜKLENİYOR..." 
              variant="gaming" 
            />
          </div>
        </div>
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 relative overflow-hidden">
          <CommonBackground />
          
          <div className="w-full relative z-10">
            {/* Header Section */}
            <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
              <div className="w-full">
                <div 
                  className="rounded-2xl p-6"
                  style={{
                    background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                    border: '1px solid rgba(75, 85, 99, 0.3)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {/* Breadcrumb */}
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs mb-4">
                    <Link 
                      to="/" 
                      className="flex items-center gap-1 text-gray-400 hover:text-orange-300 transition-colors"
                    >
                      <Home className="h-3.5 w-3.5" />
                      <span>Ana Sayfa</span>
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                    <span className="text-gray-300 font-medium">Sepetim</span>
                  </div>

                  {/* Title Section */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{
                          background: 'rgba(249, 115, 22, 0.15)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <ShoppingCart className="h-4 w-4 text-orange-300" />
                      </div>
                      <h1 className="text-xl sm:text-2xl font-bold text-white">
                        <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                          Sepetim
                        </span>
                      </h1>
                    </div>

                    {/* Badge */}
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                        style={{
                          background: 'rgba(249, 115, 22, 0.15)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          color: 'rgba(249, 115, 22, 0.95)',
                          backdropFilter: 'blur(8px)',
                        }}
                      >
                        {cart.length} ÜRÜN
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Not Authenticated Message */}
            <section className="relative py-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="w-full">
                  <div 
                    className="text-center py-20 rounded-xl border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <ShoppingCart className="h-16 w-16 text-orange-300/50 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Sepeti görüntülemek için giriş yapın
                    </h3>
                    <p className="text-gray-400 text-base mb-8">Hesabınıza giriş yaparak sepetinizi yönetebilirsiniz.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link 
                        to="/giris-yap" 
                        className="inline-flex items-center justify-center px-6 py-3 font-bold text-black rounded-xl transition-all bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                      >
                        <span>GİRİŞ YAP</span>
                      </Link>
                      
                      <Link 
                        to="/kayit-ol" 
                        className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white rounded-lg transition-all"
                        style={{
                          background: 'rgba(249, 115, 22, 0.2)',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                        }}
                      >
                        <span>KAYIT OL</span>
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
        <div className="min-h-screen relative overflow-hidden">
          <CommonBackground />
          <div className="relative z-10 flex items-center justify-center min-h-screen">
            <LoadingSpinner 
              size="xl" 
              text="SEPET YÜKLENİYOR..." 
              variant="gaming" 
            />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead />
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        {/* Common Background */}
        <CommonBackground />
        
        <div className="w-full relative z-10">
          {/* Header Section */}
          <div className="w-full mb-8 px-4 sm:px-6 lg:px-8">
            <div className="w-full">
              <div 
                className="rounded-2xl p-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
              >
                {/* Breadcrumb */}
                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs mb-4">
                  <Link 
                    to="/" 
                    className="flex items-center gap-1 text-gray-400 hover:text-orange-300 transition-colors"
                  >
                    <Home className="h-3.5 w-3.5" />
                    <span>Ana Sayfa</span>
                  </Link>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-600" />
                  <span className="text-gray-300 font-medium">Sepetim</span>
                </div>

                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <ShoppingCart className="h-4 w-4 text-orange-300" />
                    </div>
                    <h1 className="text-xl sm:text-2xl font-bold text-white">
                      <span className="bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
                        Sepetim
                      </span>
                    </h1>
                  </div>

                  {/* Badge */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        color: 'rgba(249, 115, 22, 0.95)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      {cart.length} ÜRÜN
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {cart.length === 0 ? (
            <section className="relative py-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="w-full">
                  <div 
                    className="text-center py-20 rounded-xl border"
                    style={{
                      background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    <ShoppingCart className="h-16 w-16 text-orange-300/50 mx-auto mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-3">
                      Sepetiniz boş
                    </h3>
                    <p className="text-gray-400 text-base mb-8">
                      Sepetinizde henüz ürün bulunmuyor. Hemen alışverişe başlayın!
                    </p>
                    
                    <Link to="/oyunlar">
                      <motion.div
                        className="inline-flex items-center gap-3 font-bold text-black py-4 px-8 rounded-xl transition-all duration-300 bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)]"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <ShoppingCart className="h-5 w-5" />
                        <span>ALIŞVERİŞE BAŞLA</span>
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="relative py-8">
              <div className="px-4 sm:px-6 lg:px-8">
                <div className="w-full">
                  <div className="flex flex-col lg:flex-row gap-8 relative z-10">
                    {/* Cart Items - Left Side - Modern Grid Layout */}
                    <div className="flex-1">
                      {/* Header with Stats */}
                      <div className="mb-6">
                        <div
                          className="relative rounded-2xl border p-6"
                          style={{
                            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                            border: '1px solid rgba(75, 85, 99, 0.3)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                          }}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div 
                                className="w-12 h-12 rounded-xl flex items-center justify-center"
                                style={{
                                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(234, 88, 12, 0.2) 100%)',
                                  border: '1px solid rgba(249, 115, 22, 0.4)',
                                }}
                              >
                                <ShoppingCart className="h-6 w-6 text-orange-300" />
                              </div>
                              
                              <div>
                                <h2 className="text-white font-black text-xl mb-1">
                                  Sepetim
                                </h2>
                                <div className="flex items-center gap-3 text-xs">
                                  <span className="text-gray-400">{cart.length} ürün</span>
                                  <span className="text-gray-600">•</span>
                                  <span className="text-gray-400">{getTotalQuantity()} adet</span>
                                </div>
                              </div>
                            </div>

                            <motion.button
                              onClick={handleClearCart}
                              className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-300"
                              style={{
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.15) 100%)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.2)',
                              }}
                              whileHover={{ scale: 1.05, boxShadow: '0 6px 16px rgba(239, 68, 68, 0.3)' }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                              <span className="text-red-400 font-bold text-sm">
                                TÜMÜNÜ SİL
                              </span>
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Cart Items - Modern Card Design */}
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div
                            key={item.id}
                            className="group"
                          >
                            <div
                              className="relative rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.01]"
                              style={{
                                background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                                border: '1px solid rgba(75, 85, 99, 0.3)',
                                backdropFilter: 'blur(10px)',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                              }}
                            >
                              <div className="flex flex-col sm:flex-row">
                                {/* Product Image - Larger */}
                                <div className="relative w-full sm:w-32 h-48 sm:h-32 flex-shrink-0">
                                  <div className="relative w-full h-full overflow-hidden">
                                    {item.url ? (
                                      <img 
                                        src={item.url} 
                                        alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {
                                          const target = e.currentTarget as HTMLElement;
                                          target.style.display = 'none';
                                          const fallback = target.nextElementSibling as HTMLElement;
                                          if (fallback) fallback.style.display = 'flex';
                                        }}
                                      />
                                    ) : null}
                                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center" style={{ display: item.url ? 'none' : 'flex' }}>
                                      <Gamepad2 className="h-16 w-16 text-orange-300/50" />
                                    </div>
                                  </div>
                                  {/* Gradient Overlay */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-transparent to-transparent pointer-events-none" />
                                </div>
                                
                                {/* Product Info & Controls */}
                                <div className="flex-1 p-5 flex flex-col justify-between">
                                  <div className="mb-4">
                                    <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight group-hover:text-orange-300 transition-colors mb-2">
                                      {item.name}
                                    </h3>
                                    <div className="flex items-center gap-4 text-sm">
                                      <span className="text-gray-400">
                                        {formatUnitPrice(item.price, item.piece)} × {item.piece}
                                      </span>
                                    </div>
                                  </div>

                                  <div className="flex items-center justify-between gap-4 pt-4 border-t" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                                    {/* Price */}
                                    <div>
                                      <p className="text-gray-400 text-xs mb-1">Toplam</p>
                                      <p className="text-2xl font-black text-white">{calculateItemTotal(item.price, item.piece)}</p>
                                    </div>

                                    {/* Controls */}
                                    <div className="flex items-center gap-3">
                                      {/* Quantity Controls */}
                                      <div className="flex items-center rounded-xl border" style={{ background: 'rgba(0, 0, 0, 0.5)', borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                                        <button
                                          onClick={() => handleQuantityUpdate(item.basketId, item.piece - 1)}
                                          disabled={updatingItem === item.basketId || item.piece <= 1}
                                          className="w-9 h-9 rounded-l-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center hover:bg-orange-500/20"
                                          style={{
                                            background: 'rgba(249, 115, 22, 0.15)',
                                            border: 'none',
                                          }}
                                        >
                                          <Minus className="h-4 w-4 text-orange-300" />
                                        </button>
                                        <span className="w-12 text-center text-white font-bold text-sm px-2">
                                          {updatingItem === item.basketId ? (
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-300 mx-auto"></div>
                                          ) : (
                                            item.piece
                                          )}
                                        </span>
                                        <button
                                          onClick={() => handleQuantityUpdate(item.basketId, item.piece + 1)}
                                          disabled={updatingItem === item.basketId}
                                          className="w-9 h-9 rounded-r-xl disabled:opacity-50 transition-all duration-300 flex items-center justify-center hover:bg-orange-500/20"
                                          style={{
                                            background: 'rgba(249, 115, 22, 0.15)',
                                            border: 'none',
                                          }}
                                        >
                                          <Plus className="h-4 w-4 text-orange-300" />
                                        </button>
                                      </div>
                                      
                                      {/* Remove Button */}
                                      <button
                                        onClick={() => handleRemoveItem(item.basketId)}
                                        disabled={updatingItem === item.basketId}
                                        className="w-10 h-10 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center hover:bg-red-500/20"
                                        style={{
                                          background: 'rgba(239, 68, 68, 0.15)',
                                          border: '1px solid rgba(239, 68, 68, 0.3)',
                                        }}
                                      >
                                        {updatingItem === item.basketId ? (
                                          <div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                          <Trash2 className="h-5 w-5 text-red-400" />
                                        )}
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Summary - Right Side - Modern Design */}
                    <div className="w-full lg:w-96 lg:sticky lg:top-24 lg:self-start">
                      <div 
                        className="relative rounded-2xl border overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                          border: '1px solid rgba(75, 85, 99, 0.3)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        {/* Header with Icon */}
                        <div 
                          className="p-6 border-b relative overflow-hidden"
                          style={{
                            borderColor: 'rgba(75, 85, 99, 0.3)',
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(234, 88, 12, 0.05) 100%)',
                          }}
                        >
                          <div className="flex items-center gap-4 relative z-10">
                            <div 
                              className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{
                                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(234, 88, 12, 0.2) 100%)',
                                border: '1px solid rgba(249, 115, 22, 0.4)',
                                boxShadow: '0 4px 16px rgba(249, 115, 22, 0.2)',
                              }}
                            >
                              <Package className="h-7 w-7 text-orange-300" />
                            </div>
                            <div>
                              <h3 className="text-white font-black text-xl mb-1">Sipariş Özeti</h3>
                              <p className="text-orange-300/80 text-xs font-medium">{cart.length} ürün • {getTotalQuantity()} adet</p>
                            </div>
                          </div>
                        </div>

                        {/* Summary Details */}
                        <div className="p-6 space-y-5">
                          {/* Summary Items */}
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm font-medium">Ara Toplam</span>
                              <span className="text-white font-bold text-base">{getTotal()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-400 text-sm font-medium">İndirim</span>
                              <span className="text-red-400 font-bold text-base">₺0,00</span>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="h-px" style={{ background: 'rgba(75, 85, 99, 0.3)' }}></div>

                          {/* Total - Prominent */}
                          <div 
                            className="rounded-xl p-5"
                            style={{
                              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)',
                              border: '1px solid rgba(249, 115, 22, 0.3)',
                              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.15)',
                            }}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-orange-300 font-black text-base">Genel Toplam</span>
                              <span className="text-3xl font-black text-white">{getTotal()}</span>
                            </div>
                            <p className="text-gray-400 text-xs text-right">KDV Dahil</p>
                          </div>

                          {/* Checkout Button - Large */}
                          <motion.button
                            onClick={handleCheckout}
                            className="w-full font-black text-black py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base"
                            style={{
                              background: 'linear-gradient(135deg, rgb(251, 146, 60) 0%, rgb(249, 115, 22) 50%, rgb(251, 146, 60) 100%)',
                              boxShadow: '0 4px 20px rgba(249, 115, 22, 0.4)',
                            }}
                            whileHover={{ scale: 1.02, boxShadow: '0 6px 24px rgba(249, 115, 22, 0.5)' }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <CreditCard className="h-5 w-5" />
                            <span>ÖDEMEYE GEÇ</span>
                            <ChevronRight className="h-5 w-5" />
                          </motion.button>
                        </div>

                        {/* Features Footer - Modern */}
                        <div 
                          className="p-5 border-t"
                          style={{
                            borderColor: 'rgba(75, 85, 99, 0.3)',
                            background: 'rgba(0, 0, 0, 0.2)',
                          }}
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Shield className="h-4 w-4 text-orange-300 flex-shrink-0" />
                              <span className="font-medium">Güvenli</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Package className="h-4 w-4 text-orange-300 flex-shrink-0" />
                              <span className="font-medium">Hızlı</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Call to Action Section */}
          <CallToActionSection />
        </div>
      </div>

      {/* Clear Cart Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClearCart}
        title="Sepeti Temizle"
        message="Sepetinizdeki tüm ürünleri silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmText="Sepeti Temizle"
        cancelText="İptal"
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        totalAmount={getTotal()}
      />
    </>
  );
};

export default CartPage;




