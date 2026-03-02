import { pgEnum } from 'drizzle-orm/pg-core';

export const locales = pgEnum('_locales', ['sk', 'en', 'cz']);
