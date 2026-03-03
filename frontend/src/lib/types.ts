export type ActionResponse<T> = { success: boolean; data: T } | { success: boolean; error: string };
