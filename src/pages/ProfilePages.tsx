import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User,
  Mail,
  Lock,
  Save,
  Eye,
  EyeOff,
  Shield,
  Home,
  ChevronRight,
  UserCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyData, updateName, updateEmail, updatePassword } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';
import CallToActionSection from '../components/CallToActionSection';
import toast from 'react-hot-toast';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
}

const ProfilePage = () => {
  const { isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData>({
    firstName: '',
    lastName: '',
    email: ''
  });

  // Form states
  const [nameForm, setNameForm] = useState({
    firstName: '',
    lastName: ''
  });
  const [emailForm, setEmailForm] = useState({
    email: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // UI states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        console.log('Loading user data...');
        
        // /my-data endpoint'ini kullanarak güncel veri al
        console.log('Fetching user data from /my-data endpoint...');
        const response = await getMyData();
        console.log('User data response:', response);
        const data = response.data;
        console.log('User data from API:', data);
        
        // API'den gelen veriyi kullan
        setUserData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || ''
        });
        
        setNameForm({
          firstName: data.firstName || '',
          lastName: data.lastName || ''
        });
        
        setEmailForm({
          email: data.email || ''
        });
        
        console.log('User data loaded successfully from API');
      } catch (error: any) {
        console.error('Error loading user data from API:', error);
        console.error('Error response:', error.response);
        console.error('Error data:', error.response?.data);
        
        // API'den veri alınamazsa AuthContext'ten veri al
        console.log('Falling back to AuthContext data...');
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const user = JSON.parse(savedUser);
            console.log('Using AuthContext data:', user);
            
            setUserData({
              firstName: user.firstName || '',
              lastName: user.lastName || '',
              email: user.email || ''
            });
            
            setNameForm({
              firstName: user.firstName || '',
              lastName: user.lastName || ''
            });
            
            setEmailForm({
              email: user.email || ''
            });
            
            console.log('User data loaded from AuthContext successfully');
          } catch (parseError) {
            console.error('Error parsing user data from localStorage:', parseError);
            toast.error('Kullanıcı bilgileri yüklenirken hata oluştu');
          }
        } else {
          toast.error('Kullanıcı bilgileri yüklenirken hata oluştu');
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [isAuthenticated, navigate]);


  // Update name
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameForm.firstName.trim() || !nameForm.lastName.trim()) {
      toast.error('Ad ve soyad alanları zorunludur');
      return;
    }

    try {
      setUpdating('name');
      const firstName = nameForm.firstName.trim();
      const lastName = nameForm.lastName.trim();
      
      console.log('Updating name with data:', {
        method: 1,
        firstName,
        lastName
      });
      
      // Token kontrolü
      const token = localStorage.getItem('token');
      console.log('Current token:', token ? 'Token exists' : 'No token found');
      
      const response = await updateName(firstName, lastName);
      console.log('Name update response:', response);
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
      // API'den başarılı yanıt geldi mi kontrol et
      if (response.status === 200 || response.status === 201) {
        setUserData(prev => ({
          ...prev,
          firstName,
          lastName
        }));
        
        // AuthContext'i güncelle
        updateUser({
          firstName,
          lastName
        });
        
        toast.success('Ad ve soyad başarıyla güncellendi');
      } else {
        console.error('Unexpected response status:', response.status);
        toast.error('Beklenmeyen yanıt durumu: ' + response.status);
      }
    } catch (error: any) {
      console.error('Error updating name:', error);
      console.error('Error message:', error.message);
      console.error('Error response:', error.response);
      console.error('Error response status:', error.response?.status);
      console.error('Error response data:', error.response?.data);
      console.error('Error response headers:', error.response?.headers);
      
      // Daha detaylı hata mesajı
      let errorMessage = 'Ad ve soyad güncellenirken hata oluştu';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      if (error.response?.status === 401) {
        errorMessage = 'Oturum süresi dolmuş. Lütfen tekrar giriş yapın.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Bu işlem için yetkiniz bulunmuyor.';
      } else if (error.response?.status === 400) {
        errorMessage = 'Geçersiz veri gönderildi.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
      }
      
      toast.error(errorMessage);
    } finally {
      setUpdating(null);
    }
  };

  // Update email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailForm.email.trim()) {
      toast.error('E-posta alanı zorunludur');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.email)) {
      toast.error('Geçerli bir e-posta adresi giriniz');
      return;
    }

    try {
      setUpdating('email');
      const email = emailForm.email.trim();
      
      console.log('Updating email with data:', {
        method: 2,
        email
      });
      
      const response = await updateEmail(email);
      console.log('Email update response:', response);
      
      setUserData(prev => ({
        ...prev,
        email
      }));
      
      // AuthContext'i güncelle
      updateUser({
        email
      });
      
      toast.success('E-posta başarıyla güncellendi');
    } catch (error: any) {
      console.error('Error updating email:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'E-posta güncellenirken hata oluştu');
    } finally {
      setUpdating(null);
    }
  };

  // Update password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('Tüm şifre alanları zorunludur');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Yeni şifre en az 6 karakter olmalıdır');
      return;
    }

    try {
      setUpdating('password');
      const password = passwordForm.newPassword;
      
      console.log('Updating password with data:', {
        method: 3,
        password
      });
      
      const response = await updatePassword(password);
      console.log('Password update response:', response);
      
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      toast.success('Şifre başarıyla güncellendi');
    } catch (error: any) {
      console.error('Error updating password:', error);
      console.error('Error response:', error.response);
      console.error('Error data:', error.response?.data);
      toast.error(error.response?.data?.message || error.response?.data?.error || 'Şifre güncellenirken hata oluştu');
    } finally {
      setUpdating(null);
    }
  };

  if (!isAuthenticated) {
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
                    <span className="text-orange-300 font-semibold">Profil Ayarları</span>
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
                          <UserCircle className="h-6 w-6 text-orange-400" />
                        </div>
                      </div>
                      
                      <div>
                        <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                          Profil Ayarları
                        </h1>
                        <p className="text-gray-400 text-sm font-medium">
                          Kişisel bilgilerinizi ve şifrenizi güncelleyin
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Not Authenticated State */}
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
                      <UserCircle className="h-12 w-12 text-orange-400/60" />
                    </div>
                    <h3 className="text-3xl font-black text-white mb-3">
                      Profil sayfasına erişmek için giriş yapın
                    </h3>
                    <p className="text-gray-400 text-lg mb-8">Hesabınıza giriş yaparak profil ayarlarınızı yönetebilirsiniz.</p>
                    
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link 
                        to="/giris-yap" 
                        className="inline-flex items-center justify-center px-6 py-3 font-bold text-black rounded-xl bg-gradient-to-r from-orange-400 via-orange-300 to-orange-400 shadow-[0_0_30px_rgba(249,115,22,0.5)] hover:shadow-[0_0_50px_rgba(249,115,22,0.7)] transition-all"
                      >
                        <span className="text-sm">GİRİŞ YAP</span>
                      </Link>
                      
                      <Link 
                        to="/kayit-ol" 
                        className="inline-flex items-center justify-center px-6 py-3 font-bold rounded-xl border transition-all duration-200"
                        style={{
                          border: '1px solid rgba(249, 115, 22, 0.4)',
                          color: 'rgba(249, 115, 22, 0.95)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(249, 115, 22, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <span className="text-sm">KAYIT OL</span>
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
      <div className="min-h-screen relative overflow-hidden">
        <CommonBackground />
        <div className="relative z-10 flex items-center justify-center min-h-screen">
          <LoadingSpinner 
            size="xl" 
            text="Profil Yükleniyor..." 
            variant="gaming" 
          />
        </div>
      </div>
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
                  <span className="text-orange-300 font-semibold">Profil Ayarları</span>
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
                        <UserCircle className="h-6 w-6 text-orange-400" />
                      </div>
                    </div>
                    
                    <div>
                      <h1 className="text-2xl font-black text-white tracking-tight mb-1">
                        Profil Ayarları
                      </h1>
                      <p className="text-gray-400 text-sm font-medium">
                        Kişisel bilgilerinizi ve şifrenizi güncelleyin
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
                        KİŞİSEL BİLGİLER
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <section className="relative py-4">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Name Update Section */}
                <ProfileFormCard
                  number={1}
                  icon={User}
                  title="Ad ve Soyad"
                  description={`Mevcut: ${userData.firstName} ${userData.lastName}`}
                  onSubmit={handleUpdateName}
                  updating={updating === 'name'}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                            boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
                          }}
                          animate={{
                            scale: [1, 1.4, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                        <label className="block text-xs font-bold text-orange-300 uppercase tracking-wider">
                          Ad
                        </label>
                      </div>
                      <div
                        className="rounded-xl p-4 border relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                        <input
                          type="text"
                          value={nameForm.firstName}
                          onChange={(e) => setNameForm(prev => ({ ...prev, firstName: e.target.value }))}
                          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-sm relative z-10"
                          placeholder="Adınızı girin"
                          required
                        />
                      </div>
                    </motion.div>
                    <motion.div 
                      className="space-y-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                    >
                      <div className="flex items-center gap-2">
                        <motion.div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                            boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
                          }}
                          animate={{
                            scale: [1, 1.4, 1],
                          }}
                          transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                        />
                        <label className="block text-xs font-bold text-orange-300 uppercase tracking-wider">
                          Soyad
                        </label>
                      </div>
                      <div
                        className="rounded-xl p-4 border relative overflow-hidden"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                          border: '1px solid rgba(249, 115, 22, 0.3)',
                          boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                          animate={{
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                        />
                        <input
                          type="text"
                          value={nameForm.lastName}
                          onChange={(e) => setNameForm(prev => ({ ...prev, lastName: e.target.value }))}
                          className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-sm relative z-10"
                          placeholder="Soyadınızı girin"
                          required
                        />
                      </div>
                    </motion.div>
                  </div>
                </ProfileFormCard>

                {/* Email Update Section */}
                <ProfileFormCard
                  number={2}
                  icon={Mail}
                  title="E-posta"
                  description={`Mevcut: ${userData.email}`}
                  onSubmit={handleUpdateEmail}
                  updating={updating === 'email'}
                >
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                          boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
                        }}
                        animate={{
                          scale: [1, 1.4, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <label className="block text-xs font-bold text-orange-300 uppercase tracking-wider">
                        Yeni E-posta
                      </label>
                    </div>
                    <div
                      className="rounded-xl p-4 border relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <input
                        type="email"
                        value={emailForm.email}
                        onChange={(e) => setEmailForm(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-sm relative z-10"
                        placeholder="Yeni e-posta adresinizi girin"
                        required
                      />
                    </div>
                  </motion.div>
                </ProfileFormCard>
              </div>

              {/* Password Update Section - Full Width */}
              <ProfileFormCard
                number={3}
                icon={Shield}
                title="Şifre"
                description="Güvenliğiniz için şifrenizi güncelleyin"
                onSubmit={handleUpdatePassword}
                updating={updating === 'password'}
                className="mt-4 sm:mt-5"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                          boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
                        }}
                        animate={{
                          scale: [1, 1.4, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                      <label className="block text-xs font-bold text-orange-300 uppercase tracking-wider">
                        Mevcut Şifre
                      </label>
                    </div>
                    <div
                      className="rounded-xl p-4 border relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordForm.currentPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-sm"
                          placeholder="Mevcut şifrenizi girin"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="text-gray-400 hover:text-orange-300 transition-colors duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                        >
                          {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                          boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
                        }}
                        animate={{
                          scale: [1, 1.4, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                      />
                      <label className="block text-xs font-bold text-orange-300 uppercase tracking-wider">
                        Yeni Şifre
                      </label>
                    </div>
                    <div
                      className="rounded-xl p-4 border relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-sm"
                          placeholder="Yeni şifrenizi girin"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-gray-400 hover:text-orange-300 transition-colors duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="space-y-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                          boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
                        }}
                        animate={{
                          scale: [1, 1.4, 1],
                        }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                      />
                      <label className="block text-xs font-bold text-orange-300 uppercase tracking-wider">
                        Yeni Şifre Tekrar
                      </label>
                    </div>
                    <div
                      className="rounded-xl p-4 border relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                        border: '1px solid rgba(249, 115, 22, 0.3)',
                        boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                        animate={{
                          opacity: [0.2, 0.4, 0.2],
                        }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      />
                      <div className="relative z-10 flex items-center gap-2">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-sm"
                          placeholder="Yeni şifrenizi tekrar girin"
                          required
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-gray-400 hover:text-orange-300 transition-colors duration-200 p-1.5 rounded-lg hover:bg-orange-300/10"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </ProfileFormCard>
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

// Profile Form Card Component
interface ProfileFormCardProps {
  number: number;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  onSubmit: (e: React.FormEvent) => void;
  updating: boolean;
  children: React.ReactNode;
  className?: string;
}

const ProfileFormCard = ({ number, icon: Icon, title, description, onSubmit, updating, children, className = '' }: ProfileFormCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`group relative overflow-hidden transition-all duration-300 h-full flex flex-col rounded-2xl ${className}`}
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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
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
          <div 
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
          </div>
          
          {/* Number Badge - Enhanced */}
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-lg flex-shrink-0 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
              boxShadow: isHovered
                ? '0 8px 24px rgba(249, 115, 22, 0.5)'
                : '0 4px 16px rgba(249, 115, 22, 0.3)',
            }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10">{number}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2 mb-5">
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

        {/* Divider with gradient */}
        <div className="flex items-center gap-2 mb-5">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
              boxShadow: '0 0 8px rgba(249, 115, 22, 0.6)',
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="flex-1 flex flex-col space-y-5">
          {/* Form Content - Premium Styled */}
          <div className="space-y-5 flex-1">
            {children}
          </div>
          
          {/* Submit Button - Premium Design */}
          <div className="mt-auto pt-6 border-t relative" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
            <motion.div
              className="relative overflow-hidden rounded-xl p-4 cursor-pointer"
              style={{
                background: updating
                  ? 'linear-gradient(135deg, rgba(75, 85, 99, 0.25), rgba(55, 65, 81, 0.2))'
                  : isHovered
                  ? 'linear-gradient(135deg, rgba(249, 115, 22, 0.25), rgba(251, 146, 60, 0.2))'
                  : 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                border: updating
                  ? '2px solid rgba(75, 85, 99, 0.5)'
                  : isHovered
                  ? '2px solid rgba(249, 115, 22, 0.5)'
                  : '1px solid rgba(249, 115, 22, 0.3)',
                boxShadow: isHovered && !updating
                  ? '0 8px 24px rgba(249, 115, 22, 0.3)' 
                  : '0 4px 12px rgba(249, 115, 22, 0.15)',
              }}
              whileHover={{ scale: updating ? 1 : 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.2 }}
            >
              {/* Background Animation */}
              {!updating && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isHovered ? '100%' : '-100%' }}
                  transition={{ duration: 1.5, repeat: isHovered ? Infinity : 0, repeatDelay: 0.5 }}
                />
              )}
              
              <motion.button
                type="submit"
                disabled={updating}
                className="w-full"
              >
                <div className="flex items-center justify-between relative z-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      {updating ? 'Güncelleniyor' : 'Değişiklikleri Kaydet'}
                    </span>
                    <span className="text-sm font-black text-orange-300">
                      {updating ? 'Lütfen bekleyin...' : 'Hemen Güncelle'}
                    </span>
                  </div>
                  
                  <div 
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg"
                    style={{
                      background: 'rgba(249, 115, 22, 0.3)',
                      border: '1px solid rgba(249, 115, 22, 0.5)',
                      boxShadow: '0 4px 12px rgba(249, 115, 22, 0.2)',
                    }}
                  >
                    {updating ? (
                      <motion.div
                        className="w-5 h-5 border-2 border-orange-200 border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : (
                      <Save className="h-5 w-5 text-orange-200" />
                    )}
                  </div>
                </div>
              </motion.button>
            </motion.div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default ProfilePage;






