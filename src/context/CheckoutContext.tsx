import { createContext, useContext, useState, type ReactNode } from 'react';

interface CheckoutContextType {
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
};

interface CheckoutProviderProps {
  children: ReactNode;
}

export const CheckoutProvider = ({ children }: CheckoutProviderProps) => {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);

  return (
    <CheckoutContext.Provider value={{ isCheckoutModalOpen, setIsCheckoutModalOpen }}>
      {children}
    </CheckoutContext.Provider>
  );
};





