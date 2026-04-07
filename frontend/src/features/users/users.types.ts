export type UserRole = 'admin' | 'editor' | 'user' | 'demo';
export type SubscriptionPlan = 'free' | 'pro' | 'vip' | 'starter';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  subscriptionPlan: SubscriptionPlan;
  subscriptionActiveUntil: string;
  isVerified: boolean;
  referralCode: string;
  hasSeenOnboarding: boolean;
  createdAt?: string;
}
