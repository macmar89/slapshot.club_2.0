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

export type NotificationPreference = {
  inApp: boolean;
  push: boolean;
};

export type UserNotificationSettings = {
  matchFinished: NotificationPreference;
  pointsAwarded: NotificationPreference;
  groupInvites: NotificationPreference;
  marketingNews: NotificationPreference;
};
