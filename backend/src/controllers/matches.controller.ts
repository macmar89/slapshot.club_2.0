import type { Request, Response } from 'express';
import { getMatchInfoById } from '../services/matches/matches.service.js';
import type { AppLocale } from '../types/global.types.js';
import { getMatchPredictions } from '../services/prediction.service.js';
import { syncFutureMatches } from '../services/matches/matchesSync.service.js';

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
  const isFreeUser = req.user!.subscriptionPlan === 'free';

  const predictions = await getMatchPredictions(
    matchId,
    {
      page: Number(req.query.page),
      limit: Number(req.query.limit),
      search: req.query.search as string,
    },
    isFreeUser,
  );

  return res.status(200).json({
    success: true,
    data: predictions,
  });
};

export const testSyncMatchesHandler = async (req: Request, res: Response) => {
  const apiSportId = Number(req.query.apiSportId);
  const daysAhead = Number(req.query.daysAhead);

  if (isNaN(apiSportId) || isNaN(daysAhead)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid parameters. Please provide valid numbers for apiSportId and daysAhead.',
    });
  }

  const result = await syncFutureMatches(apiSportId, daysAhead);

  return res.status(result.success ? 200 : 500).json(result);
};
