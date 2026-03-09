import { eq, sql } from 'drizzle-orm';
import { db as defaultDb } from '../db';
import { groups } from '../db/schema';

export const groupRepository = {
  async updateGroupStats(groupId: string, incrementMaxMembers?: number, tx?: any) {
    const db = tx ?? defaultDb;
    return await db
      .update(groups)
      .set({
        statsMembersCount: sql`${groups.statsMembersCount} + 1`,
        maxMembers: incrementMaxMembers
          ? sql`${groups.maxMembers} + ${incrementMaxMembers}`
          : groups.maxMembers,
      })
      .where(eq(groups.id, groupId));
  },
};
