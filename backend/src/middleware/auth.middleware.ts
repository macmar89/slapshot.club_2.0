import { type Request, type Response, type NextFunction } from 'express';
import { catchAsync } from '../utils/catchAsync.js';
import { AppError } from '../utils/appError.js';
import { ERR } from '../utils/errorMessages.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { verifyAccessToken } from '../utils/jwt.js';

export const isAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    throw new AppError(ERR.AUTH.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    throw new AppError(ERR.AUTH.TOKEN_EXPIRED, HttpStatusCode.UNAUTHORIZED);
  }
});

export const optionalAuth = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (token) {
    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
    } catch (err) {
      // Ignore token errors for optional auth
    }
  }

  next();
});
