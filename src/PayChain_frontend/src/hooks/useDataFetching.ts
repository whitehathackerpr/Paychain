import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { ERROR_MESSAGES } from '../constants';

interface UseDataFetchingOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
  showError?: boolean;
  showSuccess?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export const useDataFetching = <T>(
  fetchFunction: () => Promise<T>,
  options: UseDataFetchingOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    onSuccess,
    onError,
    showError = true,
    showSuccess = false,
    successMessage,
    errorMessage,
  } = options;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await fetchFunction();
        setData(result);
        if (onSuccess) {
          onSuccess(result);
        }
        if (showSuccess && successMessage) {
          enqueueSnackbar(successMessage, { variant: 'success' });
        }
      } catch (err) {
        setError(err as Error);
        if (onError) {
          onError(err);
        }
        if (showError) {
          enqueueSnackbar(errorMessage || ERROR_MESSAGES.UNKNOWN, {
            variant: 'error',
          });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [fetchFunction, onSuccess, onError, showError, showSuccess, successMessage, errorMessage, enqueueSnackbar]);

  return { data, loading, error, setData, setLoading, setError };
}; 