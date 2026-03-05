import { MatchStatus } from '@/features/competitions/matches/matches.types';

export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

export type ApiResponse<T> =
  | { status: 'success'; data: T; error?: never }
  | { status: 'error'; error: string; data?: never };

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  meta?: Meta;
}

export interface Meta {
  message: string;
  isLocked?: boolean;
  matchStatus?: MatchStatus;
}
