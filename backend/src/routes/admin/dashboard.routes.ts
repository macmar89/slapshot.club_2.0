import { Router } from 'express';
import { getDashboardStatsHandler } from '../../controllers/admin/dashboard.controller.js';

const router = Router();

router.get('/stats', getDashboardStatsHandler);

export default router;
