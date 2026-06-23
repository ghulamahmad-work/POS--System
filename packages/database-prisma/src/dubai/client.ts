import { PrismaClient } from "../../../../apps/pos-dubai/src/generated/dubai-client";
const globalForPrisma = globalThis as unknown as {
  dubaiDb?: PrismaClient;
};

export const dubaiDb =
  globalForPrisma.dubaiDb ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env["DUBAI_DATABASE_URL"],
      },
    },
  });

if (process.env["NODE_ENV"] !== "production") {
  globalForPrisma.dubaiDb = dubaiDb;
}