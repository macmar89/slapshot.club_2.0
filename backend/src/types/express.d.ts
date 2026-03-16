import { users } from '../db/schema/users.js';
import { GroupRequest } from './group.types.js';

declare global {
  namespace Express {
    interface Request {
      user?: User;
      group?: GroupRequest;
      org?: any;
    }
  }
}
