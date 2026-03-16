import { Router } from 'express';
import * as groupController from '../controllers/groups.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  createGroupHandlerSchema,
  getUserGroupsByCompetitionSlugSchema,
  joinGroupHandlerSchema,
  getGroupDetailSchema,
  getGroupMembersSchema,
  updateMemberStatusSchema,
  transferOwnershipSchema,
  updateMemberRoleSchema,
  removeMemberSchema,
  updateGroupSettingsSchema,
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
  validate(getGroupDetailSchema),
  validateGroupRole(),
  groupController.getGroupDetailHandler,
);
router.get(
  '/:slug/leaderboard',
  validate(getGroupDetailSchema),
  validateGroupRole(),
  groupController.getGroupLeaderboardHandler,
);
router.delete(
  '/:slug',
  validate(getGroupDetailSchema),
  validateGroupRole(['owner']),
  groupController.deleteGroupHandler,
);
router.get(
  '/:slug/members',
  validate(getGroupMembersSchema),
  validateGroupRole(['owner', 'admin']),
  groupController.getGroupMembersHandler,
);
router.delete(
  '/:slug/members/:memberId',
  validate(removeMemberSchema),
  validateGroupRole(['owner', 'admin']),
  groupController.removeMemberHandler,
);
router.patch(
  '/:slug/members/:memberId/status',
  validate(updateMemberStatusSchema),
  validateGroupRole(['owner', 'admin']),
  groupController.updateMemberStatusHandler,
);
router.patch(
  '/:slug/members/:memberId/role',
  validate(updateMemberRoleSchema),
  validateGroupRole(['owner']),
  groupController.updateMemberRoleHandler,
);
router.post(
  '/:slug/transfer-ownership',
  validate(transferOwnershipSchema),
  validateGroupRole(['owner']),
  groupController.transferOwnershipHandler,
);
router.get(
  '/:slug/settings',
  validate(getGroupDetailSchema),
  validateGroupRole(['owner']),
  groupController.getGroupSettingsHandler,
);
router.patch(
  '/:slug/settings',
  validate(updateGroupSettingsSchema),
  validateGroupRole(['owner']),
  groupController.updateGroupSettingsHandler,
);
export default router;

// // Ban (zmena na status banned)
// router.patch('/:groupId/members/:memberId/ban', groupController.banMember);

// // Unban (zmena z banned späť na active/invited)
// router.patch('/:groupId/members/:memberId/unban', groupController.unbanMember);
