import { foreignKey, pgTable, timestamp, uniqueIndex, varchar } from 'drizzle-orm/pg-core';
import { users } from './users.js';
import { generateCuid, withUpdatesFields } from '../helpers.js';

export const refreshTokens = pgTable('refresh_tokens', {
    id: generateCuid(),
    userId: varchar('user_id', { length: 24 }).notNull(),
    token: varchar('token', { length: 255 }).notNull().unique(),
    userAgent: varchar('user_agent', { length: 255 }),
    expiresAt: timestamp('expires_at').notNull(),
    ...withUpdatesFields
}, (table) => [
    uniqueIndex('refresh_tokens_token_unique_idx').on(table.token),
    uniqueIndex('user_device_idx').on(table.userId, table.userAgent),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "refresh_tokens_user_id_fkey"
    }).onDelete("cascade"),
]);