import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import type { CreateGroupInput } from '../shared/constants/schema/group.schema.js';
import { competitionRepository } from '../repositories/competition.repository.js';
import { AppError } from '../utils/appError.js';
import { CompetitionMessages } from '../shared/constants/messages/competition.messages.js';
import { generateSlug } from '../utils/slug.js';
import { createId } from '@paralleldrive/cuid2';
import { groupMembers, groups } from '../db/schema/groups.js';
import type { UserSubscriptionPlan } from '../types/user.js';
import { PlayerMessages } from '../shared/constants/messages/player.messages.js';
import { HttpStatus } from '../utils/httpStatusCodes.js';
import { APP_CONFIG } from '../config/app.js';

export const createGroup = async (
  userId: string,
  userSubscriptionPlan: UserSubscriptionPlan,
  body: CreateGroupInput,
) => {
  const competitionId = await competitionRepository.getIdBySlug(body.competitionSlug);

  if (!competitionId) {
    throw new AppError(CompetitionMessages.ERRORS.COMPETITION_NOT_FOUND);
  }

  if (!(userSubscriptionPlan === 'pro' || userSubscriptionPlan === 'vip')) {
    throw new AppError(PlayerMessages.ERRORS.USER_NOT_PRO_OR_VIP, HttpStatus.FORBIDDEN);
  }

  const groupId = createId();
  const slugSuffix = groupId.slice(-6);
  const inviteCode = groupId.slice(3, 9).toUpperCase();

  await db.transaction(async (tx) => {
    const [group] = await tx
      .insert(groups)
      .values({
        id: groupId,
        name: body.name,
        slug: generateSlug(body.name, slugSuffix),
        type: body.type,
        ownerId: userId,
        competitionId: competitionId,
        code: inviteCode,
        creditCost: 0,
        maxMembers:
          userSubscriptionPlan === 'vip'
            ? APP_CONFIG.groups.maxMembers.vip
            : APP_CONFIG.groups.maxMembers.pro,
        statsMembersCount: 1,
      })
      .returning();

    await tx.insert(groupMembers).values({
      groupId,
      userId,
    });

    return group?.id;
  });

  return { groupId, slug: generateSlug(body.name) };
};
