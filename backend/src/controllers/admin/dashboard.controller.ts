import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { getDashboardStats } from '../../services/admin/dashboard.service.js';
import type { Request, Response } from 'express';

export const getDashboardStatsHandler = catchAsync(async (req: Request, res: Response) => {
  const stats = await getDashboardStats();

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: stats,
  });
});
