export interface PaginatedMeta {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  status: 'success';
  data: T[];
  meta: PaginatedMeta;
}
