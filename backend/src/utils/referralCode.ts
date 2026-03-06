import { createId } from '@paralleldrive/cuid2';

export const generateReferralCode = (): string => {
  return createId().slice(0, 8).toUpperCase();
};
