import { PrismaClient as DubaiPrismaClient } from "./generated/dubai-client";
import { getAbsoluteDatabaseUrl } from "./db-utils";

const globalForPrisma = globalThis as unknown as {
  dubaiPrisma: DubaiPrismaClient | undefined;
};

export const dubaiDb =
  globalForPrisma.dubaiPrisma ??
  new DubaiPrismaClient({
    datasources: {
      db: {
        url: getAbsoluteDatabaseUrl(
          "DUBAI_DATABASE_URL",
          "../../packages/database/prisma-dubai/dubai.db"
        ),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.dubaiPrisma = dubaiDb;
}