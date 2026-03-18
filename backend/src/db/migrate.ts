import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config();

const migrationClient = postgres(process.env.DATABASE_URL!, { max: 1 });

async function main() {
  console.log('Running migrations...');
  
  const db = drizzle(migrationClient);

  await migrate(db, { migrationsFolder: './drizzle' });

  console.log('Migrations completed successfully!');
  
  await migrationClient.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
