import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePayChainStore } from '../store/paychainStore';
import { Principal } from '@dfinity/principal';

interface AuthContextType {
  isAuthenticated: boolean;
  principal: Principal | null;
  loading: boolean;
  error: string | null;
  logout: () => Promise<void>;
}

const defaultContext: AuthContextType = {
  isAuthenticated: false,
  principal: null,
  loading: true,
  error: null,
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user, initialize, logout } = usePayChainStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      await initialize();
    } catch (err) {
      console.error('Auth check failed:', err);
      setError('Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
      setError('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Create a Principal from the user's principalId string if available
  const principal = user?.principalId 
    ? Principal.fromText(user.principalId) 
    : null;

  const value = {
    isAuthenticated,
    principal,
    loading,
    error,
    logout: handleLogout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 