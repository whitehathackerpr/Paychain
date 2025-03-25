/**
 * Backend API Adapter for PayChain
 * 
 * This file provides a service layer that abstracts the API communication
 * between the front-end React application and the FastAPI backend.
 */

import axios from 'axios';

// Setup axios defaults - adjust the base URL as needed
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8001';
axios.defaults.headers.common['Content-Type'] = 'application/json';

// Add request interceptor to include auth token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add error logger
const logError = async (error: any, component?: string) => {
  try {
    // Only log if we have axios error information
    if (error && error.response) {
      console.error('API Error:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method,
        headers: error.config.headers
      });
      
      // Send error to backend for logging
      await axios.post('/api/log-error', {
        message: `API ${error.config.method?.toUpperCase()} ${error.config.url} failed: ${error.response.status}`,
        stack: error.stack,
        url: error.config.url,
        component
      }).catch(e => console.error('Failed to log error:', e));
    } else {
      console.error('Non-API Error:', error);
    }
  } catch (e) {
    // Don't let error logging cause additional errors
    console.error('Error during error logging:', e);
  }
};

// Add response interceptor for debugging
axios.interceptors.response.use(
  response => response,
  error => {
    logError(error);
    return Promise.reject(error);
  }
);

export const backendAdapter = {
  // Authentication methods
  auth: {
    login: async (email: string, password: string) => {
      try {
        console.log('Login attempt for:', email);
        // Using query parameters instead of JSON body to avoid CORS preflight
        const response = await axios.get(`/api/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        console.log('Login response:', response.data);
        localStorage.setItem('token', response.data.access_token);
        return response.data;
      } catch (error) {
        console.error('Login error details:', error);
        await logError(error, 'Login');
        throw error;
      }
    },
    register: async (email: string, password: string, principalId: string) => {
      try {
        // Using query parameters instead of JSON body to avoid CORS preflight
        const response = await axios.get(`/api/register?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}&principal_id=${encodeURIComponent(principalId)}`);

        return response;
      } catch (error) {
        console.error('Registration error:', error);
        await logError(error, 'Register');
        throw error;
      }
    },
    getCurrentUser: async () => {
      try {
        const response = await axios.get('/users/me');
        return response.data;
      } catch (error) {
        console.error('Error fetching current user:', error);
        throw error;
      }
    },
    logout: () => {
      localStorage.removeItem('token');
    },
    isAuthenticated: () => {
      return !!localStorage.getItem('token');
    }
  },

  // User management
  users: {
    getUsers: async () => {
      try {
        const response = await axios.get('/users');
        return response;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    getUserById: async (id: string) => {
      try {
        const response = await axios.get(`/users/${id}`);
        return response;
      } catch (error) {
        console.error(`Error fetching user ${id}:`, error);
        throw error;
      }
    },
    updateUser: async (id: string, data: any) => {
      try {
        const response = await axios.put(`/users/${id}`, data);
        return response;
      } catch (error) {
        console.error('Error updating user:', error);
        throw error;
      }
    }
  },

  // Transaction management
  transactions: {
    getTransactions: async () => {
      try {
        const response = await axios.get('/transactions');
        return response;
      } catch (error) {
        console.error('Error fetching transactions:', error);
        throw error;
      }
    },
    getTransactionById: async (id: string) => {
      try {
        const response = await axios.get(`/transactions/${id}`);
        return response;
      } catch (error) {
        console.error(`Error fetching transaction ${id}:`, error);
        throw error;
      }
    },
    createTransaction: async (data: any) => {
      try {
        const response = await axios.post('/transactions', data);
        return response;
      } catch (error) {
        console.error('Error creating transaction:', error);
        throw error;
      }
    },
    getBalance: async () => {
      try {
        const response = await axios.get('/balance');
        return response.data.balance;
      } catch (error) {
        console.error('Error fetching balance:', error);
        throw error;
      }
    }
  },

  // Scheduled payments
  scheduledPayments: {
    getScheduledPayments: async () => {
      try {
        const response = await axios.get('/scheduled-payments');
        return response;
      } catch (error) {
        console.error('Error fetching scheduled payments:', error);
        throw error;
      }
    },
    createScheduledPayment: async (data: any) => {
      try {
        const response = await axios.post('/scheduled-payments', data);
        return response;
      } catch (error) {
        console.error('Error creating scheduled payment:', error);
        throw error;
      }
    },
    updateScheduledPayment: async (id: string, data: any) => {
      try {
        const response = await axios.put(`/scheduled-payments/${id}`, data);
        return response;
      } catch (error) {
        console.error('Error updating scheduled payment:', error);
        throw error;
      }
    },
    deleteScheduledPayment: async (id: string) => {
      try {
        const response = await axios.delete(`/scheduled-payments/${id}`);
        return response;
      } catch (error) {
        console.error('Error deleting scheduled payment:', error);
        throw error;
      }
    }
  },

  // NFT receipts
  nftReceipts: {
    getNFTReceipts: async () => {
      try {
        const response = await axios.get('/nft-receipts');
        return response;
      } catch (error) {
        console.error('Error fetching NFT receipts:', error);
        throw error;
      }
    },
    getNFTReceiptById: async (id: string) => {
      try {
        const response = await axios.get(`/nft-receipts/${id}`);
        return response;
      } catch (error) {
        console.error(`Error fetching NFT receipt ${id}:`, error);
        throw error;
      }
    },
    generateNFTReceipt: async (transactionId: string) => {
      try {
        const response = await axios.post(`/nft-receipts/generate`, { transaction_id: transactionId });
        return response;
      } catch (error) {
        console.error('Error generating NFT receipt:', error);
        throw error;
      }
    }
  },

  // Analytics
  analytics: {
    getTransactionSummary: async (period: string = 'month') => {
      try {
        const response = await axios.get(`/analytics/transactions?period=${period}`);
        return response;
      } catch (error) {
        console.error('Error fetching transaction summary:', error);
        throw error;
      }
    },
    getSpendingByCategory: async (period: string = 'month') => {
      try {
        const response = await axios.get(`/analytics/spending?period=${period}`);
        return response;
      } catch (error) {
        console.error('Error fetching spending by category:', error);
        throw error;
      }
    }
  },

  // QR Code generation
  qrCode: {
    generateReceiveQR: async (amount?: number, description?: string) => {
      try {
        const params = new URLSearchParams();
        if (amount) params.append('amount', amount.toString());
        if (description) params.append('description', description);
        
        const response = await axios.get(`/qr-codes/receive?${params.toString()}`);
        return response.data;
      } catch (error) {
        console.error('Error generating receive QR code:', error);
        throw error;
      }
    },
    generateShareableLink: async (amount?: number, description?: string) => {
      try {
        const params = new URLSearchParams();
        if (amount) params.append('amount', amount.toString());
        if (description) params.append('description', description);
        
        const response = await axios.get(`/payment-links/generate?${params.toString()}`);
        return response.data.paymentLink;
      } catch (error) {
        console.error('Error generating shareable link:', error);
        throw error;
      }
    }
  },

  // Notification service
  notifications: {
    getNotifications: async () => {
      const response = await axios.get('/notifications');
      return {
        notifications: response.data.notifications || [],
        unreadCount: response.data.unread_count || 0
      };
    },
    getUnreadCount: async () => {
      const response = await axios.get('/notifications/unread-count');
      return {
        count: response.data.count || 0
      };
    },
    markAsRead: async (notificationId: string) => {
      await axios.post(`/notifications/${notificationId}/read`);
    },
    markAllAsRead: async () => {
      await axios.post('/notifications/mark-all-read');
    }
  },

  // Utility functions
  utils: {
    /**
     * Formats a principal ID for display by truncating the middle
     * @param principalId - The principal ID to format
     * @param startChars - Number of characters to show at the start
     * @param endChars - Number of characters to show at the end
     * @returns Formatted principal ID
     */
    formatPrincipalId: (principalId: string | undefined | null, startChars = 6, endChars = 4): string => {
      if (!principalId || principalId.length <= startChars + endChars) {
        return principalId || '';
      }
      return `${principalId.substring(0, startChars)}...${principalId.substring(principalId.length - endChars)}`;
    }
  }
};