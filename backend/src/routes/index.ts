import { Router } from 'express';
import authRoutes from './auth.routes.js';
import adminRoutes from './admin/index.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { isSuperadmin } from '../middleware/superadmin.middleware.js';
import competitionRoutes from './competition.routes.js';
import feedbackRoutes from './feedback.routes.js';

const router = Router();

router.use('/admin', isAuth, isSuperadmin, adminRoutes);

router.use('/auth', authRoutes);
router.use('/competition', isAuth, competitionRoutes);
router.use('/feedback', isAuth, feedbackRoutes);

export default router;
