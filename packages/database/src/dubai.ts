import { PrismaClient as DubaiPrismaClient } from "./generated/dubai-client";

let dubaiDb: DubaiPrismaClient;

export function createDubaiDb() {
  if (!dubaiDb) {
    dubaiDb = new DubaiPrismaClient({
      datasources: {
        db: {
          url: process.env.DUBAI_DATABASE_URL
        }
      }
    });
  }

  return dubaiDb;
}