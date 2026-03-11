import { users } from '../db/schema/users';
import { GroupRequest } from './group.types';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      group?: GroupRequest;
    }
  }
}
