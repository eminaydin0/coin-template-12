import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, MessageSquare, Send } from 'lucide-react';
import { createMessage } from '../services/api';
import toast from 'react-hot-toast';

interface ContactFormProps {
  title: string;
  description: string;
  method: string;
  backLink: string;
  backText: string;
}

const ContactForm = ({ title, description, method, backLink, backText }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    title: '',
    text: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const messageData = {
        ...formData,
        method
      };

      await createMessage(messageData);
      toast.success('Mesajınız başarıyla gönderildi!');
      
      // Form'u temizle
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        text: ''
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || 'Mesaj gönderilirken bir hata oluştu';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10 w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
              className="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-xl"
              style={{
                background: 'rgba(249, 115, 22, 0.2)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                boxShadow: '0 4px 12px rgba(249, 115, 22, 0.15)',
                backdropFilter: 'blur(8px)'
              }}
            >
              <MessageSquare className="h-5 w-5 text-orange-300" />
            </motion.div>
            <h1 className="text-xl font-bold mb-2 bg-gradient-to-r from-orange-300 to-orange-400 bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-gray-400 text-xs max-w-md mx-auto leading-relaxed">
              {description}
            </p>
          </div>
        </motion.div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative rounded-xl overflow-hidden border relative z-10 p-4"
          style={{
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Ad
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-lg grid place-items-center"
                    style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.25)',
                    }}
                  >
                    <User className="h-3 w-3 text-orange-300" />
                  </div>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full text-white px-3 py-2.5 pl-10 rounded-lg outline-none transition-all text-xs"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '1.5px solid rgba(249, 115, 22, 0.25)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                      e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                    }}
                    placeholder="Adınız"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="lastName" className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Soyad
                </label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-lg grid place-items-center"
                    style={{
                      background: 'rgba(249, 115, 22, 0.15)',
                      border: '1px solid rgba(249, 115, 22, 0.25)',
                    }}
                  >
                    <User className="h-3 w-3 text-orange-300" />
                  </div>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full text-white px-3 py-2.5 pl-10 rounded-lg outline-none transition-all text-xs"
                    style={{
                      background: 'rgba(0, 0, 0, 0.6)',
                      border: '1.5px solid rgba(249, 115, 22, 0.25)',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                      e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                      e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                    }}
                    placeholder="Soyadınız"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-300 mb-1.5">
                E-posta Adresi
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-lg grid place-items-center"
                  style={{
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.25)',
                  }}
                >
                  <Mail className="h-3 w-3 text-orange-300" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full text-white px-3 py-2.5 pl-10 rounded-lg outline-none transition-all text-xs"
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1.5px solid rgba(249, 115, 22, 0.25)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                  }}
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            {/* Subject Field */}
            <div>
              <label htmlFor="title" className="block text-xs font-semibold text-gray-300 mb-1.5">
                Konu
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-lg grid place-items-center"
                  style={{
                    background: 'rgba(249, 115, 22, 0.15)',
                    border: '1px solid rgba(249, 115, 22, 0.25)',
                  }}
                >
                  <MessageSquare className="h-3 w-3 text-orange-300" />
                </div>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full text-white px-3 py-2.5 pl-10 rounded-lg outline-none transition-all text-xs"
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1.5px solid rgba(249, 115, 22, 0.25)',
                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                    e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                    e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                  }}
                  placeholder="Mesajınızın konusu"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="text" className="block text-xs font-semibold text-gray-300 mb-1.5">
                Mesaj
              </label>
              <textarea
                id="text"
                name="text"
                value={formData.text}
                onChange={handleChange}
                required
                rows={4}
                className="w-full text-white px-3 py-2.5 rounded-lg outline-none transition-all text-xs resize-none"
                style={{
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: '1.5px solid rgba(249, 115, 22, 0.25)',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.6)';
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1), inset 0 2px 4px rgba(0,0,0,0.2)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.25)';
                  e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)';
                }}
                placeholder="Mesajınızı buraya yazın..."
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 text-black font-bold transition-all rounded-xl relative overflow-hidden group text-xs"
              style={{
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(249, 115, 22, 0.9), rgba(249, 115, 22, 1))',
                boxShadow: '0 8px 24px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
              }}
              whileHover={{ scale: loading ? 1 : 1.02, y: loading ? 0 : -2 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.5), inset 0 1px 0 rgba(255,255,255,0.4)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.3)';
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent" />
                  <span>Gönderiliyor...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>Mesaj Gönder</span>
                </div>
              )}
            </motion.button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default ContactForm;





