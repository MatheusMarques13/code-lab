import type { Express } from "express";
import { createServer } from 'node:http';
import type { Server } from 'node:http';
import { storage } from "./storage";
import { insertStudentSchema, updateStudentSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/students", async (_req, res) => {
    const list = await storage.listStudents();
    res.json(list);
  });

  app.get("/api/students/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
    const s = await storage.getStudent(id);
    if (!s) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(s);
  });

  app.post("/api/students", async (req, res) => {
    const parsed = insertStudentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const created = await storage.createStudent(parsed.data);
    res.status(201).json(created);
  });

  app.patch("/api/students/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
    const parsed = updateStudentSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
    const updated = await storage.updateStudent(id, parsed.data);
    if (!updated) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(updated);
  });

  app.post("/api/students/:id/reset", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
    const updated = await storage.resetProgress(id);
    if (!updated) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json(updated);
  });

  app.delete("/api/students/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "ID inválido" });
    const ok = await storage.deleteStudent(id);
    if (!ok) return res.status(404).json({ error: "Aluno não encontrado" });
    res.status(204).end();
  });

  return httpServer;
}
