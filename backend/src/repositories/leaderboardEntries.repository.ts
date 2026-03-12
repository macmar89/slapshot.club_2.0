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

  async updateStats(
    userId: string,
    competitionId: string,
    direction: 'inc' | 'dec',
    targets: { owned?: boolean; joined?: boolean },
    tx?: any,
  ) {
    const db = tx ?? defaultDb;
    const value = direction === 'inc' ? 1 : -1;
    const updateFields: any = {};

    if (targets.owned) {
      updateFields.statsOwnedPrivateGroups = sql`${leaderboardEntries.statsOwnedPrivateGroups} + ${value}`;
    }

    if (targets.joined) {
      updateFields.statsJoinedPrivateGroups = sql`${leaderboardEntries.statsJoinedPrivateGroups} + ${value}`;
    }

    if (Object.keys(updateFields).length === 0) return;

    await db
      .update(leaderboardEntries)
      .set(updateFields)
      .where(
        and(
          eq(leaderboardEntries.competitionId, competitionId),
          eq(leaderboardEntries.userId, userId),
        ),
      );
  },

  async getStatsByUserIds(userIds: string[], competitionId: string) {
    const data = await defaultDb.query.leaderboardEntries.findMany({
      columns: {
        userId: true,
        currentRank: true,
        totalMa,
      },
      where: (leaderboardEntries, { and, eq }) =>
        and(
          eq(leaderboardEntries.competitionId, competitionId),
          inArray(leaderboardEntries.userId, userIds),
        ),
      orderBy: (leaderboardEntries, { asc }) => [asc(leaderboardEntries.currentRank)],
    });

    return data;
  },
};
