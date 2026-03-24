import type { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { notify, connectedClients } from '../services/notifications.service.js';
import { notificationsRepository } from '../repositories/notifications.repository.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';

export const createNotificationHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userId, type, payload } = req.body;
    await notify({ userId, type, payload });
    res.status(HttpStatusCode.CREATED).json({ status: 'success' });
  },
);

export const getNotificationsStreamHandler = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.user!.id;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Prevents Nginx/Nextjs from buffering SSE
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.flushHeaders(); // Explicitly flush headers to start stream

  // Send an initial connected event
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ timestamp: Date.now() })}\n\n`);

  connectedClients.set(userId, res);

  // Send a heartbeat every 30 seconds to keep the connection alive
  const heartbeatIndex = setInterval(() => {
    res.write(`:\n\n`); // SSE comment
  }, 30000);

  req.on('close', () => {
    clearInterval(heartbeatIndex);
    connectedClients.delete(userId);
  });
};

export const getNotificationsHandler = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { limit, cursorDate, group } = req.query as {
      limit?: string;
      cursorDate?: string;
      group?: string | string[];
    };
    const userId = req.user!.id;
    const notifications = await notificationsRepository.getByUserId(
      userId,
      Number(limit) || 20,
      cursorDate,
      group,
    );
    res.status(HttpStatusCode.OK).json({ status: 'success', data: notifications });
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
    res.status(HttpStatusCode.OK).json({ status: 'success', data: { count } });
  },
);
