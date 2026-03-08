export type UserRole = 'admin' | 'editor' | 'user' | 'demo';
export type SubscriptionPlan = 'free' | 'pro' | 'vip';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlan;
  subscriptionActiveUntil: string;
  isVerified: boolean;
  referralCode: string;
  createdAt?: string;
}
