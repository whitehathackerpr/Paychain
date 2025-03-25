import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { backendAdapter } from '../services/backendAdapter';

// Define the user interface
export interface User {
  id: number;
  email: string;
  principalId: string;
  name?: string;
  balance?: number;
  avatar?: string;
  isVerified?: boolean;
}

// Define the transaction interface
export interface Transaction {
  id: string;
  amount: number;
  fromAddress: string;
  toAddress: string;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
  type: 'payment' | 'deposit' | 'withdrawal';
  description?: string;
}

// Define the store state interface
export interface PayChainState {
  isAuthenticated: boolean;
  isInitialized: boolean;
  isLoading: boolean;
  user: User | null;
  error: string | null;
  transactions: Transaction[];
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, principalId: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => Promise<void>;
  fetchUserProfile: () => Promise<void>;
  fetchTransactions: () => Promise<void>;
  sendPayment: (recipientAddress: string, amount: number, description?: string) => Promise<any>;
}

// Create the store
export const usePayChainStore = create<PayChainState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      isInitialized: false,
      isLoading: false,
      user: null,
      error: null,
      transactions: [],

      initialize: async () => {
        try {
          // Check if user is already logged in
          if (backendAdapter.auth.isAuthenticated()) {
            set({ isLoading: true });
            const userData = await backendAdapter.auth.getCurrentUser();
            
            set({ 
              isAuthenticated: true, 
              user: userData,
              isInitialized: true,
              isLoading: false,
              error: null 
            });

            // Fetch transactions if user is authenticated
            get().fetchTransactions();
          } else {
            set({ 
              isAuthenticated: false, 
              user: null,
              isInitialized: true,
              isLoading: false,
              error: null 
            });
          }
        } catch (error) {
          console.error('Failed to initialize auth state:', error);
          set({ 
            isAuthenticated: false, 
            user: null, 
            isInitialized: true,
            isLoading: false,
            error: 'Authentication failed during initialization' 
          });
        }
      },

      login: async (email: string, password: string) => {
        try {
          set({ error: null, isLoading: true });
          const userData = await backendAdapter.auth.login(email, password);
          set({ 
            isAuthenticated: true, 
            user: userData.user,
            isLoading: false,
            error: null 
          });
          
          // Fetch transactions after login
          get().fetchTransactions();
        } catch (error) {
          console.error('Login error:', error);
          set({ 
            isAuthenticated: false, 
            user: null,
            isLoading: false,
            error: 'Invalid email or password' 
          });
          throw error;
        }
      },

      register: async (email: string, password: string, principalId: string) => {
        try {
          set({ error: null, isLoading: true });
          await backendAdapter.auth.register(email, password, principalId);
          // After registration, log the user in
          await get().login(email, password);
        } catch (error) {
          console.error('Registration error:', error);
          set({ error: 'Registration failed. Please try again.', isLoading: false });
          throw error;
        }
      },

      logout: async () => {
        backendAdapter.auth.logout();
        set({ 
          isAuthenticated: false, 
          user: null,
          transactions: [],
          error: null 
        });
      },

      updateUser: async (data: Partial<User>) => {
        try {
          set({ error: null, isLoading: true });
          const currentUser = get().user;
          if (!currentUser || !currentUser.id) {
            throw new Error('No user logged in');
          }
          
          await backendAdapter.users.updateUser(currentUser.id.toString(), data);
          
          // Update local state with new user data
          set({
            user: { ...currentUser, ...data },
            isLoading: false,
            error: null
          });
        } catch (error) {
          console.error('Update user error:', error);
          set({ error: 'Failed to update user profile', isLoading: false });
          throw error;
        }
      },

      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          const userData = await backendAdapter.auth.getCurrentUser();
          set({ 
            user: userData,
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Error fetching user profile:', error);
          set({ 
            isLoading: false,
            error: 'Failed to fetch user profile'
          });
        }
      },

      fetchTransactions: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await backendAdapter.transactions.getTransactions();
          set({ 
            transactions: response.data || [], 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          console.error('Error fetching transactions:', error);
          set({ 
            isLoading: false,
            error: 'Failed to fetch transactions'
          });
        }
      },

      sendPayment: async (recipientAddress: string, amount: number, description?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          const paymentData = {
            recipient_principal: recipientAddress,
            amount,
            description
          };
          
          const response = await backendAdapter.transactions.createTransaction(paymentData);
          
          // After successful payment, refresh transactions
          await get().fetchTransactions();
          
          set({ isLoading: false, error: null });
          return response;
        } catch (error) {
          console.error('Error sending payment:', error);
          set({ 
            isLoading: false,
            error: 'Failed to send payment'
          });
          throw error;
        }
      }
    }),
    {
      name: 'paychain-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
); 