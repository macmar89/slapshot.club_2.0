import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { createAnnouncement } from '../../services/admin/announcements.service.js';
import type { Request, Response } from 'express';
import { type AuditCtx } from '../../services/audit.service.js';

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
