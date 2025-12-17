import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Users, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SEOHead from '../components/SEOHead';
import CommonBackground from '../components/CommonBackground';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) navigate('/');
      else setError(result.error || 'Giriş başarısız');
    } catch {
      setError('Giriş yapılırken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const emailInvalid = touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const passwordInvalid = touched.password && formData.password.length < 6;

  return (
    <>
      <SEOHead />
      <div className="min-h-screen pt-20 relative overflow-hidden gaming-scrollbar">
        <CommonBackground />

        <div className="w-full relative z-10">
          {/* Login Form Section */}
          <section className="relative py-8">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="w-full">
                <div className="max-w-lg mx-auto">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-2xl border overflow-hidden"
                    style={{
                      background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
                      border: '1px solid rgba(75, 85, 99, 0.3)',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                    }}
                  >
                    {/* Title Section */}
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
                          <LogIn className="h-7 w-7 text-orange-300" />
                        </div>
                        <div>
                          <h1 className="text-2xl font-black text-white mb-1">
                            Giriş Yap
                          </h1>
                          <p className="text-gray-400 text-xs font-medium">
                            Hesabınıza giriş yapın
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 sm:p-8">
                      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                      {error && (
                        <div
                          className="px-4 py-3 rounded-xl border mb-5"
                          style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                            <span className="text-sm font-medium text-red-300">{error}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2">
                        <label htmlFor="email" className="block text-sm font-bold text-orange-300 mb-2">
                          E-posta Adresi
                        </label>
                        <div className="relative">
                          <div
                            className="rounded-xl p-4 border relative overflow-hidden transition-all"
                            style={{
                              background: emailInvalid 
                                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                                : 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                              border: emailInvalid
                                ? '1px solid rgba(239, 68, 68, 0.4)'
                                : '1px solid rgba(249, 115, 22, 0.3)',
                              boxShadow: emailInvalid 
                                ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                                : '0 4px 12px rgba(249, 115, 22, 0.15)',
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                              animate={{
                                opacity: [0.2, 0.4, 0.2],
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="relative z-10 flex items-center gap-3">
                              <Mail className="h-5 w-5 text-orange-300 flex-shrink-0" />
                              <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                aria-invalid={emailInvalid || undefined}
                                aria-describedby={emailInvalid ? 'email-err' : undefined}
                                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none font-semibold text-base"
                                placeholder="ornek@email.com"
                              />
                            </div>
                          </div>
                        </div>
                        {emailInvalid && (
                          <p id="email-err" className="mt-1 text-xs text-red-400 font-medium">
                            Lütfen geçerli bir e-posta girin.
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="password" className="block text-sm font-bold text-orange-300 mb-2">
                          Şifre
                        </label>
                        <div className="relative">
                          <div
                            className="rounded-xl p-4 border relative overflow-hidden transition-all"
                            style={{
                              background: passwordInvalid 
                                ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.1))'
                                : 'linear-gradient(135deg, rgba(249, 115, 22, 0.15), rgba(251, 146, 60, 0.1))',
                              border: passwordInvalid
                                ? '1px solid rgba(239, 68, 68, 0.4)'
                                : '1px solid rgba(249, 115, 22, 0.3)',
                              boxShadow: passwordInvalid 
                                ? '0 4px 12px rgba(239, 68, 68, 0.2)'
                                : '0 4px 12px rgba(249, 115, 22, 0.15)',
                            }}
                          >
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-transparent"
                              animate={{
                                opacity: [0.2, 0.4, 0.2],
                              }}
                              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                            />
                            <div className="relative z-10 flex items-center gap-3">
                              <Lock className="h-5 w-5 text-orange-300 flex-shrink-0" />
                              <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                aria-invalid={passwordInvalid || undefined}
                                aria-describedby={passwordInvalid ? 'pass-err' : undefined}
                                className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none font-semibold text-base"
                                placeholder="••••••••"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword((s) => !s)}
                                className="text-gray-400 hover:text-orange-300 transition-colors duration-200 p-2 rounded-lg hover:bg-orange-300/10 flex-shrink-0"
                                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
                              >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                              </button>
                            </div>
                          </div>
                        </div>
                        {passwordInvalid && (
                          <p id="pass-err" className="mt-1 text-xs text-red-400 font-medium">
                            Şifre en az 6 karakter olmalı.
                          </p>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="mt-8">
                        <motion.button
                          type="submit"
                          disabled={loading}
                          className="w-full font-black text-black py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-base disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                          style={{
                            background: loading
                              ? 'rgba(75, 85, 99, 0.3)'
                              : 'linear-gradient(135deg, rgb(251, 146, 60) 0%, rgb(249, 115, 22) 50%, rgb(251, 146, 60) 100%)',
                            boxShadow: loading 
                              ? 'none'
                              : '0 4px 20px rgba(249, 115, 22, 0.4)',
                          }}
                          whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 6px 24px rgba(249, 115, 22, 0.5)' }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              <span>Giriş Yapılıyor...</span>
                            </>
                          ) : (
                            <>
                              <LogIn className="h-5 w-5" />
                              <span>GİRİŞ YAP</span>
                            </>
                          )}
                        </motion.button>
                      </div>

                      <div className="text-center pt-6 border-t" style={{ borderColor: 'rgba(75, 85, 99, 0.3)' }}>
                        <p className="text-gray-400 text-sm mb-4">Henüz hesabın yok mu?</p>
                        <Link
                          to="/kayit-ol"
                          className="inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl border transition-all duration-200"
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
                          <Users className="h-4 w-4" />
                          <span className="text-sm">HESAP OLUŞTUR</span>
                        </Link>
                      </div>
                    </form>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default LoginPage;





