import { useState, useCallback, useMemo } from 'react';
import { debounce } from '../utils/helpers';
import { TIME } from '../constants';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  field: string;
  label: string;
  type: 'select' | 'text' | 'date' | 'number' | 'boolean';
  options?: FilterOption[];
  defaultValue?: any;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  validation?: (value: any) => boolean;
  errorMessage?: string;
}

interface UseFiltersOptions {
  filters: FilterConfig[];
  onChange?: (filters: Record<string, any>) => void;
  debounceTime?: number;
}

export const useFilters = ({
  filters,
  onChange,
  debounceTime = TIME.DEBOUNCE_DELAY,
}: UseFiltersOptions) => {
  const [filterValues, setFilterValues] = useState<Record<string, any>>(() => {
    const initialValues: Record<string, any> = {};
    filters.forEach((filter) => {
      initialValues[filter.field] = filter.defaultValue;
    });
    return initialValues;
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateFilters = useCallback(
    (values: Record<string, any>): boolean => {
      const newErrors: Record<string, string> = {};
      let isValid = true;

      filters.forEach((filter) => {
        const value = values[filter.field];
        if (filter.validation && !filter.validation(value)) {
          newErrors[filter.field] = filter.errorMessage || `Invalid ${filter.label}`;
          isValid = false;
        }
      });

      setErrors(newErrors);
      return isValid;
    },
    [filters]
  );

  const handleFilterChange = useCallback(
    (field: string, value: any) => {
      setFilterValues((prev) => {
        const newValues = {
          ...prev,
          [field]: value,
        };

        // Clear error when field is modified
        if (errors[field]) {
          setErrors((prev) => ({
            ...prev,
            [field]: '',
          }));
        }

        return newValues;
      });
    },
    [errors]
  );

  const debouncedOnChange = useMemo(
    () =>
      debounce((values: Record<string, any>) => {
        if (validateFilters(values)) {
          onChange?.(values);
        }
      }, debounceTime),
    [onChange, validateFilters, debounceTime]
  );

  const resetFilters = useCallback(() => {
    const initialValues: Record<string, any> = {};
    filters.forEach((filter) => {
      initialValues[filter.field] = filter.defaultValue;
    });
    setFilterValues(initialValues);
    setErrors({});
    onChange?.(initialValues);
  }, [filters, onChange]);

  const clearFilter = useCallback(
    (field: string) => {
      const filter = filters.find((f) => f.field === field);
      if (filter) {
        handleFilterChange(field, filter.defaultValue);
      }
    },
    [filters, handleFilterChange]
  );

  const getActiveFilters = useCallback(() => {
    return Object.entries(filterValues).filter(([_, value]) => {
      if (value === null || value === undefined) return false;
      if (typeof value === 'string' && value.trim() === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    });
  }, [filterValues]);

  const hasActiveFilters = useMemo(() => getActiveFilters().length > 0, [getActiveFilters]);

  const getFilterValue = useCallback(
    (field: string) => filterValues[field],
    [filterValues]
  );

  const setFilterValue = useCallback(
    (field: string, value: any) => {
      handleFilterChange(field, value);
    },
    [handleFilterChange]
  );

  return {
    filterValues,
    errors,
    handleFilterChange,
    resetFilters,
    clearFilter,
    getActiveFilters,
    hasActiveFilters,
    getFilterValue,
    setFilterValue,
  };
}; 