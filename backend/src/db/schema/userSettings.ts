import { boolean, pgTable, timestamp, foreignKey, varchar } from "drizzle-orm/pg-core";
import { generateCuid, withUpdatesFields } from "../helpers";
import { users } from "./users";

export const userSettings = pgTable("user_settings", {
    id: generateCuid(),
    userId: varchar("user_id", { length: 24 }).notNull().unique(),
    hasSeenOnboarding: boolean("has_seen_onboarding").default(false),
    gdprConsent: boolean("gdpr_consent").default(false).notNull(),
    marketingConsent: boolean("marketing_consent").default(false),
    marketingConsentDate: timestamp("marketing_consent_date", { precision: 3, withTimezone: true, mode: 'string' }),
    ...withUpdatesFields,
}, (table) => [
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_settings_user_id_fkey"
    }).onDelete("cascade"),
]);