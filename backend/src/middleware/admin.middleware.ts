import type { Request, Response, NextFunction } from 'express';
import { ERR } from '../utils/errorMessages.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(HttpStatusCode.UNAUTHORIZED).json({
      error: 'Unauthorized',
      message: ERR.AUTH.UNAUTHORIZED,
    });
  }

  if (!req.user.role.includes('admin')) {
    return res.status(HttpStatusCode.FORBIDDEN).json({
      error: 'Forbidden',
      message: ERR.AUTH.FORBIDDEN_SUPERADMIN,
    });
  }

  next();
};
