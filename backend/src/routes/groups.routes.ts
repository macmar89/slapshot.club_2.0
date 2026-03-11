import { Router } from 'express';
import * as groupController from '../controllers/groups.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createGroupHandlerSchema,
  getUserGroupsByCompetitionSlugSchema,
  joinGroupHandlerSchema,
  getGroupDetailSchema,
  getGroupMembersSchema,
} from '../shared/constants/schema/group.schema.js';
import { validateGroupRole } from '../middleware/validateGroup.middleware.js';

const router = Router();

router.post('/', validate(createGroupHandlerSchema), groupController.createGroupHandler);
router.get(
  '/competition/:competitionSlug',
  validate(getUserGroupsByCompetitionSlugSchema),
  groupController.getUserGroupsByCompetitionSlugHandler,
);
router.post('/join', validate(joinGroupHandlerSchema), groupController.joinGroupHandler);
router.get(
  '/:slug',
  validateGroupRole(),
  validate(getGroupDetailSchema),
  groupController.getGroupDetailHandler,
);
router.get(
  '/:slug/members',
  validateGroupRole(['owner', 'admin']),
  validate(getGroupMembersSchema),
  groupController.getGroupMembersHandler,
);

export default router;
