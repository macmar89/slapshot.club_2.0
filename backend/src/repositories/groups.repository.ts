import { eq, sql } from 'drizzle-orm';
import { db as defaultDb } from '../db';
import { groups } from '../db/schema';
import { notDeleted } from '../db/helpers';

export const groupRepository = {
  async getById(groupId: string, columns?: string[]) {
    const result = await defaultDb.query.groups.findFirst({
      columns: columns
        ? columns.reduce((acc, column) => ({ ...acc, [column]: true }), {})
        : undefined,
      where: (g, { eq }) => eq(g.id, groupId),
    });

    return result ?? null;
  },

  async getIdBySlug(slug: string): Promise<string | null> {
    const result = await defaultDb.query.groups.findFirst({
      columns: { id: true },
      where: (table, { eq, and }) => and(eq(table.slug, slug), notDeleted(table)),
    });
    return result?.id ?? null;
  },

  async updateGroup(groupId: string, updates: Partial<typeof groups.$inferInsert>, tx?: any) {
    const db = tx ?? defaultDb;

    return await db.update(groups).set(updates).where(eq(groups.id, groupId));
  },

  async deleteGroup(groupId: string, tx?: any) {
    const db = tx ?? defaultDb;

    return await db
      .update(groups)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(groups.id, groupId));
  },

  async updateGroupMaxCapacity(groupId: string, direction: 'inc' | 'dec', boost: number, tx?: any) {
    const db = tx ?? defaultDb;
    const isInc = direction === 'inc';

    return await db
      .update(groups)
      .set({
        maxMembers: isInc
          ? sql`LEAST(${groups.maxMembers} + ${boost}, ${groups.absoluteMaxCapacity})`
          : sql`${groups.maxMembers} - ${boost}`,
      })
      .where(eq(groups.id, groupId));
  },

  async incrementMaxMembers(groupId: string, boost: number, tx?: any) {
    return await this.updateGroupMaxCapacity(groupId, 'inc', boost, tx);
  },

  async decrementMaxMembers(groupId: string, boost: number, tx?: any) {
    return await this.updateGroupMaxCapacity(groupId, 'dec', boost, tx);
  },

  async updateGroupMemberStats(groupId: string, direction: 'inc' | 'dec', tx?: any) {
    const db = tx ?? defaultDb;
    const isInc = direction === 'inc';

    return await db
      .update(groups)
      .set({
        statsMembersCount: isInc
          ? sql`${groups.statsMembersCount} + 1`
          : sql`GREATEST(${groups.statsMembersCount} - 1, 0)`,
      })
      .where(eq(groups.id, groupId));
  },

  async incrementMemberCount(groupId: string, tx?: any) {
    return await this.updateGroupMemberStats(groupId, 'inc', tx);
  },

  async decrementMemberCount(groupId: string, tx?: any) {
    return await this.updateGroupMemberStats(groupId, 'dec', tx);
  },

  async updatePendingMembersCount(groupId: string, direction: 'inc' | 'dec', tx?: any) {
    const db = tx ?? defaultDb;

    const updateValue =
      direction === 'inc'
        ? sql`${groups.statsPendingMembersCount} + 1`
        : sql`GREATEST(${groups.statsPendingMembersCount} - 1, 0)`;

    await db
      .update(groups)
      .set({
        statsPendingMembersCount: updateValue,
      })
      .where(eq(groups.id, groupId));
  },

  async incrementPendingMembersCount(groupId: string, tx?: any) {
    return this.updatePendingMembersCount(groupId, 'inc', tx);
  },

  async decrementPendingMembersCount(groupId: string, tx?: any) {
    return this.updatePendingMembersCount(groupId, 'dec', tx);
  },

  async getSettingsById(groupId: string) {
    return defaultDb.query.groups.findFirst({
      columns: {
        code: true,
        status: true,
        warningExpiresAt: true,
        maxMembers: true,
        statsMembersCount: true,
        isAliasRequired: true,
        absoluteMaxCapacity: true,
        createdAt: true,
        settings: true,
      },
      where: (g, { eq }) => eq(g.id, groupId),
    });
  },

  async updateGroupOwner(groupId: string, ownerId: string, tx: any) {
    const db = tx ?? defaultDb;

    await db.update(groups).set({ ownerId }).where(eq(groups.id, groupId));
  },

  async getCompetitionIdByGroupId(groupId: string): Promise<string | null> {
    const result = await defaultDb.query.groups.findFirst({
      columns: { competitionId: true },
      where: (table, { eq }) => eq(table.id, groupId),
    });
    return result?.competitionId ?? null;
  },
};
