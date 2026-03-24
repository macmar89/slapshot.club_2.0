import { z } from 'zod';
import { NOTIFICATION_GROUP } from '../../../constants/notifications.constants.js';

export const markAsReadSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const getNotificationsQuerySchema = z.object({
  limit: z.coerce.number().optional(),
  cursorDate: z.string().optional(),
  group: z.union([z.string(), z.array(z.string())]).optional().default(NOTIFICATION_GROUP.ALL),
});

export const getNotificationsSchema = z.object({
  query: getNotificationsQuerySchema,
});

export const getUnreadCountSchema = z.object({
  query: z.object({
    group: z.union([z.string(), z.array(z.string())]).optional().default(NOTIFICATION_GROUP.ALL),
  }),
});

export type GetNotificationsQuery = z.infer<typeof getNotificationsQuerySchema>;
