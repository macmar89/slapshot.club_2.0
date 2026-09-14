import type { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from './notificationSettings.service.js';

export const getNotificationSettingsHandler = catchAsync(async (req: Request, res: Response) => {
  const settings = await getNotificationSettings(req.user!.id);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: settings,
  });
});

export const updateNotificationSettingsHandler = catchAsync(async (req: Request, res: Response) => {
  const settings = await updateNotificationSettings(req.user!.id, req.body);

  return res.status(HttpStatusCode.OK).json({
    status: 'success',
    data: settings,
  });
});
