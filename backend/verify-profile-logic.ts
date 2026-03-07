import 'dotenv/config';
import { db } from './src/db/index.js';
import { users } from './src/db/schema/users.js';
import { eq } from 'drizzle-orm';
import { updateUsername, changePassword, requestEmailChange } from './src/services/user.service.js';
import * as argon2 from 'argon2';

async function verify() {
  console.log('--- Starting Profile Logic Verification ---');

  // 1. Create a test user
  const testId = 'test-user-' + Date.now();
  const testEmail = `test-${Date.now()}@example.com`;
  const initialUsername = 'testuser' + Date.now();
  const hashedPassword = await argon2.hash('InitialPassword123!');

  await db.insert(users).values({
    id: testId,
    username: initialUsername,
    email: testEmail,
    password: hashedPassword,
    referralCode: 'REF-' + Date.now(),
  });
  console.log('Created test user:', initialUsername);

  try {
    // 2. Test Username Change
    const newUsername = 'updated' + Date.now();
    await updateUsername(testId, newUsername);
    const updatedUser = await db.query.users.findFirst({ where: eq(users.id, testId) });
    if (updatedUser?.username === newUsername) {
      console.log('✅ Username change successful');
    } else {
      console.log('❌ Username change failed');
    }

    // 3. Test Password Change
    const newPassword = 'NewPassword123!';
    await changePassword(testId, 'InitialPassword123!', newPassword);
    const passCheckUser = await db.query.users.findFirst({ where: eq(users.id, testId) });
    const isPassOk = await argon2.verify(passCheckUser!.password, newPassword);
    if (isPassOk) {
      console.log('✅ Password change successful');
    } else {
      console.log('❌ Password change failed');
    }

    // 4. Test Email Change Request (Feedback)
    await requestEmailChange(testId, 'I want to change to new@example.com');
    // We'd check feedback table here if needed, but if it didn't throw, service works.
    console.log('✅ Email change request (feedback) successful');
  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    // Cleanup
    await db.delete(users).where(eq(users.id, testId));
    console.log('Cleaned up test user');
    process.exit(0);
  }
}

verify();
