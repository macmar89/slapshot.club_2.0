import { catchAsync } from '../utils/catchAsync.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { 
  getAnnouncements as coreGetAnnouncements,
  getPublicAnnouncementDetail as coreGetPublicAnnouncementDetail
} from '../services/announcements/announcements.service.js';
import { buildPaginatedResponse } from '../utils/pagination.js';
import { AppError } from '../utils/appError.js';
import { ERR } from '../utils/errorMessages.js';
import type { Request, Response } from 'express';
import type { GetAllAnnouncementsQueryInput } from '../shared/constants/schema/admin/announcements.schema.js';

export const getAnnouncementsHandler = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as GetAllAnnouncementsQueryInput;
  const { lang, filters } = query;
  const { limit, offset } = req.pagination;
  const locale = (lang as string) || req.cookies.NEXT_LOCALE || 'sk';

  const { announcements, totalCount } = await coreGetAnnouncements(
    limit,
    offset,
    locale,
    { ...filters, isPublished: true },
  );

  const response = buildPaginatedResponse(announcements, totalCount, req.pagination);

  return res.status(HttpStatusCode.OK).json(response);
});

export const getAnnouncementBySlugHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const lang = req.query.lang as string || req.cookies.NEXT_LOCALE || 'sk';
  
  const announcement = await coreGetPublicAnnouncementDetail(slug, lang);

  if (!announcement) {
    throw new AppError(ERR.ADMIN.ANNOUNCEMENT_NOT_FOUND, HttpStatusCode.NOT_FOUND);
  }

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: announcement,
  });
});
