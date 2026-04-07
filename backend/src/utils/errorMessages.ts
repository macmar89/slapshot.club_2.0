import { AuthErrors } from '../shared/constants/errors/auth.errors.js';
import { AdminErrors } from '../shared/constants/errors/admin.errors.js';

export const ERR = {
  AUTH: AuthErrors,
  ADMIN: AdminErrors,
} as const;
