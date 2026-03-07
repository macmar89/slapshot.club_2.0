import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { isAuth } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { UpdatePreferredLanguageHandlerSchema } from '../shared/constants/schema/auth.schema.js';

const router = Router();

router.patch(
  '/preferred-language',
  isAuth,
  validate(UpdatePreferredLanguageHandlerSchema),
  userController.updatePreferredLanguageHandler,
);

export default router;
