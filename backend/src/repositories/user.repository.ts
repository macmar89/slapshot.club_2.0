import { db as dbDefault } from '../db/index.js';
import { notDeleted } from '../db/helpers.js';

export const userRepository = {
  async getSubscriptionPlanById(userId: string) {
    const result = await dbDefault.query.users.findFirst({
      columns: { subscriptionPlan: true },
      where: (u, { eq, and }) => and(eq(u.id, userId), notDeleted(u)),
    });

    return result?.subscriptionPlan ?? null;
  },

  async getUsernameById(userId: string) {
    const result = await dbDefault.query.users.findFirst({
      columns: { username: true },
      where: (u, { eq, and }) => and(eq(u.id, userId), notDeleted(u)),
    });

    return result?.username ?? null;
  },

  async getAllActiveUserIds() {
    const result = await dbDefault.query.users.findMany({
      columns: { id: true },
      where: (u) => notDeleted(u),
    });

    return result.map((r) => r.id);
  },

  async getAdminAndEditorUserIds() {
    const result = await dbDefault.query.users.findMany({
      columns: { id: true },
      where: (u, { inArray, and, eq }) =>
        and(inArray(u.role, ['admin', 'editor']), eq(u.isActive, true), notDeleted(u)),
    });

    return result.map((r) => r.id);
  },

  async getUserInfoForNotification(userId: string) {
    return await dbDefault.query.users.findFirst({
      columns: { username: true, email: true },
      where: (u, { eq, and }) => and(eq(u.id, userId), notDeleted(u)),
    });
  },
};
