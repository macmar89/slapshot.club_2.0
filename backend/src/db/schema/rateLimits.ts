import {
  pgTable,
  index,
  varchar,
  numeric,
  timestamp,
  integer,
  pgSequence,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const rateLimitsIdSeq = pgSequence('rate_limits_id_seq', {
  startWith: '1',
  increment: '1',
  minValue: '1',
  maxValue: '9223372036854775807',
  cache: '1',
  cycle: false,
});

export const rateLimits = pgTable(
  'rate_limits',
  {
    id: integer()
      .default(sql`nextval('rate_limits_id_seq'::regclass)`)
      .primaryKey()
      .notNull(),
    ip: varchar().notNull(),
    count: numeric().default('0').notNull(),
    lastRequest: timestamp('last_request', {
      precision: 3,
      withTimezone: true,
      mode: 'string',
    }).notNull(),
    updatedAt: timestamp('updated_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    createdAt: timestamp('created_at', { precision: 3, withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('rate_limits_created_at_idx').using(
      'btree',
      table.createdAt.asc().nullsLast().op('timestamptz_ops'),
    ),
    index('rate_limits_ip_idx').using('btree', table.ip.asc().nullsLast().op('text_ops')),
    index('rate_limits_updated_at_idx').using(
      'btree',
      table.updatedAt.asc().nullsLast().op('timestamptz_ops'),
    ),
  ],
);
