import { catchAsync } from '../utils/catchAsync.js';
import { type Request, type Response } from 'express';
import { getLeaderboard, getMemberStatsBySlug } from '../services/leaderboard.service.js';

export const getLeaderboardHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const userId = req.user!.id;

  const leaderboard = await getLeaderboard(slug, userId);

  res.status(200).json({
    status: 'success',
    data: leaderboard,
  });
});

export const getMyCompetitionStatsHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const userId = req.user!.id;

  const stats = await getMemberStatsBySlug(userId, slug);

  res.status(200).json({
    status: 'success',
    data: stats,
  });
});
