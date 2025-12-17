import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { getMyBasket, addToBasket, removeFromBasket, clearBasket } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';

interface CartItem {
  id: string;
  name: string;
  slug: string;
  url?: string;
  price: string; // "₺635,00" formatında
  piece: number;
  basketId: string;
}

// Fiyat formatını normalize et
const normalizePrice = (price: string): string => {
  if (!price) {
    return '₺0,00';
  }
  
  // Fiyat formatını kontrol et ve düzelt
  let normalizedPrice = price.trim();
  
  // ₺ işareti yoksa ekle
  if (!normalizedPrice.startsWith('₺')) {
    normalizedPrice = '₺' + normalizedPrice;
  }
  
  // Sayısal değeri kontrol et - binlik ayırıcıları kaldır
  let cleanPrice = normalizedPrice.replace('₺', '').replace(/\s/g, '');
  cleanPrice = cleanPrice.replace(/\./g, ''); // Binlik ayırıcı noktaları kaldır
  cleanPrice = cleanPrice.replace(',', '.'); // Virgülü noktaya çevir
  
  const priceNumber = parseFloat(cleanPrice);
  
  if (isNaN(priceNumber)) {
    console.warn('Geçersiz fiyat formatı:', price);
    return '₺0,00';
  }
  
  // Formatı düzelt (₺635,00 formatına)
  return `₺${priceNumber.toFixed(2).replace('.', ',')}`;
};

interface CartResponse {
  price: string; // "₺635,00" formatında
  products: CartItem[];
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addItem: (productId: string, piece?: number) => Promise<{ success: boolean; error?: string }>;
  removeItem: (basketId: string) => Promise<void>;
  updateItemQuantity: (basketId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotal: () => string;
  getItemCount: () => number;
  loadCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Authentication durumunu localStorage'dan kontrol et
  const isAuthenticated = !!localStorage.getItem('token');

  // Sepeti yükle
  const loadCart = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    try {
      const response = await getMyBasket();
      
      if (response.data && response.data.products && Array.isArray(response.data.products)) {
        // Fiyatları normalize et
        const normalizedProducts = response.data.products.map((item: CartItem) => ({
          ...item,
          price: normalizePrice(item.price)
        }));
        
        // Ürünleri mevcut sepet sırasına göre koru
        // API'den gelen sırayı olduğu gibi kullan
        const sortedProducts = normalizedProducts;
        
        setCart(sortedProducts);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error('Sepet yüklenirken hata:', error);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  // Sepete ürün ekle
  const addItem = async (productId: string, piece = 1) => {
    if (!isAuthenticated) {
      toast.error('Sepete ürün eklemek için giriş yapmanız gerekiyor');
      return { success: false, error: 'Giriş yapmanız gerekiyor' };
    }

    setLoading(true);
    try {
      await addToBasket(productId, piece);
      await loadCart(); // Sepeti yeniden yükle
      toast.success('Ürün sepete başarıyla eklendi! 🎮', {
        duration: 2500,
        style: {
          background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.98), rgba(0, 0, 0, 0.95))',
          color: '#ffffff',
          border: '1px solid rgba(249, 115, 22, 0.3)',
          borderRadius: '16px',
          fontSize: '13px',
          fontWeight: '600',
          fontFamily: '"Space Grotesk", sans-serif',
          textTransform: 'none',
          letterSpacing: '0.3px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(249, 115, 22, 0.1)',
          backdropFilter: 'blur(24px)',
          padding: '12px 16px',
          minWidth: '280px',
          maxWidth: '400px',
        },
        iconTheme: {
          primary: '#F97316',
          secondary: '#ffffff',
        },
      });
      return { success: true };
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Ürün sepete eklenemedi';
      toast.error(errorMsg);
      return { 
        success: false, 
        error: errorMsg
      };
    } finally {
      setLoading(false);
    }
  };

  // Sepetten ürün çıkar
  const removeItem = async (basketId: string) => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await removeFromBasket(basketId);
      await loadCart(); // Sepeti yeniden yükle
      toast.success('Ürün sepetten çıkarıldı');
    } catch (error) {
      console.error('Ürün sepetten çıkarılırken hata:', error);
      toast.error('Ürün sepetten çıkarılırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Ürün miktarını güncelle
  const updateItemQuantity = async (basketId: string, newQuantity: number) => {
    if (!isAuthenticated) return;
    if (newQuantity <= 0) {
      await removeItem(basketId);
      return;
    }

    setLoading(true);
    try {
      // Mevcut ürünü bul
      const cartItem = cart.find(item => item.basketId === basketId);
      if (!cartItem) {
        throw new Error('Ürün bulunamadı');
      }

      // Önce mevcut ürünü kaldır
      await removeFromBasket(basketId);
      
      // Kısa bir bekleme süresi ekle (API'nin işlemi tamamlaması için)
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Sonra yeni miktarla ekle
      await addToBasket(cartItem.id, newQuantity);
      
      // Sepeti yeniden yükle
      await loadCart();
      
      toast.success('Miktar güncellendi');
    } catch (error) {
      console.error('Miktar güncellenirken hata:', error);
      toast.error('Miktar güncellenirken hata oluştu');
      
      // Hata durumunda sepeti yeniden yükle
      await loadCart();
    } finally {
      setLoading(false);
    }
  };

  // Sepeti temizle
  const clearCart = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      await clearBasket();
      setCart([]);
      // Toast kaldırıldı - sessizce temizle
    } catch (error) {
      console.error('Sepet temizlenirken hata:', error);
      toast.error('Sepet temizlenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Sepet toplamını hesapla
  const getTotal = () => {
    const total = cart.reduce((total, item) => {
      try {
        // Normalize edilmiş fiyatı parse et - binlik ayırıcıları kaldır
        let cleanPrice = item.price.replace('₺', '').replace(/\s/g, '');
        cleanPrice = cleanPrice.replace(/\./g, ''); // Binlik ayırıcı noktaları kaldır
        cleanPrice = cleanPrice.replace(',', '.'); // Virgülü noktaya çevir
        const priceNumber = parseFloat(cleanPrice);
        
        // API'den gelen fiyatın birim fiyat mı toplam fiyat mı olduğunu tespit et
        let unitPrice = priceNumber;
        
        // Eğer quantity 1'den büyükse ve fiyat quantity ile çarpıldığında makul bir değer çıkıyorsa
        // bu muhtemelen toplam fiyattır
        if (item.piece > 1) {
          const potentialUnitPrice = priceNumber / item.piece;
          if (potentialUnitPrice >= 50 && potentialUnitPrice <= 5000) {
            unitPrice = potentialUnitPrice;
          }
        }
        
        const itemTotal = unitPrice * item.piece;
        
        // NaN kontrolü
        if (isNaN(unitPrice)) {
          console.warn('Geçersiz fiyat formatı:', item.price);
          return total;
        }
        
        return total + itemTotal;
      } catch (error) {
        console.error('Fiyat hesaplama hatası:', error, 'Fiyat:', item.price);
        return total;
      }
    }, 0);
    
    // Number'ı "₺635,00" formatına çevir
    return `₺${total.toFixed(2).replace('.', ',')}`;
  };

  // Sepet ürün sayısını hesapla
  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.piece, 0);
  };

  // Authentication değişikliklerini dinle
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      if (token) {
        loadCart();
      } else {
        setCart([]);
      }
    };

    // Storage event'ini dinle
    window.addEventListener('storage', handleStorageChange);
    
    // İlk yükleme
    const token = localStorage.getItem('token');
    if (token) {
      loadCart();
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const value: CartContextType = {
    cart,
    loading,
    addItem,
    removeItem,
    updateItemQuantity,
    clearCart,
    getTotal,
    getItemCount,
    loadCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};





