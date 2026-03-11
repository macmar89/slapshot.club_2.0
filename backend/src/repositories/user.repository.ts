import { db as dbDefault } from '../db';
import { notDeleted } from '../db/helpers';

export const userRepository = {
  async getSubscriptionPlanById(userId: string) {
    const result = await dbDefault.query.users.findFirst({
      columns: { subscriptionPlan: true },
      where: (u, { eq, and }) => and(eq(u.id, userId), notDeleted(u)),
    });

    return result?.subscriptionPlan ?? null;
  },
};
