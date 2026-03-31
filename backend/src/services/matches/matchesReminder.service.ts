import { db } from '../../db/index.js';
import {
  matches,
  leaderboardEntries,
  predictions,
  notifications,
  competitions,
} from '../../db/schema/index.js';
import { and, eq, gte, lte, sql, notExists, or } from 'drizzle-orm';
import { notify } from '../notifications.service.js';
import { logger } from '../../utils/logger.js';

/**
 * Checks for matches starting in approximately 1 hour (55-65 minutes)
 * and sends a grouped notification to users who are joined in the competition
 * but haven't placed a prediction yet.
 */
export const sendMissingTipReminders = async () => {
  const now = new Date();
  const startRange = new Date(now.getTime() + 55 * 60 * 1000);
  const endRange = new Date(now.getTime() + 65 * 60 * 1000);

  logger.info(
    `[REMINDER] Checking for missing tips for matches starting between ${startRange.toISOString()} and ${endRange.toISOString()}`,
  );

  try {
    // 1. Find scheduled matches in active competitions starting in ~1 hour
    const potentialMatches = await db
      .select({
        id: matches.id,
        competitionId: matches.competitionId,
      })
      .from(matches)
      .innerJoin(competitions, eq(matches.competitionId, competitions.id))
      .where(
        and(
          eq(matches.status, 'scheduled'),
          eq(competitions.status, 'active'), // Only notify for active competitions
          gte(matches.date, startRange.toISOString()),
          lte(matches.date, endRange.toISOString()),
        ),
      );

    if (potentialMatches.length === 0) {
      logger.info('[REMINDER] No matches found for reminder window.');
      return;
    }

    // 2. Identify missing tips and group them by user
    const userToMissingMatchIds = new Map<string, string[]>();

    for (const match of potentialMatches) {
      // Find users in leaderboardEntries for this competition
      // who don't have a prediction for this match
      // and haven't been notified for this match yet (either via single or grouped notification)
      const usersToNotify = await db
        .select({
          userId: leaderboardEntries.userId,
        })
        .from(leaderboardEntries)
        .where(
          and(
            eq(leaderboardEntries.competitionId, match.competitionId),
            // No prediction for this match
            notExists(
              db
                .select()
                .from(predictions)
                .where(
                  and(
                    eq(predictions.matchId, match.id),
                    eq(predictions.userId, leaderboardEntries.userId),
                  ),
                ),
            ),
            // No previous notification for this specific match
            notExists(
              db
                .select()
                .from(notifications)
                .where(
                  and(
                    eq(notifications.userId, leaderboardEntries.userId),
                    eq(notifications.type, 'MATCH_REMINDER'),
                    or(
                      // Check legacy single-match payload
                      eq(sql`${notifications.payload}->>'matchId'`, match.id),
                      // Check new grouped-match payload
                      sql`${notifications.payload}->'matchIds' @> ${JSON.stringify([match.id])}::jsonb`,
                    ),
                  ),
                ),
            ),
          ),
        );

      for (const u of usersToNotify) {
        if (!userToMissingMatchIds.has(u.userId)) {
          userToMissingMatchIds.set(u.userId, []);
        }
        userToMissingMatchIds.get(u.userId)!.push(match.id);
      }
    }

    if (userToMissingMatchIds.size === 0) {
      logger.info('[REMINDER] No users found requiring reminders.');
      return;
    }

    // 3. Send grouped notifications
    for (const [userId, matchIds] of userToMissingMatchIds.entries()) {
      logger.info(
        `[REMINDER] Sending grouped MATCH_REMINDER to user ${userId} for ${matchIds.length} matches.`,
      );

      await notify({
        userId,
        type: 'MATCH_REMINDER',
        payload: {
          missingTipsCount: matchIds.length,
          matchIds: matchIds,
        },
      });
    }
  } catch (error: any) {
    logger.error(`[REMINDER ERROR] Failed to send missing tip reminders: ${error.message}`);
  }
};
