import { PrismaClient } from "@prisma/client";

let dubaiDb: PrismaClient;

export function createDubaiDb() {
  if (!dubaiDb) {
    dubaiDb = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DUBAI_DATABASE_URL!
        }
      }
    });
  }

  return dubaiDb;
}