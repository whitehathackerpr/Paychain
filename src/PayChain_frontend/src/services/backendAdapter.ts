/**
 * Backend API Adapter for PayChain
 * 
 * This file provides a service layer that abstracts the API communication
 * between the front-end React application and the FastAPI backend.
 */

import axios from 'axios';

// API base URL - can be overridden with environment variable
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include authorization header
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service
const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/login/', { email, password });
    if (response.data.access_token) {
      localStorage.setItem('token', response.data.access_token);
    }
    return response.data;
  },
  
  register: async (email: string, password: string, principalId: string) => {
    return await api.post('/users/', { 
      email, 
      password, 
      principal_id: principalId 
    });
  },
  
  getCurrentUser: async () => {
    return await api.get('/users/me/');
  },
  
  logout: () => {
    localStorage.removeItem('token');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};

// Transaction service
const transactionService = {
  getTransactions: async (skip = 0, limit = 100) => {
    const response = await api.get(`/transactions/?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  createTransaction: async (recipientPrincipal: string, amount: number, description?: string, metadata?: any) => {
    return await api.post('/transactions/', {
      recipient_principal: recipientPrincipal,
      amount,
      description,
      metadata
    });
  },
  
  getBalance: async () => {
    const response = await api.get('/balance/');
    return response.data.balance;
  }
};

// Template service
const templateService = {
  getTemplates: async () => {
    const response = await api.get('/templates/');
    return response.data;
  },
  
  createTemplate: async (templateData: any) => {
    return await api.post('/templates/', templateData);
  }
};

// System health service
const systemService = {
  getHealth: async () => {
    return await api.get('/health');
  }
};

// Add new service methods to support scheduled payments
const scheduledPaymentsService = {
  getScheduledPayments: async () => {
    return await api.get('/scheduled-payments/');
  },
  
  createScheduledPayment: async (paymentData: any) => {
    return await api.post('/scheduled-payments/', paymentData);
  },
  
  updateScheduledPayment: async (paymentId: number, paymentData: any) => {
    return await api.put(`/scheduled-payments/${paymentId}`, paymentData);
  },
  
  deleteScheduledPayment: async (paymentId: number) => {
    return await api.delete(`/scheduled-payments/${paymentId}`);
  }
};

// Add analytics service
const analyticsService = {
  getTransactionSummary: async (period: 'week' | 'month' | 'year' = 'month') => {
    return await api.get(`/reports/transaction-summary/?period=${period}`);
  },
  
  getSpendingByCategory: async (period: 'week' | 'month' | 'year' = 'month') => {
    return await api.get(`/reports/spending-categories/?period=${period}`);
  }
};

// Add NFT receipt service
const nftReceiptService = {
  getNFTReceipts: async () => {
    return await api.get('/nft-receipts/');
  }
};

// Update the user profile service
const userService = {
  getUserProfile: async () => {
    return await api.get('/users/me/');
  },
  
  updateUserProfile: async (profileData: any) => {
    return await api.put('/users/me/', profileData);
  }
};

// Format Principal ID for display
const formatPrincipalId = (principalId: string): string => {
  if (!principalId) return '';
  if (principalId.length <= 10) return principalId;
  return `${principalId.substring(0, 5)}...${principalId.substring(principalId.length - 5)}`;
};

// Export all services as a single cohesive adapter
export const backendAdapter = {
  auth: authService,
  transactions: transactionService,
  templates: templateService,
  system: systemService,
  scheduledPayments: scheduledPaymentsService,
  analytics: analyticsService,
  nftReceipts: nftReceiptService,
  user: userService,
  utils: {
    formatPrincipalId
  }
}; 