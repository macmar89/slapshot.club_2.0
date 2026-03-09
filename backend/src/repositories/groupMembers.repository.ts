import { db as defaultDb } from '../db';
import { groupMembers } from '../db/schema';

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
};
