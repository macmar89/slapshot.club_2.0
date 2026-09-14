import { and, asc, eq, inArray, sql } from 'drizzle-orm';
import { db as defaultDb } from '../../db/index.js';
import { leaderboardEntries } from '../../db/schema/index.js';

export const leaderboardRepository = {
  async findEntriesByCompetitionId(competitionId: string) {
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
      },
      where: (table) => eq(table.competitionId, competitionId),
      with: {
        user: {
          columns: {
            username: true,
          },
        },
      },
      orderBy: (table) => [
        asc(sql`CASE WHEN ${table.currentRank} = 0 THEN 1 ELSE 0 END`),
        asc(table.currentRank),
      ],
    });
  },

  async findEntryByUser(userId: string, competitionId: string) {
    return await defaultDb.query.leaderboardEntries.findFirst({
      columns: {
        totalPoints: true,
        totalPredictions: true,
        currentRank: true,
        exactGuesses: true,
        correctTrends: true,
        correctDiffs: true,
        wrongGuesses: true,
        createdAt: true,
      },
      where: (table, { eq, and }) =>
        and(eq(table.userId, userId), eq(table.competitionId, competitionId)),
    });
  },

  async getStatsByUser(
    userId: string,
    competitionId: string,
  ): Promise<{ statsJoinedPrivateGroups: number; statsOwnedPrivateGroups: number }> {
    const data = await defaultDb.query.leaderboardEntries.findFirst({
      columns: {
        statsJoinedPrivateGroups: true,
        statsOwnedPrivateGroups: true,
      },
      where: (table, { and, eq }) =>
        and(eq(table.competitionId, competitionId), eq(table.userId, userId)),
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
      where: (table, { and, eq }) =>
        and(eq(table.competitionId, competitionId), inArray(table.userId, userIds)),
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
      orderBy: (table, { asc }) => [asc(table.currentRank)],
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
