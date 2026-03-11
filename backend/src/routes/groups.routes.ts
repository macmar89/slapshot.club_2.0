import { Router } from 'express';
import * as groupController from '../controllers/groups.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createGroupHandlerSchema,
  getUserGroupsByCompetitionSlugSchema,
  joinGroupHandlerSchema,
  getGroupDetailSchema,
} from '../shared/constants/schema/group.schema.js';

const router = Router();

router.post('/', validate(createGroupHandlerSchema), groupController.createGroupHandler);
router.get(
  '/competition/:competitionSlug',
  validate(getUserGroupsByCompetitionSlugSchema),
  groupController.getUserGroupsByCompetitionSlugHandler,
);
router.post('/join', validate(joinGroupHandlerSchema), groupController.joinGroupHandler);
router.get('/:slug', validate(getGroupDetailSchema), groupController.getGroupDetailHandler);

export default router;
