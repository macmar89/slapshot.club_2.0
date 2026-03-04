import type { CreatePredictionInput } from '../shared/constants/schema/prediction.schema';
import { db } from '../db';
import { eq, sql, and } from 'drizzle-orm';
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
    const existingPrediction = await tx.query.predictions.findFirst({
      columns: {
        homeGoals: true,
        awayGoals: true,
      },
      where: and(eq(predictions.userId, userId), eq(predictions.matchId, data.matchId)),
    });

    let homeDiff = 0;
    let awayDiff = 0;

    const newWinner = data.homeGoals > data.awayGoals ? 'home' : 'away';

    if (existingPrediction) {
      const oldWinner =
        existingPrediction.homeGoals > existingPrediction.awayGoals ? 'home' : 'away';

      if (oldWinner !== newWinner) {
        if (oldWinner === 'home') homeDiff--;
        if (oldWinner === 'away') awayDiff--;

        if (newWinner === 'home') homeDiff++;
        if (newWinner === 'away') awayDiff++;
      }
    } else {
      if (newWinner === 'home') homeDiff++;
      if (newWinner === 'away') awayDiff++;
    }

    if (homeDiff !== 0 || awayDiff !== 0) {
      await tx
        .update(matches)
        .set({
          homePredictedCount: sql`${matches.homePredictedCount} + ${homeDiff}`,
          awayPredictedCount: sql`${matches.awayPredictedCount} + ${awayDiff}`,
        })
        .where(eq(matches.id, data.matchId));
    }

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
