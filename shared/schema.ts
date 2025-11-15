import { sql } from 'drizzle-orm';
import {
  index,
  json,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for express-session)
export const sessions = mysqlTable(
  "sessions",
  {
    sid: varchar("sid", { length: 255 }).primaryKey(),
    sess: json("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (for Google Auth)
// Note: id is the Google ID (no auto-generation)
export const users = mysqlTable("users", {
  id: varchar("id", { length: 255 }).primaryKey(), // Google ID as primary key
  email: varchar("email", { length: 255 }).unique(),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  profileImageUrl: varchar("profile_image_url", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Hikes table
export const hikes = mysqlTable("hikes", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text("title").notNull(),
  location: text("location").notNull(),
  date: timestamp("date").notNull(),
  duration: text("duration").notNull(),
  distance: text("distance").notNull(),
  difficulty: varchar("difficulty", { length: 20 }).notNull(), // easy, moderate, hard, expert
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertHikeSchema = createInsertSchema(hikes).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.string().or(z.date()),
});

export type InsertHike = z.infer<typeof insertHikeSchema>;
export type Hike = typeof hikes.$inferSelect;

// Photos table
export const photos = mysqlTable("photos", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  hikeId: varchar("hike_id", { length: 255 }).notNull().references(() => hikes.id, { onDelete: 'cascade' }),
  url: text("url").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Photo = typeof photos.$inferSelect;

// Collaborators table (for sharing hikes)
export const collaborators = mysqlTable("collaborators", {
  id: varchar("id", { length: 255 }).primaryKey().$defaultFn(() => crypto.randomUUID()),
  hikeId: varchar("hike_id", { length: 255 }).notNull().references(() => hikes.id, { onDelete: 'cascade' }),
  userId: varchar("user_id", { length: 255 }).notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCollaboratorSchema = createInsertSchema(collaborators).omit({
  id: true,
  createdAt: true,
});

export type InsertCollaborator = z.infer<typeof insertCollaboratorSchema>;
export type Collaborator = typeof collaborators.$inferSelect;