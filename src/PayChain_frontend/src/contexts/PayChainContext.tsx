import React, { createContext, useContext, ReactNode } from 'react';
import { usePayChainStore } from '../store/paychainStore';

interface PayChainContextType {
  // Add any additional context properties here
  isAuthenticated: boolean;
  user: any;
}

const PayChainContext = createContext<PayChainContextType | undefined>(undefined);

export const usePayChain = () => {
  const context = useContext(PayChainContext);
  if (context === undefined) {
    throw new Error('usePayChain must be used within a PayChainProvider');
  }
  return context;
};

interface PayChainProviderProps {
  children: ReactNode;
}

export const PayChainProvider: React.FC<PayChainProviderProps> = ({ children }) => {
  const { isAuthenticated, user } = usePayChainStore();

  const value = {
    isAuthenticated,
    user,
  };

  return (
    <PayChainContext.Provider value={value}>
      {children}
    </PayChainContext.Provider>
  );
}; 