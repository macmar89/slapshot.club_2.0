import { AppError } from '../utils/appError.js';
import type { GroupRole } from '../types/group.types.js';
import type { NextFunction, Request, Response } from 'express';
import { db } from '../db/index.js';
import { groups } from '../db/schema/index.js';
import { HttpStatusCode } from '../utils/httpStatusCodes.js';
import { GroupMessages } from '../shared/constants/messages/group.messages.js';
import { AuthMessages } from '../shared/constants/messages/auth.messages.js';

export const validateGroupRole = (allowedRoles?: GroupRole | GroupRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slug } = req.params;
      const userId = req.user?.id;

      if (!slug) {
        throw new AppError(GroupMessages.ERRORS.SLUG_REQUIRED, HttpStatusCode.BAD_REQUEST);
      }

      if (!userId) {
        throw new AppError(AuthMessages.ERRORS.UNAUTHORIZED, HttpStatusCode.UNAUTHORIZED);
      }

      const rolesArray = allowedRoles
        ? Array.isArray(allowedRoles)
          ? allowedRoles
          : [allowedRoles]
        : [];

      const member = await db.query.groupMembers.findFirst({
        where: (gm, { eq, and, exists }) =>
          and(
            eq(gm.userId, userId),
            exists(
              db
                .select()
                .from(groups)
                .where((g) => and(eq(g.id, gm.groupId), eq(g.slug, slug as string))),
            ),
          ),
        with: {
          group: {
            columns: {
              id: true,
              slug: true,
            },
          },
        },
      });

      if (!member || !member.group) {
        throw new AppError(GroupMessages.ERRORS.NOT_A_MEMBER, HttpStatusCode.NOT_FOUND);
      }

      if (member.status !== 'active') {
        throw new AppError(GroupMessages.ERRORS.NOT_ACTIVE, HttpStatusCode.FORBIDDEN);
      }

      if (rolesArray.length > 0 && !rolesArray.includes(member.role as GroupRole)) {
        throw new AppError(GroupMessages.ERRORS.INSUFFICIENT_PERMISSIONS, HttpStatusCode.FORBIDDEN);
      }

      req.group = {
        groupId: member.group.id,
        memberRole: member.role as GroupRole,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
