import { eq } from 'drizzle-orm';
import { db as defaultDb } from '../../db/index.js';
import { users } from '../../db/schema/users.js';
import { notDeleted } from '../../db/helpers.js';
import type { UserNotificationSettings } from '../../types/user.types.js';

export const notificationSettingsRepository = {
  async getByUserId(userId: string) {
    const result = await defaultDb.query.users.findFirst({
      columns: { notificationSettings: true },
      where: (u, { eq, and }) => and(eq(u.id, userId), notDeleted(u)),
    });

    return result?.notificationSettings ?? null;
  },

  async updateByUserId(userId: string, settings: UserNotificationSettings) {
    await defaultDb
      .update(users)
      .set({ notificationSettings: settings })
      .where(eq(users.id, userId));
  },
};
