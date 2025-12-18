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
      {/* Header - HeroSection Style */}
      <motion.div 
        className="mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#1A1A1A] border border-[#333333]">
            <Bell className="h-5 w-5 text-[#107C10]" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">
              Bültene Kaydol
            </h3>
            <p className="text-gray-400 text-sm">En yeni oyun haberleri ve özel indirimler</p>
          </div>
        </div>
      </motion.div>

      {/* Newsletter Form - HeroSection Style */}
      <div className="flex-1 flex flex-col">
        <div 
          className="relative border flex-1 flex flex-col bg-[#1A1A1A]"
          style={{
            border: '1px solid #333333',
          }}
        >
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4 flex-1 flex flex-col">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#107C10]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E-posta adresiniz"
                  className="w-full pl-12 pr-4 py-3.5 text-white placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm font-medium bg-[#0A0A0A] border border-[#333333] focus:border-[#107C10]"
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
                className="group relative w-full font-semibold text-white py-3 px-6 transition-all duration-200 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed mt-auto bg-[#107C10] hover:bg-[#0E6B0E]"
                whileTap={{ scale: 0.98 }}
              >
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
                  className="w-16 h-16 flex items-center justify-center mx-auto mb-4 relative bg-[#107C10] border border-[#107C10]"
                >
                  <Check className="h-8 w-8 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  BAŞARILI!
                </h3>
                <p className="text-gray-300 text-sm">
                  <span className="text-white font-semibold">Bültenimize</span> başarıyla kaydoldunuz.
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





