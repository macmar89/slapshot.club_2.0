import type { Request, Response } from 'express';
import { getMatchInfoById } from '../services/matches.service.js';
import type { AppLocale } from '../types/global';
import { getMatchPredictions } from '../services/prediction.service.js';

export const getMatchInfoHandler = async (req: Request, res: Response) => {
  const matchId = req.params.matchId as string;
  const locale = (req.cookies.NEXT_LOCALE as AppLocale) || 'sk';
  const userId = req.user!.id;

  const match = await getMatchInfoById(matchId, locale, userId);

  return res.status(200).json({
    success: true,
    data: match,
  });
};

export const getMatchPredictionsHandler = async (req: Request, res: Response) => {
  const matchId = req.params.matchId as string;

  const predictions = await getMatchPredictions(matchId, {
    page: Number(req.query.page),
    limit: Number(req.query.limit),
  });

  return res.status(200).json({
    success: true,
    data: predictions,
  });
};
