import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ShoppingCart, Zap, Gamepad2, Shield, Home, ChevronRight, 
  Tag, Star, TrendingUp, Clock, CheckCircle, Lock, CreditCard, Award
} from 'lucide-react';
import { getProductDetail } from '../services/api';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';

interface ProductResponse {
  product: {
    id: string;
    name: string;
    slug: string;
    url?: string;
    detail?: string;
    price: string;
  };
  category: {
    name: string;
    slug: string;
    url?: string;
  };
}

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [productData, setProductData] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const response = await getProductDetail(slug);
        setProductData(response.data);
      } catch (error) {
        console.error('Ürün detayı yüklenirken hata:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  const handleAddToCart = () => {
    if (productData) addItem(productData.product.id, 1);
  };

  const handleBuyNow = () => {
    if (productData) {
      addItem(productData.product.id, 1);
      navigate('/sepet');
    }
  };

  const { product, category } = productData || {} as ProductResponse;
  const displayPrice = useMemo(() => product?.price ?? '—', [product?.price]);

  if (loading) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden">
          <CommonBackground />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 0.6 }}
          >
            <LoadingSpinner size="xl" text="Ürün Yükleniyor..." variant="gaming" />
          </motion.div>
        </div>
      </>
    );
  }

  if (!productData) {
    return (
      <>
        <SEOHead />
        <div className="min-h-screen pt-20 flex items-center justify-center relative overflow-hidden px-4">
          <CommonBackground />
          <div 
            className="text-center p-10 rounded-2xl border max-w-md mx-auto"
            style={{
              background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
              border: '1px solid rgba(75, 85, 99, 0.3)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center mx-auto mb-6">
              <Gamepad2 className="w-10 h-10 text-orange-400/60" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3">Ürün Bulunamadı</h2>
            <p className="text-gray-400 mb-8 text-base">Aradığınız ürün mevcut değil veya kaldırılmış.</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/" 
                className="inline-flex items-center gap-2 px-8 py-4 font-bold text-black rounded-xl transition-all bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_40px_rgba(249,115,22,0.5)] hover:shadow-[0_0_60px_rgba(249,115,22,0.7)]"
              >
                <ArrowLeft className="h-5 w-5" />
                Ana Sayfaya Dön
              </Link>
            </motion.div>
          </div>
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
          {/* Header */}
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
                  <Link 
                    to="/oyunlar" 
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    Kategoriler
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                  <Link 
                    to={`/oyunlar/${category.slug}`}
                    className="text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {category.name}
                  </Link>
                  <ChevronRight className="h-4 w-4 text-gray-600" />
                  <span className="text-orange-300 font-semibold line-clamp-1">{product.name}</span>
                </div>

                {/* Title Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 relative z-10">
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
                        <Tag className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                    
                    <div>
                      <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                        {product.name}
                      </h1>
                      <div className="flex items-center gap-2 text-sm text-gray-400 font-medium">
                        <Award className="h-4 w-4 text-orange-400" />
                        <span>Premium Dijital İçerik</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <div
                      className="px-4 py-2 rounded-xl flex items-center gap-2"
                      style={{
                        background: 'rgba(34, 197, 94, 0.15)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-green-400 text-sm font-bold">STOKTA</span>
                    </div>
                    <div
                      className="px-4 py-2 rounded-xl"
                      style={{
                        background: 'rgba(249, 115, 22, 0.15)',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                      }}
                    >
                      <span className="text-orange-400 text-sm font-bold">ANLIK TESLİMAT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Section */}
          <section className="relative py-4">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  
                  {/* Left Column - Product Image & Features */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Product Image */}
                    <div className="relative group">
                      <div 
                        className="relative rounded-2xl overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                          border: '1px solid rgba(75, 85, 99, 0.3)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        <div className="aspect-video relative overflow-hidden">
                          <AnimatePresence mode="wait">
                            {!imgError && product.url ? (
                              <motion.img
                                key={product.url}
                                src={product.url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.6 }}
                                onError={() => setImgError(true)}
                              />
                            ) : (
                              <motion.div 
                                key="fallback" 
                                className="flex flex-col items-center justify-center h-full bg-gradient-to-br from-orange-500/20 to-orange-600/10"
                                initial={{ opacity: 0 }} 
                                animate={{ opacity: 1 }}
                              >
                                <Gamepad2 className="w-24 h-24 text-orange-300/40 mb-4" />
                                <span className="text-gray-400 text-base">Görsel yükleniyor...</span>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 right-4 z-10">
                          <div 
                            className="px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2"
                            style={{
                              background: 'rgba(0, 0, 0, 0.6)',
                              border: '1px solid rgba(249, 115, 22, 0.4)',
                              backdropFilter: 'blur(12px)',
                            }}
                          >
                            <TrendingUp className="h-4 w-4 text-orange-400" />
                            {category.name?.toUpperCase()}
                          </div>
                        </div>

                        {/* Rating Badge */}
                        <div className="absolute top-4 left-4 z-10">
                          <div 
                            className="px-3 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2"
                            style={{
                              background: 'rgba(0, 0, 0, 0.6)',
                              border: '1px solid rgba(249, 115, 22, 0.4)',
                              backdropFilter: 'blur(12px)',
                            }}
                          >
                            <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
                            <span>4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[
                        { icon: Clock, title: 'Hızlı Teslimat', desc: 'Anında kod teslimi' },
                        { icon: Shield, title: 'Güvenli Alışveriş', desc: '256-bit SSL şifreleme' },
                        { icon: Award, title: 'Orijinal Ürün', desc: '100% garantili' },
                      ].map((feature, i) => (
                        <div
                          key={i}
                          className="p-6 rounded-2xl relative overflow-hidden"
                          style={{
                            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                            border: '1px solid rgba(75, 85, 99, 0.3)',
                            backdropFilter: 'blur(10px)',
                          }}
                        >
                          <feature.icon className="h-8 w-8 mb-3 text-orange-400" />
                          <h4 className="text-white font-bold text-sm mb-1">{feature.title}</h4>
                          <p className="text-gray-400 text-xs">{feature.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Product Description */}
                    {product.detail && (
                      <div>
                        <div 
                          className="rounded-2xl p-8"
                          style={{
                            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                            border: '1px solid rgba(75, 85, 99, 0.3)',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                          }}
                        >
                          <div className="flex items-center gap-3 mb-6">
                            <div 
                              className="w-10 h-10 rounded-xl flex items-center justify-center"
                              style={{
                                background: 'rgba(249, 115, 22, 0.15)',
                                border: '1px solid rgba(249, 115, 22, 0.3)',
                              }}
                            >
                              <Gamepad2 className="h-5 w-5 text-orange-400" />
                            </div>
                            <h2 className="text-2xl font-black text-white">Ürün Açıklaması</h2>
                          </div>
                          <div 
                            className="text-gray-300 leading-relaxed prose prose-invert prose-orange max-w-none"
                            dangerouslySetInnerHTML={{ __html: product.detail }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column - Price & Actions */}
                  <div className="lg:col-span-1">
                    <div className="sticky top-24">
                      <div 
                        className="rounded-2xl p-8 relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                          border: '1px solid rgba(75, 85, 99, 0.3)',
                          backdropFilter: 'blur(10px)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                        }}
                      >
                        {/* Price Section */}
                        <div className="relative z-10 text-center mb-8">
                          <div className="flex items-center justify-center gap-2 text-orange-300 text-sm mb-3">
                            <div className="w-2 h-2 rounded-full bg-orange-400" />
                            <span className="font-bold">ÖZEL FİYAT</span>
                          </div>
                          
                          <div className="text-5xl font-black text-white tracking-tight mb-4">
                            <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-300 bg-clip-text text-transparent">
                              {displayPrice}
                            </span>
                          </div>

                          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                            <Lock className="w-4 h-4 text-green-400" />
                            <span>Güvenli ve Şifreli Ödeme</span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="space-y-4 relative z-10">
                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleBuyNow}
                            className="w-full font-black text-black py-5 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg relative overflow-hidden group"
                            style={{
                              background: 'linear-gradient(135deg, rgb(251, 146, 60) 0%, rgb(249, 115, 22) 50%, rgb(251, 146, 60) 100%)',
                              boxShadow: '0 4px 16px rgba(249, 115, 22, 0.3)',
                            }}
                          >
                            <Zap className="h-6 w-6 relative z-10" />
                            <span className="relative z-10">HEMEN SATIN AL</span>
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.03, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleAddToCart}
                            className="w-full px-6 py-5 rounded-xl text-white font-bold transition-all duration-300 flex items-center justify-center gap-3 text-base"
                            style={{
                              background: 'rgba(249, 115, 22, 0.15)',
                              border: '1px solid rgba(249, 115, 22, 0.3)',
                            }}
                          >
                            <ShoppingCart className="h-5 w-5" />
                            <span>SEPETE EKLE</span>
                          </motion.button>
                        </div>

                        {/* Trust Badges */}
                        <div className="mt-8 pt-8 border-t" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                          <div className="space-y-3">
                            {[
                              { icon: CheckCircle, text: 'Anında teslimat garantisi' },
                              { icon: CreditCard, text: 'Tüm kartlar geçerli' },
                              { icon: Shield, text: '7/24 müşteri desteği' },
                            ].map((item, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-3 text-sm text-gray-300"
                              >
                                <item.icon className="h-5 w-5 text-green-400 flex-shrink-0" />
                                <span>{item.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;