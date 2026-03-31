import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { syncStandings } from '../../services/admin/competitions.service.js';

export const syncStandingsHandler = catchAsync(async (req: Request, res: Response) => {
  const competitionId = req.params.competitionId as string;

  const data = await syncStandings(competitionId);

  res.status(200).json({
    status: 'success',
    data: data,
  });
});
