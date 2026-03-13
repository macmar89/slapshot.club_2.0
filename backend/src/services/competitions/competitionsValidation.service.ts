import { AppError } from '../../utils/appError.js';
import { CompetitionMessages } from '../../shared/constants/messages/competition.messages.js';
import { HttpStatusCode } from '../../utils/httpStatusCodes.js';

export const competitionsValidationService = {
  ensureExists(competitionId: string | null) {
    if (!competitionId) {
      throw new AppError(
        CompetitionMessages.ERRORS.COMPETITION_NOT_FOUND,
        HttpStatusCode.NOT_FOUND,
      );
    }

    return competitionId;
  },
};
