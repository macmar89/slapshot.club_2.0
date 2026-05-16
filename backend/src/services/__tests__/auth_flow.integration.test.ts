import { describe, it, expect, afterAll } from 'vitest';
import { db } from '../../db/index.js';
import { users, refreshTokens } from '../../db/schema/index.js';
import { eq } from 'drizzle-orm';
import { registerUser, loginUser, logoutUser, createSession } from '../auth.service.js';

describe('Auth Flow Integration', () => {
  // Generate a unique identifier for this test run
  const runId = Date.now();
  const testUser = {
    username: `flow_test_${runId}`,
    email: `flow_test_${runId}@slapshot.club`,
    password: 'Password123!',
    gdprConsent: true,
    marketingConsent: false,
    preferredLanguage: 'sk'
  };

  let registeredUserId: string | null = null;

  afterAll(async () => {
    if (registeredUserId) {
      // Clean up test data
      await db.delete(refreshTokens).where(eq(refreshTokens.userId, registeredUserId));
      await db.delete(users).where(eq(users.id, registeredUserId));
    }
  });

  it('should complete a full auth cycle: register -> login -> logout', async () => {
    // 1. Register User
    console.log('Testing registration...');
    const registrationResult = await registerUser(testUser);
    registeredUserId = registrationResult.id;

    expect(registrationResult.username).toBe(testUser.username);
    expect(registrationResult.email).toBe(testUser.email.toLowerCase());
    expect(registrationResult.id).toBeDefined();

    // Verify user exists in DB
    const [dbUser] = await db.select().from(users).where(eq(users.id, registeredUserId!));
    expect(dbUser).toBeDefined();
    expect(dbUser!.username).toBe(testUser.username);

    // 2. Login User
    console.log('Testing login...');
    const loginResult = await loginUser({
      identifier: testUser.email,
      password: testUser.password
    }, { headers: {}, socket: { remoteAddress: '127.0.0.1' } } as any);

    expect(loginResult.user.id).toBe(registeredUserId);
    
    // Create a session (as the controller does)
    const rawRefreshToken = await createSession(registeredUserId!, 'test-agent');
    expect(rawRefreshToken).toBeDefined();

    // Verify refresh token exists in DB
    const [dbToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.userId, registeredUserId!));
    expect(dbToken).toBeDefined();

    // 3. Logout User
    console.log('Testing logout...');
    const logoutUserId = await logoutUser(rawRefreshToken);
    expect(logoutUserId).toBe(registeredUserId);

    // Verify refresh token is deleted from DB
    const [deletedToken] = await db.select().from(refreshTokens).where(eq(refreshTokens.userId, registeredUserId!));
    expect(deletedToken).toBeUndefined();
    
    console.log('Auth flow test completed successfully!');
  });
});
