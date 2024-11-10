import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import type { InferSelectModel } from "drizzle-orm";

export const userTable = sqliteTable("user", {
  id: text("id").primaryKey(),
  googleId: text("google_id").notNull().unique(),
  email: text("email").notNull(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  name: text("name").notNull(),
  givenName: text("given_name"),
  familyName: text("family_name"),
  profileImageUrl: text("profile_image_url"),
});

export const sessionTable = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
});

export const habitTable = sqliteTable("habit", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  name: text("name").notNull(),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const trackingTable = sqliteTable("tracking", {
  id: text("id").primaryKey(),
  habitId: text("habit_id")
    .notNull()
    .references(() => habitTable.id),
  date: integer("date", { mode: "timestamp" }).notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Habit = InferSelectModel<typeof habitTable>;
export type Tracking = InferSelectModel<typeof trackingTable>;
