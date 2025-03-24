import { useState, useCallback, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  field: keyof T;
  direction: SortDirection;
}

interface UseSortingOptions<T> {
  initialSort?: SortConfig<T>;
  onChange?: (sort: SortConfig<T>) => void;
}

export const useSorting = <T extends Record<string, any>>({
  initialSort,
  onChange,
}: UseSortingOptions<T> = {}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(initialSort || null);

  const handleSort = useCallback(
    (field: keyof T) => {
      setSortConfig((prev) => {
        let direction: SortDirection = 'asc';

        if (prev?.field === field) {
          direction = prev.direction === 'asc' ? 'desc' : 'asc';
        }

        const newSort = { field, direction };
        onChange?.(newSort);
        return newSort;
      });
    },
    [onChange]
  );

  const clearSort = useCallback(() => {
    setSortConfig(null);
    onChange?.(null as any);
  }, [onChange]);

  const getSortIcon = useCallback(
    (field: keyof T) => {
      if (sortConfig?.field !== field) return '↕️';
      return sortConfig.direction === 'asc' ? '↑' : '↓';
    },
    [sortConfig]
  );

  const sortData = useCallback(
    <K extends T>(data: K[]): K[] => {
      if (!sortConfig) return data;

      return [...data].sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return 1;
        if (bValue === null || bValue === undefined) return -1;

        const comparison = aValue < bValue ? -1 : 1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    },
    [sortConfig]
  );

  const getSortField = useCallback(() => sortConfig?.field, [sortConfig]);

  const getSortDirection = useCallback(() => sortConfig?.direction, [sortConfig]);

  const isSorted = useCallback(
    (field: keyof T) => sortConfig?.field === field,
    [sortConfig]
  );

  const getSortLabel = useCallback(
    (field: keyof T) => {
      if (!isSorted(field)) return 'Sort';
      return `Sort ${sortConfig?.direction === 'asc' ? 'Ascending' : 'Descending'}`;
    },
    [isSorted, sortConfig]
  );

  return {
    sortConfig,
    handleSort,
    clearSort,
    getSortIcon,
    sortData,
    getSortField,
    getSortDirection,
    isSorted,
    getSortLabel,
  };
}; 