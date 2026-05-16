import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function check() {
  try {
    const res = await db.execute(sql`SELECT table_name FROM information_schema.tables WHERE table_name = 'user_referrals'`);
    console.log(JSON.stringify(res, null, 2));
  } catch (err) {
    console.error(err);
  }
  process.exit(0);
}

check();
