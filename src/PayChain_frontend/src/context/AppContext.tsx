import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSnackbar, SnackbarKey } from 'notistack';
import type { PayChainState, Transaction, GenericPrincipal } from '../types';

const AppContext = createContext<PayChainState | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [balance, setBalance] = useState<number | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const fetchBalance = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Implement actual balance fetching
      setBalance(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      enqueueSnackbar('Failed to fetch balance', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const fetchRecentTransactions = useCallback(async () => {
    try {
      setLoading(true);
      // TODO: Implement actual transaction fetching
      setRecentTransactions([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
      enqueueSnackbar('Failed to fetch transactions', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const processPayment = useCallback(
    async (to: GenericPrincipal, amount: number) => {
      try {
        setLoading(true);
        // TODO: Implement actual payment processing
        return { ok: 0 };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Payment failed';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        return { err: errorMessage };
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const getNFTReceipt = useCallback(async (id: number) => {
    try {
      setLoading(true);
      // TODO: Implement actual NFT receipt fetching
      return null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch NFT receipt');
      enqueueSnackbar('Failed to fetch NFT receipt', { variant: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const value = {
    balance,
    recentTransactions,
    loading,
    error,
    fetchBalance,
    fetchRecentTransactions,
    processPayment,
    getNFTReceipt,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}; 