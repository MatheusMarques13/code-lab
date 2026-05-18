import { students } from '@shared/schema';
import type { Student, InsertStudent, UpdateStudent, StudentView } from '@shared/schema';
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { eq } from "drizzle-orm";

const sqlite = new Database("data.db");
sqlite.pragma("journal_mode = WAL");

// Ensure table exists (lightweight migration so we don't depend on `db:push`)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    avatar_emoji TEXT NOT NULL DEFAULT '🦊',
    current_lesson_id TEXT NOT NULL DEFAULT 'aula-1',
    completed_lessons TEXT NOT NULL DEFAULT '[]',
    checkpoints TEXT NOT NULL DEFAULT '{}'
  );
`);

export const db = drizzle(sqlite);

function toView(row: Student): StudentView {
  let completed: string[] = [];
  let checkpoints: Record<string, string[]> = {};
  try { completed = JSON.parse(row.completedLessons); } catch {}
  try { checkpoints = JSON.parse(row.checkpoints); } catch {}
  return {
    id: row.id,
    name: row.name,
    avatarEmoji: row.avatarEmoji,
    currentLessonId: row.currentLessonId,
    completedLessons: Array.isArray(completed) ? completed : [],
    checkpoints: checkpoints && typeof checkpoints === 'object' ? checkpoints : {},
  };
}

export interface IStorage {
  listStudents(): Promise<StudentView[]>;
  getStudent(id: number): Promise<StudentView | undefined>;
  createStudent(s: InsertStudent): Promise<StudentView>;
  updateStudent(id: number, patch: UpdateStudent): Promise<StudentView | undefined>;
  deleteStudent(id: number): Promise<boolean>;
  resetProgress(id: number): Promise<StudentView | undefined>;
}

export class DatabaseStorage implements IStorage {
  async listStudents() {
    return db.select().from(students).all().map(toView);
  }
  async getStudent(id: number) {
    const row = db.select().from(students).where(eq(students.id, id)).get();
    return row ? toView(row) : undefined;
  }
  async createStudent(s: InsertStudent) {
    const row = db.insert(students).values({
      name: s.name,
      avatarEmoji: s.avatarEmoji,
    }).returning().get();
    return toView(row);
  }
  async updateStudent(id: number, patch: UpdateStudent) {
    const existing = db.select().from(students).where(eq(students.id, id)).get();
    if (!existing) return undefined;
    const values: Partial<Student> = {};
    if (patch.name !== undefined) values.name = patch.name;
    if (patch.avatarEmoji !== undefined) values.avatarEmoji = patch.avatarEmoji;
    if (patch.currentLessonId !== undefined) values.currentLessonId = patch.currentLessonId;
    if (patch.completedLessons !== undefined) values.completedLessons = JSON.stringify(patch.completedLessons);
    if (patch.checkpoints !== undefined) values.checkpoints = JSON.stringify(patch.checkpoints);
    const row = db.update(students).set(values).where(eq(students.id, id)).returning().get();
    return row ? toView(row) : undefined;
  }
  async deleteStudent(id: number) {
    const r = db.delete(students).where(eq(students.id, id)).run();
    return r.changes > 0;
  }
  async resetProgress(id: number) {
    return this.updateStudent(id, { completedLessons: [], checkpoints: {}, currentLessonId: 'aula-1' });
  }
}

export const storage = new DatabaseStorage();
