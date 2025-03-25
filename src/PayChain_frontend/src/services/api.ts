import axios, { AxiosResponse, AxiosError } from 'axios';
import { API_ENDPOINTS } from '../constants';
import type {
  SystemStats,
  Transaction,
  TransactionStatus,
  UserBalance,
  UserSecurity,
  AnalyticsData,
  PayChainError,
  ApiResponse,
  PaginatedResponse,
  TransactionFilter,
  SecurityFilter,
  AnalyticsFilter,
  ErrorFilter,
} from '../types';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// System Stats
export const getSystemStats = async (): Promise<ApiResponse<SystemStats>> => {
  const response = await api.get<ApiResponse<SystemStats>>(API_ENDPOINTS.SYSTEM_STATS);
  return response.data;
};

// Transactions
export const getTransactions = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: TransactionFilter
): Promise<PaginatedResponse<Transaction>> => {
  const response = await api.get<PaginatedResponse<Transaction>>(API_ENDPOINTS.TRANSACTIONS, {
    params: { page, pageSize, ...filters },
  });
  return response.data;
};

export const getTransactionById = async (id: string): Promise<ApiResponse<Transaction>> => {
  const response = await api.get<ApiResponse<Transaction>>(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
  return response.data;
};

export const updateTransaction = async (
  id: string,
  data: Partial<Transaction>
): Promise<ApiResponse<Transaction>> => {
  const response = await api.patch<ApiResponse<Transaction>>(`${API_ENDPOINTS.TRANSACTIONS}/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id: string): Promise<ApiResponse<void>> => {
  const response = await api.delete<ApiResponse<void>>(`${API_ENDPOINTS.TRANSACTIONS}/${id}`);
  return response.data;
};

// Security
export const getSecurityUsers = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: SecurityFilter
): Promise<PaginatedResponse<UserSecurity>> => {
  const response = await api.get<PaginatedResponse<UserSecurity>>(`${API_ENDPOINTS.SECURITY}/users`, {
    params: { page, pageSize, ...filters },
  });
  return response.data;
};

export const updateUserSecurity = async (
  id: string,
  data: Partial<UserSecurity>
): Promise<ApiResponse<UserSecurity>> => {
  const response = await api.patch<ApiResponse<UserSecurity>>(`${API_ENDPOINTS.SECURITY}/users/${id}`, data);
  return response.data;
};

export const blockUser = async (id: string): Promise<ApiResponse<UserSecurity>> => {
  const response = await api.post<ApiResponse<UserSecurity>>(`${API_ENDPOINTS.SECURITY}/users/${id}/block`);
  return response.data;
};

export const unblockUser = async (id: string): Promise<ApiResponse<UserSecurity>> => {
  const response = await api.post<ApiResponse<UserSecurity>>(`${API_ENDPOINTS.SECURITY}/users/${id}/unblock`);
  return response.data;
};

// Analytics
export const getAnalytics = async (filters?: AnalyticsFilter): Promise<ApiResponse<AnalyticsData>> => {
  const response = await api.get<ApiResponse<AnalyticsData>>(API_ENDPOINTS.ANALYTICS, { params: filters });
  return response.data;
};

// Errors
export const getErrors = async (
  page: number = 1,
  pageSize: number = 10,
  filters?: ErrorFilter
): Promise<PaginatedResponse<PayChainError>> => {
  const response = await api.get<PaginatedResponse<PayChainError>>(API_ENDPOINTS.ERRORS, {
    params: { page, pageSize, ...filters },
  });
  return response.data;
};

export const getErrorById = async (id: string): Promise<ApiResponse<PayChainError>> => {
  const response = await api.get<ApiResponse<PayChainError>>(`${API_ENDPOINTS.ERRORS}/${id}`);
  return response.data;
};

export const updateError = async (
  id: string,
  data: Partial<PayChainError>
): Promise<ApiResponse<PayChainError>> => {
  const response = await api.patch<ApiResponse<PayChainError>>(`${API_ENDPOINTS.ERRORS}/${id}`, data);
  return response.data;
};

export const resolveError = async (id: string): Promise<ApiResponse<PayChainError>> => {
  const response = await api.post<ApiResponse<PayChainError>>(`${API_ENDPOINTS.ERRORS}/${id}/resolve`);
  return response.data;
};

// Error Interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 