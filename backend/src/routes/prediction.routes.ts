import { Router } from 'express';
import * as predictionController from '../controllers/prediction.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createPredictionSchema, getMissingPredictionsSchema, getMissingPredictionsCalendarSchema } from '../shared/constants/schema/prediction.schema.js';

const router = Router();

router.post('/', validate(createPredictionSchema), predictionController.createPredictionHandler);
router.get('/missing', validate(getMissingPredictionsSchema), predictionController.getMissingPredictionsHandler);
router.get('/missing-calendar', validate(getMissingPredictionsCalendarSchema), predictionController.getMissingPredictionsCalendarHandler);
router.get('/summary', predictionController.getMissingPredictionsSummaryHandler);

export default router;
