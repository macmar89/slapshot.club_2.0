import { z } from 'zod';

export const updateNotificationSettingsSchema = z.object({
  dailyTipsReminder: z
    .object({
      email: z.boolean(),
    })
    .optional(),
});

export const updateNotificationSettingsHandlerSchema = z.object({
  body: updateNotificationSettingsSchema,
});

export type UpdateNotificationSettingsInput = z.infer<typeof updateNotificationSettingsSchema>;
