import { Router } from 'express';
import competitionRoutes from './competition.routes.js';
import matchRoutes from './matches.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use('/competitions', competitionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/matches', matchRoutes);

export default router;
