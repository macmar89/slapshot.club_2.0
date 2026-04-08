import { db as defaultDb } from '../db/index.js';
import { notifications } from '../db/schema/index.js';
import { eq, and, inArray, lt, sql } from 'drizzle-orm';
import type { NotificationPayload, CreateNotificationData } from '../types/notifications.types.js';
import { NOTIFICATION_GROUPS } from '../constants/notifications.constants.js';

function getTypesForGroups(groupParam: string | string[]): string[] {
  if (!groupParam) return [];
  const groups = Array.isArray(groupParam) ? groupParam : [groupParam];
  if (groups.includes('ALL')) return [];

  const types: string[] = [];
  for (const g of groups) {
    if (NOTIFICATION_GROUPS[g as keyof typeof NOTIFICATION_GROUPS]) {
      types.push(...NOTIFICATION_GROUPS[g as keyof typeof NOTIFICATION_GROUPS]);
    }
  }
  return types;
}

export const notificationsRepository = {
  async create(data: CreateNotificationData, tx?: any) {
    const db = tx ?? defaultDb;
    const [notification] = await db.insert(notifications).values(data).returning();
    return notification;
  },

  async bulkCreate(data: CreateNotificationData[], tx?: any) {
    if (data.length === 0) return [];
    const db = tx ?? defaultDb;
    return await db.insert(notifications).values(data).returning();
  },

  async getByUserId(
    userId: string,
    limit = 20,
    cursorDate?: string,
    groupParam?: string | string[],
  ) {
    return await defaultDb.query.notifications.findMany({
      where: (n, { eq, and, lt, inArray }) => {
        const filters = [eq(n.userId, userId)];
        if (cursorDate) {
          filters.push(lt(n.createdAt, new Date(cursorDate)));
        }
        if (groupParam && groupParam !== 'ALL') {
          const types = getTypesForGroups(groupParam);
          if (types.length > 0) {
            filters.push(inArray(n.type, types as any));
          } else {
            // Invalid group, block all
            filters.push(eq(n.type, 'NONE' as any));
          }
        }
        return and(...filters);
      },
      orderBy: (n, { desc }) => [desc(n.createdAt)],
      limit,
    });
  },

  async getUnreadCountByUserId(userId: string, groupParam?: string | string[]): Promise<number> {
    const result = await defaultDb.query.notifications.findMany({
      columns: { id: true },
      where: (n, { eq, and, inArray }) => {
        const filters = [eq(n.userId, userId), eq(n.isRead, false)];
        if (groupParam && groupParam !== 'ALL') {
          const types = getTypesForGroups(groupParam);
          if (types.length > 0) {
            filters.push(inArray(n.type, types as any));
          } else {
            // Invalid group, block all
            filters.push(eq(n.type, 'NONE' as any));
          }
        }
        return and(...filters);
      },
    });
    return result.length;
  },

  async markAsRead(id: string, userId: string) {
    const [updated] = await defaultDb
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.userId, userId)))
      .returning({ id: notifications.id });
    return updated ?? null;
  },

  async markAllAsRead(userId: string) {
    await defaultDb
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  },
  async markAnnouncementAsRead(userId: string, slug: string) {
    await defaultDb
      .update(notifications)
      .set({ isRead: true })
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.type, 'NEW_ANNOUNCEMENT'),
          eq(notifications.isRead, false),
          sql`${notifications.payload}->>'announcementSlug' = ${slug}`
        )
      );
  },
};
