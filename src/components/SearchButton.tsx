import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchButtonProps {
  onClick: () => void;
}

const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 left-6 z-40 group"
      whileHover={{ scale: 1.1, y: -2 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 1 }}
    >
      {/* Outer Glow Ring */}
      <div 
        className="absolute -inset-2 rounded-full blur-lg opacity-30 group-hover:opacity-60 transition-all duration-500"
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.6), rgba(249, 115, 22, 0.4), rgba(249, 115, 22, 0.6))'
        }}
      ></div>
      
      {/* Main Button */}
      <div 
        className="relative text-white font-bold py-2.5 px-4 transition-all duration-500 shadow-lg rounded-xl overflow-hidden group/btn"
        style={{
          background: 'linear-gradient(135deg, rgba(249, 115, 22, 1), rgba(249, 115, 22, 0.9), rgba(249, 115, 22, 1))',
          border: '1px solid rgba(249, 115, 22, 0.5)',
          boxShadow: '0 8px 24px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.3)',
          backdropFilter: 'blur(8px)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = '0 12px 32px rgba(249,115,22,0.5), inset 0 1px 0 rgba(255,255,255,0.4)';
          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.7)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(249,115,22,0.4), inset 0 1px 0 rgba(255,255,255,0.3)';
          e.currentTarget.style.borderColor = 'rgba(249, 115, 22, 0.5)';
        }}
      >
        {/* Button glow effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.2), rgba(249, 115, 22, 0.2))'
          }}
        ></div>
        
        {/* Content */}
        <div className="relative z-10 flex items-center gap-2">
          <Search className="w-4 h-4 group-hover/btn:rotate-12 transition-transform duration-300" />
          <span className="text-xs font-bold tracking-wide">ARA</span>
        </div>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl"
          style={{
            background: 'linear-gradient(110deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
          }}
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      </div>
      
      {/* Floating particles effect */}
      <div 
        className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: 'rgba(249, 115, 22, 0.8)',
        }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background: 'rgba(249, 115, 22, 0.8)',
          }}
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      <div 
        className="absolute -bottom-0.5 -left-0.5 w-1 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100"
        style={{
          background: 'rgba(249, 115, 22, 0.8)',
        }}
      >
        <motion.div
          className="w-full h-full rounded-full"
          style={{
            background: 'rgba(249, 115, 22, 0.8)',
          }}
          animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
        />
      </div>
    </motion.button>
  );
};

export default SearchButton;





