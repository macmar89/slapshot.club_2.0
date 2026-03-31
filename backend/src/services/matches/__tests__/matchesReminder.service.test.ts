import { describe, it, expect, beforeAll, afterAll, vi, beforeEach } from 'vitest';
import { eq, and, sql } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import {
  matches,
  predictions,
  competitions,
  teams,
  users,
  leaderboardEntries,
  notifications,
} from '../../../db/schema/index.js';
import { sendMissingTipReminders } from '../matchesReminder.service.js';
import { createCuid } from '../../../db/helpers.js';
import * as notificationsService from '../../notifications.service.js';

// Mock notify to avoid actual side effects
vi.mock('../../notifications.service.js', async () => {
  const actual = await vi.importActual('../../notifications.service.js');
  return {
    ...actual,
    notify: vi.fn().mockResolvedValue(undefined),
  };
});

describe('Matches Reminder Service - Grouped Integration Test', () => {
  const compId = createCuid();
  const homeTeamId = createCuid();
  const awayTeamId = createCuid();
  const userId = createCuid();
  
  const matchId1 = createCuid();
  const matchId2 = createCuid();
  const matchId3 = createCuid(); // Already predicted

  beforeAll(async () => {
    // 1. Create a test user
    await db.insert(users).values({
      id: userId,
      email: `test-grouped-${Date.now()}@slapshot.club`,
      username: `test_grp_${Date.now()}`,
      password: 'hashed_password_mock',
      referralCode: `REF-GRP-${Date.now()}`,
    });

    // 2. Create a test competition (active)
    await db.insert(competitions).values({
      id: compId,
      slug: `test-liga-grp-${Date.now()}`,
      seasonYear: 2026,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 1000000).toISOString(),
      status: 'active',
    });

    // 3. Create test teams
    await db.insert(teams).values([
      { id: homeTeamId, slug: `home-grp-${Date.now()}` },
      { id: awayTeamId, slug: `away-grp-${Date.now()}` },
    ]);

    // 4. Create leaderboard entry for user
    await db.insert(leaderboardEntries).values({
      id: createCuid(),
      userId,
      competitionId: compId,
      seasonYear: 2026,
    });

    // 5. Create matches starting in 60 mins
    const sixtyMinsFromNow = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    await db.insert(matches).values([
      { id: matchId1, competitionId: compId, homeTeamId, awayTeamId, date: sixtyMinsFromNow, status: 'scheduled' },
      { id: matchId2, competitionId: compId, homeTeamId, awayTeamId, date: sixtyMinsFromNow, status: 'scheduled' },
      { id: matchId3, competitionId: compId, homeTeamId, awayTeamId, date: sixtyMinsFromNow, status: 'scheduled' },
    ]);

    // 6. Predict matchId3
    await db.insert(predictions).values({
      id: createCuid(),
      userId,
      matchId: matchId3,
      competitionId: compId,
      homeGoals: 1,
      awayGoals: 1,
    });
  });

  afterAll(async () => {
    // Cleanup
    await db.delete(notifications).where(eq(notifications.userId, userId));
    await db.delete(predictions).where(eq(predictions.userId, userId));
    await db.delete(leaderboardEntries).where(eq(leaderboardEntries.userId, userId));
    await db.delete(matches).where(eq(matches.competitionId, compId));
    await db.delete(competitions).where(eq(competitions.id, compId));
    await db.delete(users).where(eq(users.id, userId));
    // teams are shared, usually don't need cleanup if they use unique slugs
  });

  it('should send a single notification for multiple missing tips and deduplicate correctly', async () => {
    const notifySpy = vi.spyOn(notificationsService, 'notify');
    notifySpy.mockClear();

    // --- First Run ---
    await sendMissingTipReminders();

    // Verify notify was called for this user
    const userCalls = notifySpy.mock.calls.filter(call => call[0].userId === userId);
    expect(userCalls).toHaveLength(1);
    
    const firstCall = userCalls[0][0];
    expect(firstCall.userId).toBe(userId);
    expect(firstCall.payload?.missingTipsCount).toBe(2);
    expect(firstCall.payload?.matchIds).toContain(matchId1);
    expect(firstCall.payload?.matchIds).toContain(matchId2);
    expect(firstCall.payload?.matchIds).not.toContain(matchId3);

    // --- Mocking the created notification in DB for deduplication ---
    // In a real integration test, notify() would normally insert into DB,
    // but we mocked it. Let's manually insert the notification to test the query logic.
    await db.insert(notifications).values({
      id: createCuid(),
      userId,
      type: 'MATCH_REMINDER',
      titleKey: 't',
      messageKey: 'm',
      payload: { matchIds: [matchId1, matchId2], missingTipsCount: 2 },
    });

    notifySpy.mockClear();

    // --- Second Run ---
    await sendMissingTipReminders();

    // Should NOT notify again for the CURRENT user
    const secondRunUserCalls = notifySpy.mock.calls.filter(call => call[0].userId === userId);
    expect(secondRunUserCalls).toHaveLength(0);
  });
});
