import { catchAsync } from '../utils/catchAsync.js';
import { type Request, type Response } from 'express';
import { updateUserPreferredLanguage } from '../services/user.service.js';
import { UpdatePreferredLanguageSchema } from '../shared/constants/schema/auth.schema.js';
import { HttpStatus } from '../utils/httpStatusCodes.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';

export const updatePreferredLanguageHandler = catchAsync(async (req: Request, res: Response) => {
  const { preferredLanguage } = UpdatePreferredLanguageSchema.parse(req.body);

  await updateUserPreferredLanguage(req.user!.id, preferredLanguage as 'sk' | 'en' | 'cs');

  res.status(HttpStatus.OK).json({
    status: 'success',
    message: AuthMessages.UPDATE_SUCCESS,
  });
});
