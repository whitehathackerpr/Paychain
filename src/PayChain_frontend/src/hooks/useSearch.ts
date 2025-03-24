import { useState, useCallback, useMemo } from 'react';
import { debounce } from '../utils/helpers';
import { TIME } from '../constants';

interface SearchConfig {
  fields: string[];
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
  caseSensitive?: boolean;
}

interface UseSearchOptions {
  config: SearchConfig;
  onChange?: (searchTerm: string) => void;
  debounceTime?: number;
}

export const useSearch = ({
  config,
  onChange,
  debounceTime = TIME.DEBOUNCE_DELAY,
}: UseSearchOptions) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const debouncedOnChange = useMemo(
    () =>
      debounce((term: string) => {
        onChange?.(term);
      }, debounceTime),
    [onChange, debounceTime]
  );

  const handleSearch = useCallback(
    (term: string) => {
      if (config.maxLength && term.length > config.maxLength) {
        term = term.slice(0, config.maxLength);
      }

      setSearchTerm(term);
      setIsSearching(term.length >= (config.minLength || 0));
      debouncedOnChange(term);
    },
    [config.maxLength, config.minLength, debouncedOnChange]
  );

  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setIsSearching(false);
    onChange?.('');
  }, [onChange]);

  const searchData = useCallback(
    <T extends Record<string, any>>(data: T[]): T[] => {
      if (!searchTerm || searchTerm.length < (config.minLength || 0)) {
        return data;
      }

      const term = config.caseSensitive ? searchTerm : searchTerm.toLowerCase();

      return data.filter((item) =>
        config.fields.some((field) => {
          const value = item[field];
          if (value === null || value === undefined) return false;

          const stringValue = String(value);
          const searchValue = config.caseSensitive ? stringValue : stringValue.toLowerCase();
          return searchValue.includes(term);
        })
      );
    },
    [searchTerm, config.fields, config.minLength, config.caseSensitive]
  );

  const getSearchPlaceholder = useCallback(() => {
    return (
      config.placeholder ||
      `Search by ${config.fields.join(', ')}${config.minLength ? ` (min ${config.minLength} characters)` : ''}`
    );
  }, [config.placeholder, config.fields, config.minLength]);

  const getSearchValue = useCallback(() => searchTerm, [searchTerm]);

  const setSearchValue = useCallback(
    (value: string) => {
      handleSearch(value);
    },
    [handleSearch]
  );

  return {
    searchTerm,
    isSearching,
    handleSearch,
    clearSearch,
    searchData,
    getSearchPlaceholder,
    getSearchValue,
    setSearchValue,
  };
}; 