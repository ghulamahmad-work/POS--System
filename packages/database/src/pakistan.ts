import { PrismaClient as PakistanPrismaClient } from "./generated/pakistan-client";

let pakistanDb: PakistanPrismaClient;

export function createPakistanDb() {
  if (!pakistanDb) {
    pakistanDb = new PakistanPrismaClient({
      datasources: {
        db: {
          url: process.env.PAKISTAN_DATABASE_URL
        }
      }
    });
  }

  return pakistanDb;
}