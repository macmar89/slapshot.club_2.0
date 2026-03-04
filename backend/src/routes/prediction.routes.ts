import { Router } from 'express';
import * as predictionController from '../controllers/prediction.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPredictionSchema } from '../shared/constants/schema/prediction.schema.js';

const router = Router();

router.post('/', validate(createPredictionSchema), predictionController.createPredictionHandler);

export default router;
