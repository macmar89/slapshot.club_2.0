import { db as defaultDb } from '../db';
import { groupMembers } from '../db/schema';
import { sql } from 'drizzle-orm';
import { notDeleted } from '../db/helpers';
import { mapGroupMembers } from '../utils/mappers/group.mappers';

export const groupMembersRepository = {
  async addMember(
    userId: string,
    groupId: string,
    status: 'active' | 'pending' = 'pending',
    tx?: any,
  ) {
    const db = tx ?? defaultDb;

    await db.insert(groupMembers).values({
      userId,
      groupId,
      status,
    });
  },

  async getByGroupId(groupId: string, search?: string) {
    const result = await defaultDb.query.groupMembers.findMany({
      columns: {
        id: true,
        status: true,
        joinedAt: true,
        role: true,
        alias: true,
        createdAt: true,
      },
      with: {
        user: {
          columns: { id: true, username: true, subscriptionPlan: true },
        },
      },
      where: (table, { eq, and }) => and(eq(table.groupId, groupId), notDeleted(table)),
      orderBy: (table, { asc }) => [
        asc(sql`CASE 
          WHEN ${table.role} = 'owner' THEN 1 
          WHEN ${table.role} = 'admin' THEN 2 
          ELSE 3 
        END`),
        asc(table.createdAt),
      ],
    });

    return mapGroupMembers(result);
  },
};
