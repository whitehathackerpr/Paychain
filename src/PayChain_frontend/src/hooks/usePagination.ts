import { useState, useCallback, useMemo } from 'react';
import { PAGINATION } from '../constants';

interface UsePaginationOptions {
  totalItems: number;
  initialPageSize?: number;
  initialPage?: number;
  onChange?: (page: number, pageSize: number) => void;
}

export const usePagination = ({
  totalItems,
  initialPageSize = PAGINATION.DEFAULT_PAGE_SIZE,
  initialPage = 1,
  onChange,
}: UsePaginationOptions) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const totalPages = useMemo(() => Math.ceil(totalItems / pageSize), [totalItems, pageSize]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setPage(newPage);
        onChange?.(newPage, pageSize);
      }
    },
    [totalPages, pageSize, onChange]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      setPageSize(newPageSize);
      setPage(1); // Reset to first page when changing page size
      onChange?.(1, newPageSize);
    },
    [onChange]
  );

  const nextPage = useCallback(() => {
    if (page < totalPages) {
      handlePageChange(page + 1);
    }
  }, [page, totalPages, handlePageChange]);

  const previousPage = useCallback(() => {
    if (page > 1) {
      handlePageChange(page - 1);
    }
  }, [page, handlePageChange]);

  const goToFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  const goToLastPage = useCallback(() => {
    handlePageChange(totalPages);
  }, [totalPages, handlePageChange]);

  const getPageRange = useCallback(() => {
    const delta = 2; // Number of pages to show before and after current page
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 || // First page
        i === totalPages || // Last page
        (i >= page - delta && i <= page + delta) // Pages around current page
      ) {
        range.push(i);
      }
    }

    for (let i = 0; i < range.length; i++) {
      if (l) {
        if (range[i] - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (range[i] - l !== 1) {
          rangeWithDots.push('...');
        }
      }
      rangeWithDots.push(range[i]);
      l = range[i];
    }

    return rangeWithDots;
  }, [page, totalPages]);

  const getPageItems = useCallback(
    <T>(items: T[]): T[] => {
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      return items.slice(startIndex, endIndex);
    },
    [page, pageSize]
  );

  return {
    page,
    pageSize,
    totalPages,
    totalItems,
    handlePageChange,
    handlePageSizeChange,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    getPageRange,
    getPageItems,
  };
}; 