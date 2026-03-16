import type { CreatePredictionInput } from '../shared/constants/schema/prediction.schema.js';
import { db } from '../db/index.js';
import { eq, sql, and, ilike } from 'drizzle-orm';
import { matches, predictions, users } from '../db/schema/index.js';
import { AppError } from '../utils/appError.js';
import { MatchMessages } from '../shared/constants/messages/matches.messages.js';

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
    throw new AppError(MatchMessages.MATCH_NOT_FOUND, 404);
  }

  const now = new Date();
  if (new Date(match.date) <= now || match.status !== 'scheduled') {
    throw new AppError(MatchMessages.MATCH_ALREADY_STARTED, 400);
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

    const newScoreKey = `${data.homeGoals}:${data.awayGoals}`;
    let oldScoreKey: string | null = null;

    if (existingPrediction) {
      oldScoreKey = `${existingPrediction.homeGoals}:${existingPrediction.awayGoals}`;
      const oldWinner =
        existingPrediction.homeGoals > existingPrediction.awayGoals ? 'home' : 'away';

      if (oldWinner !== newWinner) {
        if (oldWinner === 'home') homeDiff--;
        else awayDiff--;

        if (newWinner === 'home') homeDiff++;
        else awayDiff++;
      }
    } else {
      if (newWinner === 'home') homeDiff++;
      else awayDiff++;
    }

    if (newScoreKey !== oldScoreKey) {
      await tx
        .update(matches)
        .set({
          homePredictedCount: sql`${matches.homePredictedCount} + ${homeDiff}`,
          awayPredictedCount: sql`${matches.awayPredictedCount} + ${awayDiff}`,

          predictionStats: sql`
            jsonb_set(
                coalesce(${matches.predictionStats}, '{"scores": {}}'::jsonb),
                '{scores}',
                (
                    coalesce(${matches.predictionStats}->'scores', '{}'::jsonb)
                    || jsonb_build_object(${newScoreKey}::text, (coalesce(${matches.predictionStats}->'scores'->>${newScoreKey}, '0')::int + 1))
                    ${oldScoreKey ? sql`|| jsonb_build_object(${oldScoreKey}::text, (coalesce(${matches.predictionStats}->'scores'->>${oldScoreKey}, '1')::int - 1))` : sql``}
                )
            )
          `,
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

export const getMatchPredictions = async (
  matchId: string,
  { page, limit, search }: { page: number; limit: number; search?: string },
  isFreeUser: boolean,
) => {
  const offset = (page - 1) * limit;

  const match = await db.query.matches.findFirst({
    columns: {
      id: true,
      status: true,
    },
    where: eq(matches.id, matchId),
  });

  if (!match) {
    throw new AppError(MatchMessages.MATCH_NOT_FOUND, 404);
  }

  const totalCountResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(predictions)
    .where(eq(predictions.matchId, matchId));

  const totalCount = totalCountResult[0]?.count ? Number(totalCountResult[0]?.count) : 0;

  const pagination = {
    total: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };

  if (!(match.status === 'live' || match.status === 'finished')) {
    return {
      data: [],
      pagination,
      meta: { message: MatchMessages.MATCH_NOT_STARTED, isLocked: true, matchStatus: match.status },
    };
  }

  if (isFreeUser) {
    return {
      data: [],
      pagination,
      meta: {
        message: MatchMessages.PREDICTION_NOT_ALLOWED_FOR_FREE_USER,
        isLocked: true,
        matchStatus: match.status,
      },
    };
  }

  const result = await db.query.predictions.findMany({
    where: (predictions, { and, eq, exists }) => {
      const conditions = [eq(predictions.matchId, matchId)];

      if (search) {
        conditions.push(
          exists(
            db
              .select()
              .from(users)
              .where(and(eq(users.id, predictions.userId), ilike(users.username, `%${search}%`))),
          ),
        );
      }

      return and(...conditions);
    },
    limit: limit,
    offset: offset,
    columns: {
      id: true,
      homeGoals: true,
      awayGoals: true,
      points: true,
      createdAt: true,
    },
    with: {
      user: {
        columns: {
          id: true,
          username: true,
        },
      },
    },
    orderBy: (predictions, { asc, desc }) => [desc(predictions.points), asc(predictions.createdAt)],
  });

  return {
    data: result.map((prediction: any) => ({
      id: prediction.id,
      homeGoals: prediction.homeGoals,
      awayGoals: prediction.awayGoals,
      points: prediction.points,
      userId: prediction.user?.id,
      username: prediction.user?.username,
      createdAt: prediction.createdAt,
    })),
    pagination,
    meta: { message: '', isLocked: false, matchStatus: match.status },
  };
};
