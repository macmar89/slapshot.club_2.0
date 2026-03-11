import { catchAsync } from '../utils/catchAsync.js';
import { type Request, type Response } from 'express';
import {
  updateUserPreferredLanguage,
  updateUsername,
  changePassword,
  requestEmailChange,
} from '../services/user.service.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';
import { logActivity } from '../services/audit.service.js';

export const updatePreferredLanguageHandler = catchAsync(async (req: Request, res: Response) => {
  await updateUserPreferredLanguage(req.user!.id, req.body.preferredLanguage as 'sk' | 'en' | 'cs');

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    message: AuthMessages.UPDATE_SUCCESS,
  });
});

export const updateUsernameHandler = catchAsync(async (req: Request, res: Response) => {
  await updateUsername(req.user!.id, req.body.username);

  await logActivity(req, 'USERNAME_CHANGE', { type: 'user' }, { newUsername: req.body.username });

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    message: AuthMessages.UPDATE_SUCCESS,
  });
});

export const changePasswordHandler = catchAsync(async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;

  await changePassword(req.user!.id, oldPassword, newPassword);

  await logActivity(req, 'PASSWORD_CHANGE', { type: 'user' });

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    message: AuthMessages.UPDATE_SUCCESS,
  });
});

export const requestEmailChangeHandler = catchAsync(async (req: Request, res: Response) => {
  await requestEmailChange(req.user!.id, req.body.message);

  await logActivity(req, 'EMAIL_CHANGE_REQUEST', { type: 'user' }, { message: req.body.message });

  res.status(HttpStatusCode.OK).json({
    status: 'success',
    message: AuthMessages.UPDATE_SUCCESS,
  });
});
