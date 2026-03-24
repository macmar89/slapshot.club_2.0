import { z } from 'zod';
import { NOTIFICATION_GROUP } from '../../../constants/notifications.constants.js';

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getNotificationBodySchema = z.object({
  group: z.enum(NOTIFICATION_GROUP),
});

export const getNotificationsSchema = z.object({
  query: z.object({
    limit: z.number().optional(),
    cursorDate: z.string().optional(),
  }),
  body: getNotificationBodySchema,
});

export type GetNotificationsInput = z.infer<typeof getNotificationBodySchema>;
