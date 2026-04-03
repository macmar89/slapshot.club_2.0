import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import {
  getAllMatches,
  getAdminCompetitionsLookup,
  getAdminTeamsLookup,
  getMatchDetail,
} from '../../services/admin/matches.service.js';
import { buildPaginatedResponse } from '../../utils/pagination.js';
import type { Request, Response, NextFunction } from 'express';
import { logger } from '../../utils/logger.js';

export const getAllMatchesHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { sort, filters } = req.query;
    const { limit, offset } = req.pagination;
    const locale = req.cookies.NEXT_LOCALE || 'sk';
    logger.info(filters);
    const { matches, totalCount } = await getAllMatches(limit, offset, locale, sort, filters);

    const response = buildPaginatedResponse(matches, totalCount, req.pagination);

    return res.status(HttpStatusCode.OK).json(response);
  },
);

export const getCompetitionsLookupHandler = catchAsync(async (req: Request, res: Response) => {
  const locale = req.cookies.NEXT_LOCALE || 'sk';
  const competitions = await getAdminCompetitionsLookup(locale);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: competitions,
  });
});

export const getTeamsLookupHandler = catchAsync(async (req: Request, res: Response) => {
  const locale = req.cookies.NEXT_LOCALE || 'sk';
  const competitionId = req.query.competitionId as string | undefined;
  const teams = await getAdminTeamsLookup(locale, competitionId);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: teams,
  });
});

export const getMatchDetailHandler = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const locale = req.cookies.NEXT_LOCALE || 'sk';
  const userRole = req.user.role;

  const match = await getMatchDetail(id, locale, userRole);

  if (!match) {
    return res.status(HttpStatusCode.NOT_FOUND).json({
      status: 'error',
      message: 'Match not found',
    });
  }

  return res.status(HttpStatusCode.OK).json({ status: 'success', data: match });
});
