import { Router } from 'express';
import * as feedbackController from '../controllers/feedback.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { FeedbackHandlerSchema } from '../shared/constants/schema/feedback.schema.js';

const router = Router();

router.post('/', validate(FeedbackHandlerSchema), feedbackController.submitFeedback);

export default router;
