import { catchAsync } from '../utils/catchAsync.js';
import { HttpStatus } from '../utils/httpStatusCodes.js';
import * as feedbackService from '../services/feedback.service.js';

export const submitFeedback = catchAsync(async (req, res) => {
  const { type, message, pageUrl } = req.body;
  const userId = req.user?.id;

  const result = await feedbackService.createFeedback({
    type,
    message,
    pageUrl,
    userId,
  });

  res.status(HttpStatus.CREATED).json({
    status: 'success',
    data: {
      feedback: result,
    },
  });
});
