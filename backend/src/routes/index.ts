import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin/index.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/admin.middleware.js';
import competitionRoutes from './competition.routes.js';
import feedbackRoutes from './feedback.routes.js';
import predictionRoutes from './prediction.routes.js';
import matchRoutes from './matches.routes.js';

const router = Router();

router.use('/admin', isAuth, isAdmin, adminRoutes);

router.use('/auth', authRoutes);
router.use('/user', isAuth, userRoutes);
router.use('/competition', competitionRoutes);
router.use('/feedback', isAuth, feedbackRoutes);
router.use('/matches', isAuth, matchRoutes);
router.use('/prediction', isAuth, predictionRoutes);

export default router;
