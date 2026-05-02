import { Router } from 'express';
import { getSlapshotAiStats, getSlapshotAiWeeklyStats } from '../controllers/internal.controller.js';
import { isInternalAgent } from '../middleware/internal.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { getSlapshotAiStatsSchema, getSlapshotAiWeeklyStatsSchema } from '../shared/constants/schema/slapshotai.schema.js';

const router = Router();

router.use(isInternalAgent);

router.get('/slapshotai/stats', validate(getSlapshotAiStatsSchema), getSlapshotAiStats);
router.get('/slapshotai/stats/weekly', validate(getSlapshotAiWeeklyStatsSchema), getSlapshotAiWeeklyStats);

export default router;
