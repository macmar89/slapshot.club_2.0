import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import type { CreateGroupInput } from '../shared/constants/schema/group.schema.js';
import { competitionRepository } from '../repositories/competition.repository.js';
import { AppError } from '../utils/appError.js';
import { CompetitionMessages } from '../shared/constants/messages/competition.messages.js';
import { generateSlug } from '../utils/slug.js';
import { createId } from '@paralleldrive/cuid2';
import { groups } from '../db/schema/groups.js';

export const createGroup = async (userId: string, body: CreateGroupInput) => {
  const competitionId = await competitionRepository.getIdBySlug(body.competitionSlug);

  if (!competitionId) {
    throw new AppError(CompetitionMessages.ERRORS.COMPETITION_NOT_FOUND);
  }

  const groupId = createId();

  await db.transaction(async (tx) => {
    const [group] = await tx
      .insert(groups)
      .values({
        id: groupId,
        name: body.name,
        slug: generateSlug(body.name, groupId.slice(-6)),
        type: body.type,
        ownerId: userId,
        competitionId: competitionId,
        maxMembers,
      })
      .returning();

    return group?.id;
  });

  return { groupId, slug: generateSlug(body.name) };
};
