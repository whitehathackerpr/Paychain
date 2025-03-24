export const TIME = {
  DEBOUNCE_DELAY: 300,
  REFRESH_INTERVAL: 30000,
  SESSION_TIMEOUT: 3600000,
};

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 25, 50],
  MAX_PAGES_SHOWN: 7,
};

export const ERROR_MESSAGES = {
  UNKNOWN: 'An unknown error occurred',
  VALIDATION: 'Please check your input and try again',
  NETWORK: 'Network error occurred. Please check your connection',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'The requested resource was not found',
  SERVER_ERROR: 'Server error occurred. Please try again later',
};

export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully',
  DELETED: 'Item deleted successfully',
  CREATED: 'Item created successfully',
  UPDATED: 'Item updated successfully',
};

export const API_ENDPOINTS = {
  SYSTEM_STATS: '/api/system-stats',
  TRANSACTIONS: '/api/transactions',
  SECURITY: '/api/security',
  ANALYTICS: '/api/analytics',
  ERRORS: '/api/errors',
  AUTH: '/api/auth',
}; 