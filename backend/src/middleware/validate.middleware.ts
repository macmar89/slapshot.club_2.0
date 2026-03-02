import { ZodError, type ZodObject } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: ZodObject<any, any>) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      return next();
    } catch (error) {
      if (error instanceof ZodError || (error as any)?.name === 'ZodError') {
        return res.status(400).json({
          status: 'error',
          message: 'Validation failed',
          errors: (error as any).errors.map((e: any) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      return res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  };
