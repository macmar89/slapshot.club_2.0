import type { Request, Response } from 'express';
import { PredictionMessages } from '../shared/constants/messages/prediction.messages.js';
import type { CreatePredictionInput } from '../shared/constants/schema/prediction.schema.js';
import { createPrediction } from '../services/prediction.service.js';
import { logActivity } from '../services/audit.service.js';

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
