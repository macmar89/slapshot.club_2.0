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
import publicMatchRoutes from './matches.public.routes.js';
import groupRoutes from './groups.routes.js';
import notificationRoutes from './notifications.routes.js';
import announcementRoutes from './announcements.routes.js';

const router = Router();

router.use('/admin', isAuth, isAdmin, adminRoutes);

router.use('/announcements', isAuth, announcementRoutes);
router.use('/auth', authRoutes);
router.use('/competition', competitionRoutes);
router.use('/feedback', isAuth, feedbackRoutes);
router.use('/groups', isAuth, groupRoutes);
router.use('/matches', isAuth, matchRoutes);
router.use('/notifications', isAuth, notificationRoutes);
router.use('/prediction', isAuth, predictionRoutes);
router.use('/user', isAuth, userRoutes);

router.use('/public/matches', isAuth, isAdmin, publicMatchRoutes);

export default router;
