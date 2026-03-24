import type { Request, Response } from 'express';
import { PredictionMessages } from '../shared/constants/messages/prediction.messages.js';
import type { CreatePredictionInput } from '../shared/constants/schema/prediction.schema.js';
import { createPrediction } from '../services/prediction.service.js';
import { logActivity } from '../services/audit.service.js';
import { catchAsync } from '../utils/catchAsync.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { predictionsRepository } from '../repositories/predictions.repository.js';

export const createPredictionHandler = async (req: Request, res: Response) => {
  const userId = req.user!.id;

  await createPrediction(userId, req.body);

  await logActivity(
    req,
    'PREDICTIONS_UPDATE',
    { type: 'prediction' },
    { matchId: req.body.matchId, homeGoals: req.body.homeGoals, awayGoals: req.body.awayGoals },
    { userId },
  );

  return res
    .status(201)
    .json({ status: 'success', data: { message: PredictionMessages.PREDICTION_CREATED_SUCCESS } });
};

export const getMissingPredictionsCalendarHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { startDate, endDate } = req.query as { startDate: string; endDate: string };

  const counts = await predictionsRepository.getMissingPredictionsCountByDateRange(
    userId,
    startDate,
    endDate,
  );

  // Transform to { [date]: count }
  const data = counts.reduce((acc, curr) => {
    acc[curr.date] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  res.status(HttpStatusCode.OK).json({ status: 'success', data });
});

export const getMissingPredictionsHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { date, timezone } = req.query as { date: string; timezone: string };

  const matches = await predictionsRepository.getMissingPredictionsByDate(
    userId,
    date,
    (req.user?.preferredLanguage || 'sk') as any,
    timezone || 'UTC',
  );

  res.status(HttpStatusCode.OK).json({ status: 'success', data: matches });
});

export const getMissingPredictionsSummaryHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const count = await predictionsRepository.getMissingPredictionsCountNext24Hours(userId);

  res.status(HttpStatusCode.OK).json({ status: 'success', data: { count } });
});
