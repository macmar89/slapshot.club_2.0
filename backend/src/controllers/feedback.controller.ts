import { catchAsync } from '../utils/catchAsync.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import * as feedbackService from '../services/feedback.service.js';
import type { Request, Response } from 'express';

export const submitFeedback = catchAsync(async (req: Request, res: Response) => {
  const { type, message, pageUrl } = req.body;
  const userId = req.user!.id;

  const result = await feedbackService.createFeedback({
    type,
    message,
    userId,
    pageUrl,
  });

  res.status(HttpStatusCode.CREATED).json({
    status: 'success',
    data: {
      feedback: result,
    },
  });
});
