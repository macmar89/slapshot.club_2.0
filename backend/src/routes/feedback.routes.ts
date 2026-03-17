import { Router } from 'express';
import * as feedbackController from '../controllers/feedback.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { FeedbackHandlerSchema } from '../shared/constants/schema/feedback.schema.js';
import { verifyTurnstile } from '../middleware/turnstile.middleware.js';

const router = Router();

router.post(
  '/',
  verifyTurnstile,
  validate(FeedbackHandlerSchema),
  feedbackController.submitFeedback,
);

export default router;
