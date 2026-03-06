import { ZodError, type ZodObject } from 'zod';
import type { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '../utils/httpStatusCodes';

export const validate =
  (schema: ZodObject<any, any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = parsed.body;
      if (parsed.query) {
        Object.keys(req.query).forEach((key) => delete req.query[key]);
        Object.assign(req.query, parsed.query);
      }
      if (parsed.params) {
        Object.keys(req.params).forEach((key) => delete req.params[key]);
        Object.assign(req.params, parsed.params);
      }
      return next();
    } catch (error) {
      console.log(error);
      if (error instanceof ZodError || (error as any)?.name === 'ZodError') {
        return res.status(HttpStatus.BAD_REQUEST).json({
          status: 'error',
          message: 'Validation failed',
          errors: (error as any).issues.map((issue: any) => ({
            path: issue.path.join('.'),
            message: issue.message,
          })),
        });
      }
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: 'error', message: 'Internal server error' });
    }
  };
