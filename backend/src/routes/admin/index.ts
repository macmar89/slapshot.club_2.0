import { Router } from 'express';
import competitionRoutes from './competition.routes.js';
import matchRoutes from './matches.routes.js';

const router = Router();

router.use('/competitions', competitionRoutes);
router.use('/matches', matchRoutes);

export default router;
