import { users } from '../db/schema/users';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        username: string;
        role: string;
        subscriptionPlan: string;
        subscriptionActiveUntil: string;
        isVerified: boolean;
      };
    }
  }
}
