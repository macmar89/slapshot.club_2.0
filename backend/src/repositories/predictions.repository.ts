import { db } from '../db';
import { predictions } from '../db/schema';
import { eq, and, not } from 'drizzle-orm';

export const predictionsRepository = {
  async getPredictionsByMatchId(matchId: string) {
    return await db.query.predictions.findMany({
      columns: {
        id: true,
        userId: true,
        homeGoals: true,
        awayGoals: true,
        status: true,
      },
      where: and(eq(predictions.matchId, matchId), not(eq(predictions.status, 'evaluated'))),
    });
  },
};
