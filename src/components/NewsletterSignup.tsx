import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, Check, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterSignup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted, email:', email);
    if (!email.trim()) {
      console.log('Email is empty');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitted(true);
      setIsLoading(false);
      setEmail('');
      
      // Show success toast
      toast.success('GAMING BÜLTENİNE BAŞARIYLA KAYDOLDUNUZ!', {
        duration: 3000,
        style: {
          fontSize: '12px',
          padding: '8px 12px',
          maxWidth: '300px'
        }
      });
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Modern Header */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center gap-4 mb-3">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center relative"
            style={{
              background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(234, 88, 12, 0.15) 100%)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              boxShadow: '0 8px 32px rgba(249, 115, 22, 0.15)',
            }}
          >
            <Bell className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight mb-1">
              Bültene Kaydol
            </h3>
            <p className="text-gray-400 text-sm font-medium">En yeni oyun haberleri ve özel indirimler</p>
          </div>
        </div>
      </motion.div>

      {/* Newsletter Form */}
      <div className="flex-1 flex flex-col">
        <div 
          className="relative rounded-2xl border flex-1 flex flex-col"
          style={{
            background: 'linear-gradient(135deg, rgba(31, 41, 55, 0.8) 0%, rgba(17, 24, 39, 0.9) 100%)',
            border: '1px solid rgba(75, 85, 99, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(10px)',
          }}
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 flex flex-col">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-orange-400/80" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl text-white placeholder-gray-400 focus:outline-none transition-all duration-300 text-sm font-medium"
                  style={{
                    background: 'rgba(0, 0, 0, 0.4)',
                    border: '1px solid rgba(249, 115, 22, 0.3)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.border = '1px solid rgba(249, 115, 22, 0.6)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.15)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.6)';
                  }}
                  onBlur={(e) => {
                    e.target.style.border = '1px solid rgba(249, 115, 22, 0.3)';
                    e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    e.target.style.background = 'rgba(0, 0, 0, 0.4)';
                  }}
                  required
                />
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                onClick={(e) => {
                  if (!email.trim()) {
                    e.preventDefault();
                    toast.error('Lütfen email adresinizi girin!', {
                      duration: 2000,
                      style: {
                        fontSize: '12px',
                        padding: '8px 12px',
                        maxWidth: '300px'
                      }
                    });
                    return;
                  }
                }}
                className="group relative w-full overflow-hidden font-black text-white py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-auto"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(251, 146, 60, 1))',
                  boxShadow: '0 4px 20px rgba(249, 115, 22, 0.5)',
                }}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: '0 8px 30px rgba(249, 115, 22, 0.7)',
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  animate={{ x: isLoading ? '100%' : '-100%' }}
                  transition={{ duration: 1.5, repeat: isLoading ? Infinity : 0, repeatDelay: 1 }}
                />
                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full relative z-10"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="text-sm font-black relative z-10">GÖNDERİLİYOR...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 relative z-10" />
                    <span className="text-sm font-black relative z-10">KAYDOL</span>
                  </>
                )}
              </motion.button>
            </form>
          ) : (
            /* Success Message */
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center p-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 relative"
                style={{
                  background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(251, 146, 60, 0.2) 100%)',
                  border: '2px solid rgba(249, 115, 22, 0.5)',
                  boxShadow: '0 8px 24px rgba(249, 115, 22, 0.3)',
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-orange-400/30 to-transparent rounded-2xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <Check className="h-8 w-8 text-orange-400 relative z-10" />
              </motion.div>
              <h3 className="text-xl font-black text-white mb-2">
                BAŞARILI!
              </h3>
              <p className="text-orange-300/90 text-sm">
                <span className="text-white font-bold">Bültenimize</span> başarıyla kaydoldunuz.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Footer Text */}
      <div className="text-center mt-6">
        <p className="text-gray-400 text-xs">
          <span className="text-gray-300 font-semibold">Spam göndermiyoruz.</span> İstediğiniz zaman{' '}
          <span className="text-gray-300 font-semibold">abonelikten çıkabilirsiniz.</span>
        </p>
      </div>
    </div>
  );
};

export default NewsletterSignup;





