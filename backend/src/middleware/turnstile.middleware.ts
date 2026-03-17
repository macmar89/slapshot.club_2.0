import { type Request, type Response, type NextFunction } from 'express';
import { verifyTurnstileToken } from '../services/turnstile.service.js';
import { AppError } from '../utils/appError.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';
import { env } from '../config/env.js';

export const verifyTurnstile = async (req: Request, res: Response, next: NextFunction) => {
  if (!env.NEXT_PUBLIC_ENABLE_TURNSTILE) {
    return next();
  }

  const { turnstileToken } = req.body;

  const isValid = await verifyTurnstileToken(turnstileToken, req.ip);

  if (!isValid) {
    return next(
      new AppError(AuthMessages.ERRORS.VALIDATION.TURNISTILE_ERROR, HttpStatusCode.BAD_REQUEST),
    );
  }

  next();
};
