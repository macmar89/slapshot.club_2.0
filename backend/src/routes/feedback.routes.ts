import { Router } from 'express';
import * as feedbackController from '../controllers/feedback.controller.js';

const router = Router();

router.post('/', feedbackController.submitFeedback);

export default router;
