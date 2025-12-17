import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import * as api from '../services/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<{ success: boolean; error?: string }>;
  register: (userData: { firstName: string; lastName: string; email: string; password: string; tcNo: string; birthDate: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Local storage'dan kullanıcı bilgilerini yükle
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    console.log('AuthContext: Loading user data from localStorage', { savedUser, savedToken });
    
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser && typeof parsedUser === 'object') {
          setUser(parsedUser);
          setToken(savedToken);
          console.log('AuthContext: User loaded successfully', parsedUser);
        }
      } catch (error) {
        console.error('User data parse error:', error);
        // Geçersiz veriyi temizle
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      console.log('AuthContext: Attempting login with credentials', credentials);
      const response = await api.login(credentials);
      console.log('AuthContext: Login response received', response);
      const { token, firstName, lastName } = response.data;
      
      if (!token || !firstName || !lastName) {
        console.log('AuthContext: Invalid user data received', { token, firstName, lastName });
        return { 
          success: false, 
          error: 'Geçersiz kullanıcı verisi' 
        };
      }
      
      // User objesini oluştur
      const userData = {
        id: 'temp-id', // API'den ID gelmiyorsa geçici ID
        firstName,
        lastName,
        email: credentials.email
      };
      
      setUser(userData);
      setToken(token);
      
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      
      // Storage event'ini tetikle
      window.dispatchEvent(new Event('storage'));
      
      // Kullanıcı girişi yapıldığında homepage'e yönlendir ve yenile
      window.location.href = '/';
      
      return { success: true };
    } catch (error: any) {
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Giriş başarısız' 
      };
    }
  };

  const register = async (userData: { firstName: string; lastName: string; email: string; password: string; tcNo: string; birthDate: string }) => {
    try {
      const response = await api.register(userData);
      
      // API'den response data'sı gelmiyorsa veya boşsa, sadece başarılı olduğunu varsayalım
      if (!response.data || Object.keys(response.data).length === 0) {
        // Başarılı kayıt, kullanıcıyı login sayfasına yönlendir
        return { success: true };
      }
      
      const { token, firstName: respFirstName, lastName: respLastName } = response.data;
      
      if (token && respFirstName && respLastName) {
        // User objesini oluştur
        const newUser = {
          id: 'temp-id', 
          firstName: respFirstName,
          lastName: respLastName,
          email: userData.email
        };
        
        setUser(newUser);
        setToken(token);
        
        localStorage.setItem('user', JSON.stringify(newUser));
        localStorage.setItem('token', token);
        
        // Storage event'ini tetikle
        window.dispatchEvent(new Event('storage'));
        
        // Kullanıcı kaydı yapıldığında homepage'e yönlendir ve yenile
        window.location.href = '/';
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || error.response?.data?.message || 'Kayıt başarısız' 
      };
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('AuthContext: User updated', updatedUser);
    }
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Storage event'ini tetikle
    window.dispatchEvent(new Event('storage'));
    console.log('AuthContext: User logged out successfully');
  };

  const value: AuthContextType = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!token,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};





