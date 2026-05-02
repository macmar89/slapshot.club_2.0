import type { Request, Response, NextFunction } from 'express';
import { env } from '../config/env.js';
import { AppError } from '../utils/appError.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';

export const isInternalAgent = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Missing or invalid Authorization header', HttpStatusCode.FORBIDDEN));
  }

  const token = authHeader.split(' ')[1];

  if (!env.SLAPSHOTAI_TOKEN || token !== env.SLAPSHOTAI_TOKEN) {
    console.warn(`[Internal API] Invalid token attempt from IP: ${req.ip}`);
    return next(new AppError('Forbidden', HttpStatusCode.FORBIDDEN));
  }

  next();
};
