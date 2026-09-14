import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import {
  getGroupMonthlyLeaderboard,
  getMonthlyLeaderboard,
  getMonthlyPeriodsHistory,
} from './monthlyLeaderboardRead.service.js';
import type { MonthlyPeriod } from './monthlyLeaderboard.types.js';

const resolveRequestedPeriod = (req: Request): MonthlyPeriod | undefined => {
  const year = req.query.year as number | undefined;
  const month = req.query.month as number | undefined;

  if (!year || !month) {
    return undefined;
  }

  return { periodYear: year, periodMonth: month };
};

export const getMonthlyLeaderboardHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const userId = req.user!.id;

  const response = await getMonthlyLeaderboard(slug, userId, resolveRequestedPeriod(req));

  return res.status(HttpStatusCode.OK).json({ status: 'success', data: response });
});

export const getMonthlyPeriodsHistoryHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const limit = req.query.limit as number | undefined;

  const response = await getMonthlyPeriodsHistory(slug, limit);

  return res.status(HttpStatusCode.OK).json({ status: 'success', data: response });
});

export const getGroupMonthlyLeaderboardHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { groupId } = req.group!;

  const response = await getGroupMonthlyLeaderboard(groupId, userId, resolveRequestedPeriod(req));

  return res.status(HttpStatusCode.OK).json({ status: 'success', data: response });
});
