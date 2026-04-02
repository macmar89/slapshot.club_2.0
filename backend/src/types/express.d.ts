import { users } from '../db/schema/users.js';
import { GroupRequest } from './group.types.js';

export interface PaginationConfig {
  page: number;
  limit: number;
  offset: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
      group?: GroupRequest;
      org?: any;
      pagination: PaginationConfig;
    }
  }
}
