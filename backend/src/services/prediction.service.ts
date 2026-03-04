import type { CreatePredictionInput } from '../shared/constants/schema/prediction.schema';
import { db } from '../db';
import { eq, sql } from 'drizzle-orm';
import { matches, predictions } from '../db/schema';
import { PredictionErrors } from '../shared/constants/messages/prediction.messages';
import { AppError } from '../utils/appError';

export const createPrediction = async (userId: string, data: CreatePredictionInput) => {
  const match = await db.query.matches.findFirst({
    columns: {
      id: true,
      date: true,
      status: true,
      competitionId: true,
    },
    where: eq(matches.id, data.matchId),
  });

  if (!match) {
    throw new AppError(PredictionErrors.MATCH_NOT_FOUND, 404);
  }

  const now = new Date();
  if (new Date(match.date) <= now || match.status !== 'scheduled') {
    throw new AppError(PredictionErrors.MATCH_ALREADY_STARTED, 400);
  }

  await db.transaction(async (tx) => {
    await tx
      .update(matches)
      .set({
        homePredictedCount:
          data?.homeGoals > data?.awayGoals
            ? sql`${matches.homePredictedCount} + 1`
            : matches.homePredictedCount,
        awayPredictedCount:
          data?.homeGoals < data?.awayGoals
            ? sql`${matches.awayPredictedCount} + 1`
            : matches.awayPredictedCount,
      })
      .where(eq(matches.id, data.matchId));

    await tx
      .insert(predictions)
      .values({
        userId,
        competitionId: match.competitionId,
        matchId: data.matchId,
        homeGoals: data.homeGoals,
        awayGoals: data.awayGoals,
      })
      .onConflictDoUpdate({
        target: [predictions.userId, predictions.matchId],
        set: {
          homeGoals: data.homeGoals,
          awayGoals: data.awayGoals,
          editCount: sql`${predictions.editCount} + 1`,
          updatedAt: new Date().toISOString(),
        },
      });
  });
};
