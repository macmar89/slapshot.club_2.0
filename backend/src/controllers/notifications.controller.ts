import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { notify } from '../services/notifications.service.js';
import { notificationsRepository } from '../repositories/notifications.repository.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';

export const createNotificationHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, type, payload } = req.body;
    await notify({ userId, type, payload });
    res.status(HttpStatusCode.CREATED).json({ status: 'success' });
  },
);

export const getNotificationsHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit, cursorDate } = req.query as { limit?: string; cursorDate?: string };
    const userId = req.user!.id;
    const notifications = await notificationsRepository.getByUserId(
      userId,
      Number(limit) || 20,
      cursorDate,
    );
    res.status(HttpStatusCode.OK).json({ status: 'success', notifications });
  },
);

export const markAllAsReadHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    await notificationsRepository.markAllAsRead(userId);
    res.status(HttpStatusCode.OK).json({ status: 'success' });
  },
);

export const markAsReadHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const userId = req.user!.id;
    await notificationsRepository.markAsRead(id, userId);
    res.status(HttpStatusCode.OK).json({ status: 'success' });
  },
);

export const getUnreadNotificationsCountHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const count = await notificationsRepository.getUnreadCountByUserId(userId);
    res.status(HttpStatusCode.OK).json({ status: 'success', count });
  },
);
