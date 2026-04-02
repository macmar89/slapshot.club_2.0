'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { SortConfig } from './use-table-filters';

export function useTableFiltersUrl<T extends Record<string, unknown>>(
  initialFilters: T,
  initialSort: SortConfig = { by: 'date', order: 'asc' },
  initialLimit: number = 10
) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialFiltersRef = useRef(initialFilters);

  // Helper to parse filters from URL
  const parseFiltersFromUrl = useCallback(() => {
    const filtersFromUrl = { ...initialFiltersRef.current };
    searchParams.forEach((value, key) => {
      const match = key.match(/^filters\[(.*)\]$/);
      if (match) {
        const filterKey = match[1] as keyof T;
        if (value === 'true') (filtersFromUrl[filterKey] as unknown) = true;
        else if (value === 'false') (filtersFromUrl[filterKey] as unknown) = false;
        else (filtersFromUrl[filterKey] as unknown) = value;
      }
    });
    return filtersFromUrl;
  }, [searchParams]);

  // Initial state from URL or fallback to initial
  const [filters, setFilters] = useState<T>(() => parseFiltersFromUrl());
  const [page, setPage] = useState(() => Number(searchParams.get('page')) || 1);
  const [limit, setLimit] = useState(() => Number(searchParams.get('limit')) || initialLimit);
  const [sort, setSort] = useState<SortConfig>(() => ({
    by: searchParams.get('sort[by]') || initialSort.by,
    order: (searchParams.get('sort[order]') as 'asc' | 'desc') || initialSort.order,
  }));

  // Sync internal state with URL updates (e.g. back button)
  useEffect(() => {
    const newFilters = parseFiltersFromUrl();
    const newPage = Number(searchParams.get('page')) || 1;
    const newLimit = Number(searchParams.get('limit')) || initialLimit;
    const newSort = {
      by: searchParams.get('sort[by]') || initialSort.by,
      order: (searchParams.get('sort[order]') as 'asc' | 'desc') || initialSort.order,
    };

    // Deep compare filters to avoid infinite loops
    if (JSON.stringify(newFilters) !== JSON.stringify(filters)) {
      setFilters(newFilters);
    }
    if (newPage !== page) setPage(newPage);
    if (newLimit !== limit) setLimit(newLimit);
    if (newSort.by !== sort.by || newSort.order !== sort.order) setSort(newSort);
  }, [searchParams, initialLimit, initialSort.by, initialSort.order, filters, page, limit, sort, parseFiltersFromUrl]);

  const updateUrl = useCallback((newParams: URLSearchParams) => {
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  }, [router, pathname]);

  const updateFilter = useCallback((key: keyof T, value: unknown) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update internal state
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);

    // Update URL
    params.set('page', '1');
    if (value === undefined || value === null || value === '') {
      params.delete(`filters[${String(key)}]`);
    } else {
      params.set(`filters[${String(key)}]`, String(value));
    }
    updateUrl(params);
  }, [searchParams, updateUrl]);

  const handlePageChange = useCallback((newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    setPage(newPage);
    params.set('page', String(newPage));
    updateUrl(params);
  }, [searchParams, updateUrl]);

  const handleSortChange = useCallback((newSort: SortConfig) => {
    const params = new URLSearchParams(searchParams.toString());
    setSort(newSort);
    params.set('sort[by]', newSort.by);
    params.set('sort[order]', newSort.order);
    updateUrl(params);
  }, [searchParams, updateUrl]);

  const buildQueryString = useCallback(() => {
    return searchParams.toString();
  }, [searchParams]);

  return {
    filters,
    updateFilter,
    page,
    setPage: handlePageChange,
    limit,
    setLimit,
    sort,
    setSort: handleSortChange,
    buildQueryString,
  };
}
