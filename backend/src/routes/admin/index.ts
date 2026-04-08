import { Router } from 'express';
import competitionRoutes from './competition.routes.js';
import matchRoutes from './matches.routes.js';
import dashboardRoutes from './dashboard.routes.js';
import announcementsRoutes from './announcements.routes.js';
import feedbackRoutes from './feedback.routes.js';

const router = Router();

router.use('/competitions', competitionRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/matches', matchRoutes);
router.use('/announcements', announcementsRoutes);

export default router;
