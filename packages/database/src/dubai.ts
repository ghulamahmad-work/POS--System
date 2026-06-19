import { PrismaClient as DubaiPrismaClient } from "./generated/dubai-client";

export function createDubaiDb() {
  return new DubaiPrismaClient({
    datasources: {
      db: {
        url:
          process.env.DUBAI_DATABASE_URL ||
          "file:../../packages/database/prisma-dubai/dubai.db",
      },
    },
  });
}