import { Router } from 'express';
import competitionRoutes from './competition.routes.js';

const router = Router();

router.use('/competitions', competitionRoutes);
export default router;
