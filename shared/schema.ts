import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const facts = pgTable("facts", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertFactSchema = createInsertSchema(facts).pick({
  content: true,
  source: true,
});

export type InsertFact = z.infer<typeof insertFactSchema>;
export type Fact = typeof facts.$inferSelect;
