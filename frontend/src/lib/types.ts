export type ActionResponse<T> = { success: true; data: T } | { success: false; error: string };

export type ApiResponse<T> =
  | { status: 'success'; data: T; error?: never }
  | { status: 'error'; error: string; data?: never };
