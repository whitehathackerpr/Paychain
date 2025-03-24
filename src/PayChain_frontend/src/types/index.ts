import { Principal } from '@dfinity/principal';

// Define a generic Principal type that matches both versions
export interface GenericPrincipal {
  raw: Uint8Array;
  toText(): string;
  toBlob(): Uint8Array;
}

// System Types
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  activeUsers: number;
  systemLoad: number;
  memoryUsage: number;
  errorRate: number;
  lastCheck: number;
}

export interface SystemStats {
  totalTransactions: number;
  activeUsers: number;
  errorRate: number;
  averageResponseTime: number;
  totalVolume: number;
  blockedUsers: number;
  pendingKyc: number;
  rejectedKyc: number;
  totalRefunds: number;
  totalFraudulentTransactions: number;
  systemHealth: SystemHealth;
  errorStats: {
    totalErrors: number;
    errorByCategory: [string, number][];
    recentErrors: PayChainError[];
    errorRate: number;
  };
  velocityStats: {
    averageTransactionVelocity: number;
    peakTransactionVelocity: number;
    velocityByHour: [number, number][];
    velocityByCategory: [string, number][];
  };
}

// Transaction Types
export interface Transaction {
  id: string;
  from: GenericPrincipal;
  to: GenericPrincipal;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'fraudulent';
  timestamp: number;
  category: string;
  tags: string[];
  metadata: Record<string, any>;
  nftReceiptId?: number;
  error?: {
    code: number;
    message: string;
    category: string;
  };
}

export interface TransactionStats {
  totalVolume: number;
  successRate: number;
  averageAmount: number;
  categoryDistribution: Record<string, number>;
}

// Security Types
export interface UserSecurity {
  id: string;
  principal: string;
  kycStatus: 'pending' | 'approved' | 'rejected';
  riskScore: number;
  isBlocked: boolean;
  blockExpiry?: number;
  lastActivity: number;
  ipAddress: string;
  deviceFingerprint: string;
  suspiciousActivities: {
    type: string;
    timestamp: number;
    details: string;
  }[];
}

export interface SecurityStats {
  totalUsers: number;
  blockedUsers: number;
  pendingKyc: number;
  rejectedKyc: number;
  averageRiskScore: number;
  suspiciousActivities: number;
}

// Analytics Types
export interface AnalyticsData {
  transactionVolume: {
    daily: [number, number][];
    weekly: [number, number][];
    monthly: [number, number][];
  };
  userActivity: {
    activeUsers: number;
    newUsers: number;
    retentionRate: number;
    averageSessionDuration: number;
  };
  riskMetrics: {
    fraudRate: number;
    suspiciousTransactions: number;
    averageRiskScore: number;
    riskDistribution: [string, number][];
  };
  categoryDistribution: [string, number][];
  errorStats: {
    totalErrors: number;
    errorByCategory: [string, number][];
    errorRate: number;
  };
  predictiveAnalytics: {
    forecastedVolume: number;
    confidence: number;
    contributingFactors: string[];
  };
}

export interface PredictiveAnalytics {
  forecast: {
    volume: number;
    confidence: number;
    factors: string[];
  };
  riskPrediction: {
    probability: number;
    factors: string[];
  };
  userBehavior: {
    pattern: 'regular' | 'anomaly' | 'seasonal' | 'trend';
    confidence: number;
  };
}

// Error Types
export interface PayChainError {
  id: string;
  code: number;
  category: string;
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  resolution?: {
    type: 'automatic' | 'manual' | 'hybrid' | 'escalated';
    attempts: number;
    lastAttempt: number;
    result: 'success' | 'failure' | 'pending';
    notes: string;
  };
  affectedTransactions: string[];
  stackTrace?: string;
  metadata: Record<string, any>;
}

export interface ErrorStats {
  totalErrors: number;
  openErrors: number;
  resolvedErrors: number;
  errorByCategory: [string, number][];
  errorBySeverity: [string, number][];
  averageResolutionTime: number;
  resolutionRate: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}

// Filter Types
export interface TransactionFilter {
  status?: string;
  type?: string;
  category?: string;
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
}

export interface SecurityFilter {
  status?: string;
  kycStatus?: string;
  riskLevel?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface AnalyticsFilter {
  timeRange: 'daily' | 'weekly' | 'monthly';
  dateRange?: {
    start: string;
    end: string;
  };
  metrics?: string[];
}

export interface ErrorFilter {
  type?: string;
  severity?: string;
  status?: string;
  dateRange?: {
    start: string;
    end: string;
  };
}

export interface NFTReceipt {
  id: number;
  transactionId: number;
  metadata: {
    amount: number;
    timestamp: bigint;
    from: string;
    to: string;
  };
}

export type Result<T, E> = { ok: T } | { err: E };

export interface PayChainState {
  balance: number | null;
  recentTransactions: Transaction[];
  loading: boolean;
  error: string | null;
  fetchBalance: () => Promise<void>;
  fetchRecentTransactions: () => Promise<void>;
  processPayment: (to: GenericPrincipal, amount: number) => Promise<Result<number, string>>;
  getNFTReceipt: (id: number) => Promise<NFTReceipt | null>;
} 