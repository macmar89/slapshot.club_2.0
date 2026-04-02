import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware.js';
import { getAllMatchesSchema } from '../../shared/constants/schema/admin/matches.schema.js';
import { getAllMatchesHandler } from '../../controllers/admin/matches.controller.js';
import { paginate } from '../../middlewares/pagination.middleware.js';

const router = Router();

router.get('/', validate(getAllMatchesSchema), paginate(), getAllMatchesHandler);

export default router;
