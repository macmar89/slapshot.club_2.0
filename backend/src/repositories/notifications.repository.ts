import { db as defaultDb } from '../db/index.js';
import { notifications } from '../db/schema/index.js';
import { eq, and } from 'drizzle-orm';
import type { NotificationPayload, CreateNotificationData } from '../types/notifications.types.js';

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

  async getByUserId(userId: string, limit = 20, cursorDate?: string) {
    return await defaultDb.query.notifications.findMany({
      where: (n, { eq, and, lt }) => {
        const filters = [eq(n.userId, userId)];
        if (cursorDate) {
          filters.push(lt(n.createdAt, new Date(cursorDate)));
        }
        return and(...filters);
      },
      orderBy: (n, { desc }) => [desc(n.createdAt)],
      limit,
    });
  },

  async getUnreadCountByUserId(userId: string): Promise<number> {
    const result = await defaultDb.query.notifications.findMany({
      columns: { id: true },
      where: (n, { eq, and }) => and(eq(n.userId, userId), eq(n.isRead, false)),
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
};
