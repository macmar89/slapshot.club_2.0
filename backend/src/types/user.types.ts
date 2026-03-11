export type UserSubscriptionPlan = 'free' | 'starter' | 'pro' | 'vip';

export type UserRole = 'admin' | 'editor' | 'user';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  subscriptionPlan: UserSubscriptionPlan;
  subscriptionActiveUntil: string;
  isVerified: boolean;
}
