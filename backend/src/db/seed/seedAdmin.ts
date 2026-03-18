import { hashPassword } from '../../utils/crypto.js';
import { db } from '../index.js';
import { users, userSettings, userStats } from '../schema/index.js';
import { eq } from 'drizzle-orm';
import { addYears } from 'date-fns';

export const seedAdminUser = async () => {
  console.log('🌱 Starting seeding process...');

  const user = {
    username: 'admin',
    email: 'admin@slapshot.club',
    password: 'SilneHeslo123',
  };

  try {
    const existingAdmin = await db.query.users.findFirst({
      where: eq(users.username, user.username),
    });

    if (existingAdmin) {
      console.log('ℹ️ Superadmin already exists. Skipping creation.');
      process.exit(0);
    }

    console.log('🔐 Hashing password...');
    const hashedPassword = await hashPassword(user.password);

    await db.transaction(async (tx) => {
      console.log('👤 Creating superadmin user...');
      const [createdUser] = await tx
        .insert(users)
        .values({
          username: user.username,
          email: user.email,
          password: hashedPassword,

          lastActiveAt: new Date().toISOString(),

          role: 'admin',

          subscriptionPlan: 'pro',
          subscriptionActiveUntil: addYears(new Date(), 50).toISOString(),

          isActive: true,

          referralCode: 'lf16nevs',

          verifiedAt: new Date().toISOString(),
        })
        .onConflictDoNothing()
        .returning({ userId: users.id });

      await tx.insert(userSettings).values({
        userId: createdUser!.userId,
        gdprConsent: true,
      });

      await tx.insert(userStats).values({
        userId: createdUser!.userId,
      });
    });

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
};
