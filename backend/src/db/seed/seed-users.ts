import { hashPassword } from '../../utils/crypto.js';
import { db } from '../index.js';
import { users } from '../schema/index.js';
import { eq } from 'drizzle-orm';
import { addYears } from 'date-fns';

async function seed() {
  console.log('🌱 Starting seeding process...');

  const fillUsers = [
    {
      id: 'zh6zbcp4vhoimirdlabdmpd0',
      username: 'marian',
      email: 'marian@slapshot.club',
      role: 'admin',
      password: 'silneheslo123',
      referralCode: 'lf16nevs',
    },
    {
      id: 'ygamqbzkft5xho7zxupbdufu',
      username: 'Dora',
      email: 'dorota.harvis@gmail.com',
      role: 'user',
      password: 'silneheslo123',
      referralCode: 'hlmzlg6m',
    },
    {
      id: 'wvbf66gsva8yllzbtcxsi676',
      username: 'Danka',
      email: 'backovadana@gmail.com',
      role: 'editor',
      password: 'silneheslo123',
      referralCode: 'i7y731vc',
    },
    {
      id: 'ifbmej0sk8ejk98atrciydwf',
      username: 'Macha',
      email: 'machalik.ivan@gmail.com',
      role: 'user',
      password: 'silneheslo123',
      referralCode: 't09tyf01',
    },
  ];

  try {
    await db.transaction(async (tx) => {
      console.log('👤 Creating users...');

      for (const user of fillUsers) {
        console.log(`🔐 Processing user: ${user.username}...`);

        const hashedPassword = await hashPassword(user.password);

        await tx
          .insert(users)
          .values({
            id: user.id,
            username: user.username,
            email: user.email,
            password: hashedPassword,
            lastActiveAt: new Date().toISOString(),
            role: user.role as any,
            subscriptionPlan: 'pro',
            subscriptionActiveUntil: addYears(new Date(), 50).toISOString(),
            isActive: true,
            referralCode: user.referralCode,
            verifiedAt: new Date().toISOString(),
          })
          .onConflictDoNothing();
      }
    });

    console.log('✅ Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

seed();
