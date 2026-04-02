import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { getAllMatches } from '../../services/admin/matches.service.js';
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
