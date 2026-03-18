import { describe, it, expect, beforeAll } from 'vitest';
import { eq } from 'drizzle-orm';
import { db } from '../../../db/index.js';
import {
  matches,
  predictions,
  competitions,
  teams,
  users,
  leaderboardEntries,
  userStats,
} from '../../../db/schema/index.js';
import { evaluateMatch } from '../predictionsLogic.service.js';
import { createCuid } from '../../../db/helpers.js';
import { APP_CONFIG } from '../../../config/app.js';

describe('Scoring Engine - Integration Test', () => {
  // Generate unique IDs for the test run
  const compId = createCuid();
  const homeTeamId = createCuid();
  const awayTeamId = createCuid();
  const matchId = createCuid();
  const userId = createCuid();
  const predictionId = createCuid();

  beforeAll(async () => {
    // 1. Create a test user
    await db.insert(users).values({
      id: userId,
      email: `test-${Date.now()}@slapshot.club`,
      username: `tester_${Date.now()}`,
      password: 'hashed_password_mock',
      referralCode: `REF-${Date.now()}`,
    });

    // 2. Create a test competition
    await db.insert(competitions).values({
      id: compId,
      slug: `test-liga-${Date.now()}`,
      seasonYear: 2026,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 1000000).toISOString(),
      status: 'active',
    });

    // 3. Create test teams
    await db.insert(teams).values([
      { id: homeTeamId, slug: `home-team-${Date.now()}` },
      { id: awayTeamId, slug: `away-team-${Date.now()}` },
    ]);

    // 4. Create a test match (already finished, with a 3:1 result)
    await db.insert(matches).values({
      id: matchId,
      competitionId: compId,
      homeTeamId,
      awayTeamId,
      date: new Date(Date.now() - 100000).toISOString(),
      status: 'finished',
      resultHomeScore: 3,
      resultAwayScore: 1,
      stageType: 'regular_season',
    });

    // 5. Create a prediction for this user (Predicted 2:0, which is a correct goal difference for 3:1)
    await db.insert(predictions).values({
      id: predictionId,
      userId,
      matchId,
      competitionId: compId,
      homeGoals: 2,
      awayGoals: 0,
      status: 'pending',
    });
  });

  it('should correctly evaluate a correct goal difference prediction and award points to the user', async () => {
    // Act - Call the evaluation function (Scoring Engine)
    await evaluateMatch(matchId);

    // Assert 1: Check if the match is marked as evaluated (rankedAt)
    const [updatedMatch] = await db.select().from(matches).where(eq(matches.id, matchId));
    expect(updatedMatch!.rankedAt).not.toBeNull();

    // Assert 2: Check if the prediction received the correct status and points
    const [updatedPrediction] = await db
      .select()
      .from(predictions)
      .where(eq(predictions.id, predictionId));

    expect(updatedPrediction!.status).toBe('evaluated');
    expect(updatedPrediction!.isDiff).toBe(true);
    expect(updatedPrediction!.points).toBe(APP_CONFIG.POINTS.DIFF);

    // Assert 3: Check Leaderboard updates
    const [leaderboard] = await db
      .select()
      .from(leaderboardEntries)
      .where(eq(leaderboardEntries.userId, userId));

    expect(leaderboard).toBeDefined();
    expect(leaderboard!.correctDiffs).toBe(1);
    expect(leaderboard!.totalPoints).toBe(APP_CONFIG.POINTS.DIFF);
    expect(leaderboard!.totalPredictions).toBe(1);

    // Assert 4: Check global user stats updates
    const [stats] = await db.select().from(userStats).where(eq(userStats.userId, userId));
    expect(stats!.totalPredictions).toBe(1);
    expect(stats!.lifetimePoints).toBe(APP_CONFIG.POINTS.DIFF);
    expect(stats!.lifeTimeCorrectDiffs).toBe(1);
  });
});
