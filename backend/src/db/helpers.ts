import { and, isNull } from 'drizzle-orm';
import { timestamp, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const generateCuid = (name: string = "id") => varchar(name, { length: 24 }).primaryKey().$defaultFn(() => createId());

export const baseTimestampsFields = {
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    deletedAt: timestamp('deleted_at', { precision: 3, withTimezone: true, mode: 'string' }),
};

export const withUpdatesFields = {
    ...baseTimestampsFields,
    updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' }).defaultNow().notNull(),
};

export const notDeleted = (table: any) => isNull(table.deletedAt);

export const activeOnly = (table: any, ...conditions: any[]) => {
    return and(notDeleted(table), ...conditions);
};