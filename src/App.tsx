import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useEffect, useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WebsiteProvider } from './context/WebsiteContext';
import { CheckoutProvider } from './context/CheckoutContext';
import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Header from './components/Header';
import Footer from './components/Footer';
import SEOHead from './components/SEOHead';
import SearchModal from './components/SearchModal';
import { GridSkeleton } from './components/SkeletonLoader';
import './App.css';

// Lazy load pages for code splitting
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage'));
const CategoryDetailPage = lazy(() => import('./pages/CategoryDetailPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const OrdersPage = lazy(() => import('./pages/OrdersPage'));
const BankAccountsPage = lazy(() => import('./pages/BankAccountsPage'));
const ContractPage = lazy(() => import('./pages/ContractPage'));
const BulkPurchasePage = lazy(() => import('./pages/BulkPurchasePage'));
const ReturnsPage = lazy(() => import('./pages/ReturnsPage'));
const LiveSupportPage = lazy(() => import('./pages/LiveSupportPage'));
const RehberPage = lazy(() => import('./pages/RehberPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePages'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen pt-20 flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin mx-auto" />
      <p className="text-gray-400 text-sm">Sayfa yükleniyor...</p>
    </div>
  </div>
);

function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 400,
      easing: 'ease-out',
      once: true,
      mirror: false
    });
  }, []);

  const openSearch = () => {
    setIsSearchOpen(true);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
  };

  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WebsiteProvider>
            <CheckoutProvider>
              <div className="App">
                <ScrollToTop />
                <SEOHead />
                <Header onOpenSearch={openSearch} />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/giris-yap" element={<LoginPage />} />
                  <Route path="/kayit-ol" element={<RegisterPage />} />
                  <Route path="/oyunlar" element={<CategoriesPage />} />
                  <Route path="/oyunlar/:slug" element={<CategoryDetailPage />} />
                  <Route path="/epin/:slug" element={<ProductDetailPage />} />
                  <Route path="/sepet" element={<CartPage />} />
                  <Route path="/rehber" element={<RehberPage />} />
                  <Route path="/iletisim" element={<ContactPage />} />
                  <Route path="/siparislerim" element={<OrdersPage />} />
                  <Route path="/banka-hesaplari" element={<BankAccountsPage />} />
                  <Route path="/sozlesme/:slug" element={<ContractPage />} />
                  <Route path="/toplu-satin-alim" element={<BulkPurchasePage />} />
                  <Route path="/geri-iade" element={<ReturnsPage />} />
                  <Route path="/canli-destek" element={<LiveSupportPage />} />
                  <Route path="/profil" element={<ProfilePage />} />
                </Routes>
              </Suspense>
              <Footer />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 3000,
                  style: {
                    background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.98), rgba(0, 0, 0, 0.95))',
                    color: '#ffffff',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    borderRadius: '16px',
                    fontSize: '13px',
                    fontWeight: '600',
                    fontFamily: '"Space Grotesk", sans-serif',
                    textTransform: 'none',
                    letterSpacing: '0.3px',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)',
                    backdropFilter: 'blur(24px)',
                    position: 'relative',
                    overflow: 'hidden',
                    padding: '12px 16px',
                    minWidth: '280px',
                    maxWidth: '400px',
                  },
                  success: {
                    iconTheme: {
                      primary: '#F97316',
                      secondary: '#ffffff',
                    },
                    style: {
                      border: '1px solid rgba(249, 115, 22, 0.3)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(249, 115, 22, 0.1)',
                      background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.98), rgba(0, 0, 0, 0.95))',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#ffffff',
                    },
                    style: {
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(239, 68, 68, 0.1)',
                      background: 'linear-gradient(135deg, rgba(24, 24, 27, 0.98), rgba(0, 0, 0, 0.95))',
                    },
                  },
                }}
              />
              
              {/* Search Modal */}
              <SearchModal
                isOpen={isSearchOpen}
                onClose={closeSearch}
                homepageItems={[]} // SearchModal kendi yükleyecek
              />
              </div>
            </CheckoutProvider>
          </WebsiteProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;





