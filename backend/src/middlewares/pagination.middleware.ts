import type { Request, Response, NextFunction } from 'express';

export const paginate = (defaultLimit = 10, maxLimit = 100) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const pageParam = parseInt(req.query.page as string, 10);
    const limitParam = parseInt(req.query.limit as string, 10);

    const page = !isNaN(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit = !isNaN(limitParam) && limitParam > 0 
      ? Math.min(limitParam, maxLimit) 
      : defaultLimit;

    const offset = (page - 1) * limit;

    req.pagination = { page, limit, offset };

    next();
  };
};
