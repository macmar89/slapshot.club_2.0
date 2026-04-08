import { Router } from 'express';
import {
  listFeedbackHandler,
  getFeedbackHandler,
  updateFeedbackHandler,
} from '../../controllers/admin/feedback.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import {
  listFeedbackQuerySchema,
  feedbackParamsSchema,
  updateFeedbackStatusSchema,
} from '../../shared/constants/schema/admin/feedback.schema.js';
import { paginate } from '../../middlewares/pagination.middleware.js';

const router = Router();

router.get('/', validate(listFeedbackQuerySchema), paginate(), listFeedbackHandler);
router.get('/:id', validate(feedbackParamsSchema), getFeedbackHandler);
router.patch('/:id', validate(updateFeedbackStatusSchema), updateFeedbackHandler);

export default router;
