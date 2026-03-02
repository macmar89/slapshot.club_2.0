import { pgTable, index, foreignKey, varchar, uniqueIndex, boolean } from "drizzle-orm/pg-core";
import { users } from "./users.js";
import { generateCuid, withUpdatesFields } from "../helpers.js";

export const notificationSettings = pgTable("notification_settings", {
	id: generateCuid(),
	userId: varchar("user_id", { length: 24 }).notNull(),
	dailySummary: boolean("daily_summary").default(false),
	matchReminder: boolean("match_reminder").default(false),
	leaderboardUpdate: boolean("leaderboard_update").default(false),
	...withUpdatesFields,
}, (table) => [
	uniqueIndex("notification_settings_user_unique_idx").on(table.userId),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "notification_settings_user_id_fkey"
    }).onDelete("cascade"),
]);
