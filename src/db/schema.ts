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

export const voiceTable = sqliteTable("voice", {
  id: text("id").primaryKey(),
  voiceName: text("voice_name").notNull(),
  voiceAudioUrl: text("voice_audio_url").notNull(),
  voiceReferenceText: text("voice_reference_text").notNull(),
});

export const generatedAudioTable = sqliteTable("generated_audio", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => userTable.id),
  generatedAudioUrl: text("generated_audio_url"),
  generatedAudioText: text("generated_audio_text").notNull(),
  voiceId: text("voice_id")
    .notNull()
    .references(() => voiceTable.id),
  status: text("status").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  deleteAt: integer("delete_at", { mode: "timestamp" }),
  numOfCharacters: integer("num_of_characters").notNull(),
});

export const queueTable = sqliteTable("queue", {
  id: text("id").primaryKey(),
  generatedAudioId: text("generated_audio_id")
    .notNull()
    .references(() => generatedAudioTable.id),
  priority: integer("priority").notNull(),
  attempts: integer("attempts").notNull().default(0),
  maxAttempts: integer("max_attempts").notNull().default(3),
  status: text("status").notNull(), // pending, processing, completed, failed
  errorMessage: text("error_message"),
  startedAt: integer("started_at", { mode: "timestamp" }),
  completedAt: integer("completed_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export type User = InferSelectModel<typeof userTable>;
export type Session = InferSelectModel<typeof sessionTable>;
export type Voice = InferSelectModel<typeof voiceTable>;
export type GeneratedAudio = InferSelectModel<typeof generatedAudioTable>;
export type Queue = InferSelectModel<typeof queueTable>;
