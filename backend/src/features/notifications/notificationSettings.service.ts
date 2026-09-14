import { notificationSettingsRepository } from './notificationSettings.repository.js';
import type { UserNotificationSettings } from '../../types/user.types.js';
import type { UpdateNotificationSettingsInput } from './notificationSettings.schema.js';

export const DEFAULT_NOTIFICATION_SETTINGS: UserNotificationSettings = {
  matchFinished: { inApp: true, push: true },
  pointsAwarded: { inApp: true, push: true },
  groupInvites: { inApp: true, push: true },
  marketingNews: { inApp: true, push: false },
  dailyTipsReminder: { email: true },
};

const mergeWithDefaults = (
  settings: Partial<UserNotificationSettings> | null,
): UserNotificationSettings => ({
  ...DEFAULT_NOTIFICATION_SETTINGS,
  ...settings,
  dailyTipsReminder: {
    ...DEFAULT_NOTIFICATION_SETTINGS.dailyTipsReminder,
    ...settings?.dailyTipsReminder,
  },
});

export const getNotificationSettings = async (userId: string) => {
  const raw = await notificationSettingsRepository.getByUserId(userId);
  return mergeWithDefaults(raw);
};

export const updateNotificationSettings = async (
  userId: string,
  patch: UpdateNotificationSettingsInput,
) => {
  const current = await getNotificationSettings(userId);
  const updated: UserNotificationSettings = {
    ...current,
    dailyTipsReminder: patch.dailyTipsReminder ?? current.dailyTipsReminder,
  };

  await notificationSettingsRepository.updateByUserId(userId, updated);

  return updated;
};
