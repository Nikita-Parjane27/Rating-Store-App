import {
  integer,
  pgEnum,
  pgTable,
  text,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const roleEnum = pgEnum('role', [
  'SYSTEM_ADMINISTRATOR',
  'NORMAL_USER',
  'STORE_OWNER',
]);

export const users = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  name: varchar({ length: 60 }).notNull(),

  email: varchar({ length: 255 }).notNull().unique(),

  password: text().notNull(),

  address: varchar({ length: 400 }).notNull(),

  role: roleEnum().notNull(),
});

export const stores = pgTable('stores', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),

  name: varchar({ length: 60 }).notNull(),

  email: varchar({ length: 255 }).notNull(),

  address: varchar({ length: 400 }).notNull(),

  ownerId: integer().references(() => users.id),
});

export const ratings = pgTable(
  'ratings',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),

    userId: integer()
      .notNull()
      .references(() => users.id),

    storeId: integer()
      .notNull()
      .references(() => stores.id),

    rating: integer().notNull(),
  },
  (table) => [
    unique().on(table.userId, table.storeId),
  ],
);