import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const students = sqliteTable("students", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  avatarEmoji: text("avatar_emoji").notNull().default("🦊"),
  currentLessonId: text("current_lesson_id").notNull().default("aula-1"),
  // JSON-encoded array of completed lesson ids
  completedLessons: text("completed_lessons").notNull().default("[]"),
  // JSON-encoded map of lessonId -> string[] of completed checkpoint ids
  checkpoints: text("checkpoints").notNull().default("{}"),
});

export const insertStudentSchema = createInsertSchema(students).pick({
  name: true,
  avatarEmoji: true,
}).extend({
  name: z.string().min(1, "O nome não pode ficar vazio").max(40),
  avatarEmoji: z.string().min(1).max(8),
});

export const updateStudentSchema = z.object({
  name: z.string().min(1).max(40).optional(),
  avatarEmoji: z.string().min(1).max(8).optional(),
  currentLessonId: z.string().optional(),
  completedLessons: z.array(z.string()).optional(),
  checkpoints: z.record(z.string(), z.array(z.string())).optional(),
});

export type InsertStudent = z.infer<typeof insertStudentSchema>;
export type UpdateStudent = z.infer<typeof updateStudentSchema>;
export type Student = typeof students.$inferSelect;

// Decoded view for the frontend
export interface StudentView {
  id: number;
  name: string;
  avatarEmoji: string;
  currentLessonId: string;
  completedLessons: string[];
  checkpoints: Record<string, string[]>;
}
