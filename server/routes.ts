import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertFactSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express) {
  app.get("/api/facts", async (_req, res) => {
    const facts = await storage.getFacts();
    res.json(facts);
  });

  app.post("/api/facts", async (req, res) => {
    try {
      const fact = insertFactSchema.parse(req.body);
      const savedFact = await storage.addFact(fact);
      res.json(savedFact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: error.errors });
      } else {
        res.status(500).json({ error: "Internal server error" });
      }
    }
  });

  return createServer(app);
}
