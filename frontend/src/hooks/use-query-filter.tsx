import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useMemo } from 'react';
import { useDebouncedCallback } from 'use-debounce';

export const useQueryFilters = (defaultLimit = 10) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filters = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

  const page = Number(filters.page) || 1;
  const limit = Number(filters.limit) || defaultLimit;
  const search = filters.search || '';

  const updateFilters = useCallback(
    (newFilters: Record<string, string | number | null | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newFilters).forEach(([key, value]) => {
        if (value === null || value === undefined || value === '') {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();
      router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handlePageChange = (newPage: number) => {
    updateFilters({ page: newPage });
  };

  const handleSearch = useDebouncedCallback((term: string) => {
    updateFilters({ search: term, page: 1 });
  }, 300);

  return {
    filters,
    page,
    limit,
    search,
    handlePageChange,
    handleSearch,
    updateFilters,
  };
};
