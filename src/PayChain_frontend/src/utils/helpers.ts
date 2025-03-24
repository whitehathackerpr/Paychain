export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const formatAmount = (amount: number): string => {
  return `${(amount / 1_000_000).toFixed(2)} ICP`;
};

export const formatTime = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

export const formatPercentage = (value: number): string => {
  return `${(value * 100).toFixed(2)}%`;
};

export const formatBytes = (bytes: number): string => {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

export const getStatusColor = (status: string): 'success' | 'warning' | 'error' | 'default' => {
  switch (status.toLowerCase()) {
    case 'completed':
    case 'approved':
    case 'resolved':
      return 'success';
    case 'pending':
    case 'in_progress':
      return 'warning';
    case 'failed':
    case 'rejected':
    case 'blocked':
      return 'error';
    default:
      return 'default';
  }
};

export const getSeverityColor = (severity: string): 'success' | 'warning' | 'error' | 'info' => {
  switch (severity.toLowerCase()) {
    case 'critical':
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'success';
  }
}; 