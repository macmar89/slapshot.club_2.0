import type { PaginationConfig } from '../types/express.js';
import type { PaginatedResponse } from '../types/pagination.types.js';

export const buildPaginatedResponse = <T>(
  data: T[],
  totalItems: number,
  pagination: PaginationConfig
): PaginatedResponse<T> => {
  return {
    status: 'success',
    data: {
      data,
      meta: {
        totalItems,
        itemsPerPage: pagination.limit,
        currentPage: pagination.page,
        totalPages: Math.ceil(totalItems / pagination.limit),
      },
    },
  };
};
