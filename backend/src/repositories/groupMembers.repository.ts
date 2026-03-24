import { db as defaultDb } from '../db/index.js';
import { groupMembers, users } from '../db/schema/index.js';
import { and, eq, sql, inArray, ilike } from 'drizzle-orm';
import { notDeleted } from '../db/helpers.js';
import { mapGroupMembers } from '../utils/mappers/group.mappers.js';
import type { GroupMemberStatus } from '../shared/constants/schema/group.schema.js';
import type { GroupRole } from '../types/group.types.js';

export const groupMembersRepository = {
  async getMemberById(memberId: string, columns?: string[]) {
    const result = await defaultDb.query.groupMembers.findFirst({
      columns: columns
        ? columns.reduce((acc, column) => ({ ...acc, [column]: true }), {})
        : undefined,
      where: (gm, { eq }) => eq(gm.id, memberId),
    });

    return result ?? null;
  },

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

  async updateStatus(memberId: string, status: GroupMemberStatus, tx?: any) {
    const db = tx ?? defaultDb;

    await db.update(groupMembers).set({ status }).where(eq(groupMembers.id, memberId));
  },

  async updateMemberRole(memberId: string, groupId: string, role: GroupRole, tx?: any) {
    const db = tx ?? defaultDb;

    return await db
      .update(groupMembers)
      .set({ role })
      .where(and(eq(groupMembers.id, memberId), eq(groupMembers.groupId, groupId)))
      .returning({ userId: groupMembers.userId });
  },

  async updateMemberRoleByUserId(userId: string, groupId: string, role: GroupRole, tx: any) {
    const db = tx ?? defaultDb;

    return await db
      .update(groupMembers)
      .set({ role })
      .where(and(eq(groupMembers.userId, userId), eq(groupMembers.groupId, groupId)))
      .returning({ userId: groupMembers.userId });
  },

  async getByGroupId(groupId: string, userId: string, search?: string) {
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
      where: (table, { eq, and, exists }) => {
        const conditions = [eq(table.groupId, groupId)];

        if (search) {
          conditions.push(
            exists(
              defaultDb
                .select()
                .from(users)
                .where(and(eq(users.id, table.userId), ilike(users.username, `%${search}%`))),
            ),
          );
        }

        return and(...conditions);
      },
      orderBy: (table, { asc }) => [
        asc(sql`CASE 
          WHEN ${table.role} = 'owner' THEN 1 
          WHEN ${table.role} = 'admin' THEN 2 
          ELSE 3 
        END`),
        asc(table.createdAt),
      ],
    });

    return mapGroupMembers(result, userId);
  },

  async getMembersWithSubscriptionPlanById(groupId: string) {
    return await defaultDb.query.groupMembers.findMany({
      columns: {
        id: true,
        userId: true,
      },
      with: {
        user: {
          columns: { subscriptionPlan: true },
        },
      },
      where: (table, { eq, and }) => and(eq(table.groupId, groupId), eq(table.status, 'active')),
    });
  },

  async getUserById(memberId: string, status?: GroupMemberStatus[]): Promise<string | null> {
    const result = await defaultDb.query.groupMembers.findFirst({
      columns: { userId: true },
      where: (gm, { eq, inArray, and }) => {
        const filters = [eq(gm.id, memberId), notDeleted(gm)];

        if (status) {
          filters.push(inArray(gm.status, status));
        }

        return and(...filters);
      },
    });

    return result?.userId ?? null;
  },

  async getUserIdsByGroupId(groupId: string, status?: GroupMemberStatus[]) {
    const result = await defaultDb.query.groupMembers.findMany({
      columns: { userId: true },
      where: (gm, { eq, and, inArray }) => {
        const filters = [eq(gm.groupId, groupId), notDeleted(gm)];

        if (status) {
          filters.push(inArray(gm.status, status));
        }

        return and(...filters);
      },
    });

    return result.map((item) => item.userId);
  },

  async removeMember(memberId: string, groupId: string, tx?: any) {
    const db = tx ?? defaultDb;

    await db
      .delete(groupMembers)
      .where(and(eq(groupMembers.id, memberId), eq(groupMembers.groupId, groupId)));
  },

  async getAdminsByGroupId(groupId: string) {
    const result = await defaultDb.query.groupMembers.findMany({
      columns: { userId: true },
      where: (gm, { eq, and, or, inArray }) =>
        and(
          eq(gm.groupId, groupId),
          eq(gm.status, 'active'),
          inArray(gm.role, ['owner', 'admin']),
        ),
    });

    return result.map((item) => item.userId);
  },
};
