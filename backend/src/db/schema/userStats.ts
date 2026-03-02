import { pgTable, index, foreignKey, varchar, integer, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users";
import { generateCuid } from "../helpers";

export const userStats = pgTable("user_stats", {
    id: generateCuid(),
    userId: varchar("user_id").notNull(),
    totalPredictions: integer("total_predictions").notNull().default(0),
    lifetimePoints: integer("lifetime_points").notNull().default(0),
    lifetimePossiblePoints: integer("lifetime_possible_points").notNull().default(0),
    currentOvr: integer("current_ovr").notNull().default(0),
    maxOvrEver: integer("max_ovr_ever").notNull().default(0),
}, (table) => [
    uniqueIndex("user_stats_user_id_unique").using("btree", table.userId.asc().nullsLast().op("text_ops")),
    index("user_stats_user_id_idx").using("btree", table.userId.asc().nullsLast().op("text_ops")),
    foreignKey({
        columns: [table.userId],
        foreignColumns: [users.id],
        name: "user_stats_user_id_fkey"
    }).onDelete("cascade"),
]);