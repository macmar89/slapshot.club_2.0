import { Router } from 'express';
import * as groupController from '../controllers/group.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { createGroupHandlerSchema } from '../shared/constants/schema/group.schema.js';

const router = Router();

router.post('/', validate(createGroupHandlerSchema), groupController.createGroupHandler);

export default router;
