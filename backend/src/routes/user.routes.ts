import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import {
  UpdatePreferredLanguageHandlerSchema,
  UpdateUsernameHandlerSchema,
  ChangePasswordHandlerSchema,
  EmailChangeRequestHandlerSchema,
} from '../shared/constants/schema/user.schema.js';

const router = Router();

router.patch(
  '/preferred-language',
  validate(UpdatePreferredLanguageHandlerSchema),
  userController.updatePreferredLanguageHandler,
);

router.patch(
  '/username',
  validate(UpdateUsernameHandlerSchema),
  userController.updateUsernameHandler,
);

router.post(
  '/change-password',
  validate(ChangePasswordHandlerSchema),
  userController.changePasswordHandler,
);

router.post(
  '/email-change-request',
  validate(EmailChangeRequestHandlerSchema),
  userController.requestEmailChangeHandler,
);

router.post('/complete-onboarding', userController.completeOnboardingHandler);

export default router;
