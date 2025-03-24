import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { usePayChainStore } from '../store/paychainStore';

interface AuthContextType {
  isAuthenticated: boolean;
  principal: Principal | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [principal, setPrincipal] = useState<Principal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { fetchBalance, fetchRecentTransactions } = usePayChainStore();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authClient = await AuthClient.create();
      const identity = authClient.getIdentity();
      const userPrincipal = identity.getPrincipal();
      // Check if the principal is anonymous (2vxsx-fae)
      const isAuthed = userPrincipal.toText() !== '2vxsx-fae';
      
      setIsAuthenticated(isAuthed);
      // Use type assertion to handle Principal type compatibility
      setPrincipal(isAuthed ? (userPrincipal as any) : null);
      
      if (isAuthed) {
        await fetchBalance();
        await fetchRecentTransactions();
      }
    } catch (err) {
      setError('Failed to check authentication status');
      console.error('Auth check error:', err);
    } finally {
      setLoading(false);
    }
  };

  const login = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authClient = await AuthClient.create();
      await authClient.login({
        identityProvider: 'https://identity.ic0.app',
        onSuccess: () => {
          const identity = authClient.getIdentity();
          const userPrincipal = identity.getPrincipal();
          setIsAuthenticated(true);
          // Use type assertion to handle Principal type compatibility
          setPrincipal(userPrincipal as any);
          fetchBalance();
          fetchRecentTransactions();
        },
      });
    } catch (err) {
      setError('Failed to login');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const authClient = await AuthClient.create();
      await authClient.logout();
      
      setIsAuthenticated(false);
      setPrincipal(null);
    } catch (err) {
      setError('Failed to logout');
      console.error('Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        principal,
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 