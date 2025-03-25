import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';

// Define the user interface
export interface User {
  email: string;
  principalId: string;
  balance: number;
  isVerified: boolean;
  createdAt: string;
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
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
  authClient: AuthClient | null;
  principalId: string | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  initialize: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, principalId: string) => Promise<void>;
  logout: () => Promise<void>;
  
  // Transaction methods
  sendPayment: (recipient: string, amount: number, description?: string) => Promise<void>;
  fetchTransactions: () => Promise<void>;
  
  // User methods
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (user: Partial<User>) => Promise<void>;
}

// Create the store
export const usePayChainStore = create<PayChainState>()(
  persist(
    (set, get) => ({
      isInitialized: false,
      isAuthenticated: false,
      user: null,
      authClient: null,
      principalId: null,
      transactions: [],
      isLoading: false,
      error: null,
      
      // Authentication methods
      initialize: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // Mock initialization for now - this would be replaced with actual Internet Computer authentication
          const authClient = await AuthClient.create();
          const isAuthenticated = await authClient.isAuthenticated();
          
          set({
            isInitialized: true,
            isAuthenticated,
            authClient,
            isLoading: false,
          });
          
          // If user is authenticated, fetch their profile
          if (isAuthenticated) {
            const identity = authClient.getIdentity();
            const principal = identity.getPrincipal();
            set({ principalId: principal.toString() });
            
            // Fetch user profile
            await get().fetchUserProfile();
          }
        } catch (error) {
          console.error('Initialization error:', error);
          set({ isLoading: false, error: 'Failed to initialize the application.' });
        }
      },
      
      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // This is a mock implementation - would be replaced with actual backend call
          // In a real app, we would call the backend to authenticate
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          const mockUser: User = {
            email,
            principalId: 'user-123abc456def',
            balance: 1000.00,
            isVerified: true,
            createdAt: new Date().toISOString(),
          };
          
          const mockTransactions: Transaction[] = [
            {
              id: '1',
              amount: 50,
              fromAddress: 'user-123abc456def',
              toAddress: 'user-789xyz',
              timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              status: 'completed',
              type: 'payment',
              description: 'Payment for services',
            },
            {
              id: '2',
              amount: 100,
              fromAddress: 'user-abc123',
              toAddress: 'user-123abc456def',
              timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              status: 'completed',
              type: 'payment',
              description: 'Monthly subscription',
            },
          ];
          
          set({
            isAuthenticated: true,
            user: mockUser,
            principalId: mockUser.principalId,
            transactions: mockTransactions,
            isLoading: false,
          });
        } catch (error) {
          console.error('Login error:', error);
          set({ isLoading: false, error: 'Invalid email or password.' });
          throw new Error('Login failed');
        }
      },
      
      register: async (email: string, password: string, principalId: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // This is a mock implementation - would be replaced with actual backend call
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock successful registration
          set({
            isLoading: false,
          });
        } catch (error) {
          console.error('Registration error:', error);
          set({ isLoading: false, error: 'Registration failed. Please try again.' });
          throw new Error('Registration failed');
        }
      },
      
      logout: async () => {
        try {
          set({ isLoading: true });
          
          // Clear auth state
          const { authClient } = get();
          if (authClient) {
            await authClient.logout();
          }
          
          // Reset the store
          set({
            isAuthenticated: false,
            user: null,
            principalId: null,
            transactions: [],
            isLoading: false,
          });
        } catch (error) {
          console.error('Logout error:', error);
          set({ isLoading: false, error: 'Failed to logout.' });
        }
      },
      
      // Transaction methods
      sendPayment: async (recipient: string, amount: number, description?: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // This is a mock implementation - would be replaced with actual backend call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user, transactions } = get();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Create a new transaction
          const newTransaction: Transaction = {
            id: Math.random().toString(36).substring(2, 11),
            amount,
            fromAddress: user.principalId,
            toAddress: recipient,
            timestamp: new Date().toISOString(),
            status: 'completed',
            type: 'payment',
            description,
          };
          
          // Update user balance
          const updatedUser = {
            ...user,
            balance: user.balance - amount,
          };
          
          // Update the store with the new transaction and updated user
          set({
            user: updatedUser,
            transactions: [newTransaction, ...transactions],
            isLoading: false,
          });
        } catch (error) {
          console.error('Payment error:', error);
          set({ isLoading: false, error: 'Failed to send payment. Please try again.' });
          throw new Error('Payment failed');
        }
      },
      
      fetchTransactions: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // This is a mock implementation - would be replaced with actual backend call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          // Mock transactions data
          const mockTransactions: Transaction[] = [
            {
              id: '1',
              amount: 50,
              fromAddress: get().principalId || '',
              toAddress: 'user-789xyz',
              timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
              status: 'completed',
              type: 'payment',
              description: 'Payment for services',
            },
            {
              id: '2',
              amount: 100,
              fromAddress: 'user-abc123',
              toAddress: get().principalId || '',
              timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
              status: 'completed',
              type: 'payment',
              description: 'Monthly subscription',
            },
            {
              id: '3',
              amount: 25,
              fromAddress: get().principalId || '',
              toAddress: 'user-def456',
              timestamp: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
              status: 'completed',
              type: 'payment',
              description: 'Lunch',
            },
          ];
          
          set({ transactions: mockTransactions, isLoading: false });
        } catch (error) {
          console.error('Fetch transactions error:', error);
          set({ isLoading: false, error: 'Failed to fetch transactions.' });
        }
      },
      
      // User methods
      fetchUserProfile: async () => {
        try {
          set({ isLoading: true, error: null });
          
          // This is a mock implementation - would be replaced with actual backend call
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const { principalId } = get();
          
          if (!principalId) {
            throw new Error('User not authenticated');
          }
          
          // Mock user data
          const mockUser: User = {
            email: 'demo@paychain.ic',
            principalId: principalId,
            balance: 1000.00,
            isVerified: true,
            createdAt: new Date(Date.now() - 2592000000).toISOString(), // 30 days ago
          };
          
          set({ user: mockUser, isLoading: false });
        } catch (error) {
          console.error('Fetch user profile error:', error);
          set({ isLoading: false, error: 'Failed to fetch user profile.' });
        }
      },
      
      updateUserProfile: async (updatedUserData: Partial<User>) => {
        try {
          set({ isLoading: true, error: null });
          
          // This is a mock implementation - would be replaced with actual backend call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const { user } = get();
          
          if (!user) {
            throw new Error('User not authenticated');
          }
          
          // Update the user with the new data
          const updatedUser = {
            ...user,
            ...updatedUserData,
          };
          
          set({ user: updatedUser, isLoading: false });
        } catch (error) {
          console.error('Update user profile error:', error);
          set({ isLoading: false, error: 'Failed to update user profile.' });
          throw new Error('Update profile failed');
        }
      },
    }),
    {
      name: 'paychain-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        principalId: state.principalId,
        user: state.user,
      }),
    }
  )
); 