export type UserRole = 'admin' | 'editor' | 'user' | 'demo';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  subscriptionPlan: string;
  subscriptionActiveUntil: string;
  isVerified: boolean;
}
