import { facts, type Fact, type InsertFact } from "@shared/schema";

export interface IStorage {
  getFacts(): Promise<Fact[]>;
  addFact(fact: InsertFact): Promise<Fact>;
}

export class MemStorage implements IStorage {
  private facts: Map<number, Fact>;
  private currentId: number;

  constructor() {
    this.facts = new Map();
    this.currentId = 1;
  }

  async getFacts(): Promise<Fact[]> {
    return Array.from(this.facts.values());
  }

  async addFact(insertFact: InsertFact): Promise<Fact> {
    const id = this.currentId++;
    const fact: Fact = {
      ...insertFact,
      id,
      timestamp: new Date(),
    };
    this.facts.set(id, fact);
    return fact;
  }
}

export const storage = new MemStorage();
