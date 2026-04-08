import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementBySlug,
  updateAnnouncement,
  deleteAnnouncement,
} from '../../services/admin/announcements.service.js';
import { buildPaginatedResponse } from '../../utils/pagination.js';
import type { Request, Response } from 'express';
import { type AuditCtx } from '../../services/audit.service.js';
import type { GetAllAnnouncementsAsAdminQueryInput } from '../../shared/constants/schema/admin/announcements.schema.js';

export const getAllAnnouncementsHandler = catchAsync(async (req: Request, res: Response) => {
  const query = req.query as unknown as GetAllAnnouncementsAsAdminQueryInput;
  const { sort, filters, lang } = query;
  const { limit, offset } = req.pagination;
  const locale = (lang as string) || req.cookies.NEXT_LOCALE || 'sk';

  const { announcements, totalCount } = await getAllAnnouncements(
    limit,
    offset,
    locale,
    sort || { by: 'createdAt', order: 'desc' },
    filters || {},
  );

  const response = buildPaginatedResponse(announcements, totalCount, req.pagination);

  return res.status(HttpStatusCode.OK).json(response);
});

export const createAnnouncementHandler = catchAsync(async (req: Request, res: Response) => {
  const auditCtx: AuditCtx = {
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };

  const announcement = await createAnnouncement(req.body, auditCtx);

  return res.status(HttpStatusCode.CREATED).json({
    status: 'success',
    data: announcement,
  });
});

export const getAnnouncementBySlugHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const announcement = await getAnnouncementBySlug(slug);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: announcement,
  });
});

export const updateAnnouncementHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const auditCtx: AuditCtx = {
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };

  const announcement = await updateAnnouncement(slug, req.body, auditCtx);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: announcement,
  });
});

export const deleteAnnouncementHandler = catchAsync(async (req: Request, res: Response) => {
  const slug = req.params.slug as string;
  const auditCtx: AuditCtx = {
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };

  await deleteAnnouncement(slug, auditCtx);

  return res.status(HttpStatusCode.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
});
