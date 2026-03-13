import { AppError } from '../../utils/appError.js';
import { GroupMessages } from '../../shared/constants/messages/group.messages.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';

export const groupsValidationService = {
  ensureNotBanned(memberStatus?: string) {
    if (memberStatus === 'banned') {
      throw new AppError(GroupMessages.ERRORS.GROUP_NOT_FOUND, HttpStatusCode.NOT_FOUND);
    }
  },

  ensureNotRejected(memberStatus?: string) {
    if (memberStatus === 'rejected') {
      throw new AppError(GroupMessages.ERRORS.JOIN_REQUEST_REJECTED, HttpStatusCode.FORBIDDEN);
    }
  },

  ensureNotAlreadyMember(memberRecord?: any) {
    if (memberRecord) {
      throw new AppError(GroupMessages.ERRORS.USER_ALREADY_JOINED, HttpStatusCode.CONFLICT);
    }
  },
};
