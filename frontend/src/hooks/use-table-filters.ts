import { useState, useCallback } from 'react';

export interface SortConfig {
  by: string;
  order: 'asc' | 'desc';
}

export function useTableFilters<T extends Record<string, unknown>>(
  initialFilters: T,
  initialSort: SortConfig = { by: 'date', order: 'asc' },
  initialLimit: number = 10
) {
  const [filters, setFilters] = useState<T>(initialFilters);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(initialLimit);
  const [sort, setSort] = useState<SortConfig>(initialSort);

  const updateFilter = useCallback((key: keyof T, value: unknown) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    // Reset to page 1 whenever filters change
    setPage(1);
  }, []);

  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();
    params.set('page', String(page));
    params.set('limit', String(limit));

    if (sort.by) {
      params.set('sort[by]', sort.by);
      params.set('sort[order]', sort.order);
    }

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        params.set(`filters[${key}]`, String(value));
      }
    });

    return params.toString();
  }, [filters, page, limit, sort]);

  return {
    filters,
    setFilters,
    updateFilter,
    page,
    setPage,
    limit,
    setLimit,
    sort,
    setSort,
    buildQueryString,
  };
}
