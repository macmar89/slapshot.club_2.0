import { db } from '../../db/index.js';
import { users, matches } from '../../db/schema/index.js';
import { count, sql } from 'drizzle-orm';
import { notDeleted } from '../../db/helpers.js';

export const getDashboardStats = async () => {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const seventyTwoHoursFromNow = new Date(now.getTime() + 72 * 60 * 60 * 1000);

  const [userStats] = await db
    .select({
      total: count(users.id),
      unverified: sql<number>`count(case when ${users.verifiedAt} is null then 1 end)`,
      inactive1w: sql<number>`count(case when ${users.lastActiveAt} < ${oneWeekAgo.toISOString()} then 1 end)`,
      inactive2w: sql<number>`count(case when ${users.lastActiveAt} < ${twoWeeksAgo.toISOString()} then 1 end)`,
      inactive1m: sql<number>`count(case when ${users.lastActiveAt} < ${oneMonthAgo.toISOString()} then 1 end)`,
    })
    .from(users)
    .where(notDeleted(users));

  const roleStats = await db
    .select({
      role: users.role,
      count: count(users.id),
    })
    .from(users)
    .where(notDeleted(users))
    .groupBy(users.role);

  const planStats = await db
    .select({
      plan: users.subscriptionPlan,
      count: count(users.id),
    })
    .from(users)
    .where(notDeleted(users))
    .groupBy(users.subscriptionPlan);

  const [matchStats] = await db
    .select({
      unverified72h: sql<number>`count(case when ${matches.isChecked} = false and ${matches.date} <= ${seventyTwoHoursFromNow.toISOString()} and ${matches.date} >= ${now.toISOString()} then 1 end)`,
      unrankedFinished: sql<number>`count(case when ${matches.status} = 'finished' and ${matches.rankedAt} is null then 1 end)`,
    })
    .from(matches);

  return {
    users: {
      total: Number(userStats?.total || 0),
      unverified: Number(userStats?.unverified || 0),
      inactive1w: Number(userStats?.inactive1w || 0),
      inactive2w: Number(userStats?.inactive2w || 0),
      inactive1m: Number(userStats?.inactive1m || 0),
      roles: (roleStats || []).reduce((acc: any, curr) => ({ ...acc, [curr.role]: Number(curr.count) }), {}),
      plans: (planStats || []).reduce((acc: any, curr) => ({ ...acc, [curr.plan]: Number(curr.count) }), {}),
    },
    matches: {
      unverified72h: Number(matchStats?.unverified72h || 0),
      unrankedFinished: Number(matchStats?.unrankedFinished || 0),
    },
  };
};
