import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import {
  getGroupLeaderboard,
  getLeaderboard,
  getMemberStatsBySlug,
} from './leaderboardRead.service.js';

export const getLeaderboardHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const userId = req.user!.id;

  const leaderboard = await getLeaderboard(slug, userId);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: leaderboard,
  });
});

export const getMyCompetitionStatsHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const userId = req.user!.id;

  const stats = await getMemberStatsBySlug(userId, slug);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: stats,
  });
});

export const getGroupLeaderboardHandler = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { groupId } = req.group!;

  const response = await getGroupLeaderboard(groupId, userId);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: response,
  });
});
