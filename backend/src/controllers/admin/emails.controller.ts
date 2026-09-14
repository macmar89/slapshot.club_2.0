import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import { sendSeasonStartEmails } from '../../services/admin/emails.service.js';
import type { Request, Response } from 'express';
import type { AuditCtx } from '../../services/audit.service.js';

export const sendSeasonStartEmailsHandler = catchAsync(async (req: Request, res: Response) => {
  const auditCtx: AuditCtx = {
    userId: req.user?.id,
    ipAddress: req.ip,
    userAgent: req.get('user-agent'),
  };

  const result = await sendSeasonStartEmails(auditCtx);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: result,
  });
});
