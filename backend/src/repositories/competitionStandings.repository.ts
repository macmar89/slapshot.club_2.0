import { db } from '../db/index.js';
import { competitionStandings } from '../db/schema/index.js';
import { sql } from 'drizzle-orm';

export const competitionStandingsRepository = {
  async upsertMany(data: any[]) {
    if (data.length === 0) return [];

    return await db
      .insert(competitionStandings)
      .values(data)
      .onConflictDoUpdate({
        target: [competitionStandings.competitionId, competitionStandings.teamId],
        set: {
          groupName: sql`EXCLUDED.group_name`,
          rank: sql`EXCLUDED.rank`,
          points: sql`EXCLUDED.points`,
          played: sql`EXCLUDED.played`,
          win: sql`EXCLUDED.win`,
          winOvertime: sql`EXCLUDED.win_overtime`,
          lose: sql`EXCLUDED.lose`,
          loseOvertime: sql`EXCLUDED.lose_overtime`,
          goalsFor: sql`EXCLUDED.goals_for`,
          goalsAgainst: sql`EXCLUDED.goals_against`,
          form: sql`EXCLUDED.form`,
          phase: sql`EXCLUDED.phase`,
          updatedAt: sql`now()`,
        },
      });
  },
};
