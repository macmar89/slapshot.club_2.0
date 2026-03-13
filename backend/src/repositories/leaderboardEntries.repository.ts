import { db as defaultDb } from '../db';
import { leaderboardEntries } from '../db/schema';
import { sql, and, eq, inArray } from 'drizzle-orm';

export const leaderboardEntriesRepository = {
  async getStatsByUser(
    userId: string,
    competitionId: string,
  ): Promise<{ statsJoinedPrivateGroups: number; statsOwnedPrivateGroups: number }> {
    const data = await defaultDb.query.leaderboardEntries.findFirst({
      columns: {
        statsJoinedPrivateGroups: true,
        statsOwnedPrivateGroups: true,
      },
      where: (leaderboardEntries, { and, eq }) =>
        and(
          eq(leaderboardEntries.competitionId, competitionId),
          eq(leaderboardEntries.userId, userId),
        ),
    });

    return {
      statsJoinedPrivateGroups: data?.statsJoinedPrivateGroups ?? 0,
      statsOwnedPrivateGroups: data?.statsOwnedPrivateGroups ?? 0,
    };
  },

  async isMember(competitionId: string, userId: string): Promise<boolean> {
    const result = await defaultDb.query.leaderboardEntries.findFirst({
      columns: { id: true },
      where: (table, { eq, and }) =>
        and(eq(table.userId, userId), eq(table.competitionId, competitionId)),
    });
    return !!result;
  },

  async getGroupStatsByUserIds(userIds: string[], competitionId: string, groupId: string) {
    return await defaultDb.query.leaderboardEntries.findMany({
      columns: {
        id: true,
        userId: true,
        currentRank: true,
        totalPoints: true,
        totalPredictions: true,
        exactGuesses: true,
        correctTrends: true,
        correctDiffs: true,
        wrongGuesses: true,
        currentForm: true,
      },
      where: (leaderboardEntries, { and, eq }) =>
        and(
          eq(leaderboardEntries.competitionId, competitionId),
          inArray(leaderboardEntries.userId, userIds),
        ),
      with: {
        user: {
          columns: {
            username: true,
          },
          with: {
            memberships: {
              columns: {
                role: true,
                alias: true,
              },
              where: (gm, { eq }) => eq(gm.groupId, groupId),
            },
          },
        },
      },
      orderBy: (leaderboardEntries, { asc }) => [asc(leaderboardEntries.currentRank)],
    });
  },

  async updateLeaderboardEntriesJoinedPrivateGroups(
    competitionId: string,
    userId: string,
    direction: 'inc' | 'dec',
    tx?: any,
  ) {
    const db = tx ?? defaultDb;
    const isInc = direction === 'inc';

    return await db
      .update(leaderboardEntries)
      .set({
        statsJoinedPrivateGroups: isInc
          ? sql`${leaderboardEntries.statsJoinedPrivateGroups} + 1`
          : sql`GREATEST(${leaderboardEntries.statsJoinedPrivateGroups} - 1, 0)`,
      })
      .where(
        and(
          eq(leaderboardEntries.competitionId, competitionId),
          eq(leaderboardEntries.userId, userId),
        ),
      );
  },

  async incrementJoinedPrivateGroupsCount(competitionId: string, userId: string, tx?: any) {
    return await this.updateLeaderboardEntriesJoinedPrivateGroups(competitionId, userId, 'inc', tx);
  },

  async decrementJoinedPrivateGroupsCount(competitionId: string, userId: string, tx?: any) {
    return await this.updateLeaderboardEntriesJoinedPrivateGroups(competitionId, userId, 'dec', tx);
  },

  async updateLeaderboardEntriesOwnedPrivateGroups(
    competitionId: string,
    userId: string,
    direction: 'inc' | 'dec',
    tx?: any,
  ) {
    const db = tx ?? defaultDb;
    const isInc = direction === 'inc';

    return await db
      .update(leaderboardEntries)
      .set({
        statsOwnedPrivateGroups: isInc
          ? sql`${leaderboardEntries.statsOwnedPrivateGroups} + 1`
          : sql`GREATEST(${leaderboardEntries.statsOwnedPrivateGroups} - 1, 0)`,
      })
      .where(
        and(
          eq(leaderboardEntries.competitionId, competitionId),
          eq(leaderboardEntries.userId, userId),
        ),
      );
  },

  async incrementOwnedPrivateGroupsCount(competitionId: string, userId: string, tx?: any) {
    return await this.updateLeaderboardEntriesOwnedPrivateGroups(competitionId, userId, 'inc', tx);
  },

  async decrementOwnedPrivateGroupsCount(competitionId: string, userId: string, tx?: any) {
    return await this.updateLeaderboardEntriesOwnedPrivateGroups(competitionId, userId, 'dec', tx);
  },
};
