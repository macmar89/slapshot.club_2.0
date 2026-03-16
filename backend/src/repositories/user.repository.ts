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
};
