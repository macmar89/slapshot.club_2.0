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
};
