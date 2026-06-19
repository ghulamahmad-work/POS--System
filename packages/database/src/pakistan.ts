import { PrismaClient as PakistanPrismaClient } from "./generated/pakistan-client";
import { getAbsoluteDatabaseUrl } from "./db-utils";

const globalForPrisma = globalThis as unknown as {
  pakistanPrisma: PakistanPrismaClient | undefined;
};

export const pakistanDb =
  globalForPrisma.pakistanPrisma ??
  new PakistanPrismaClient({
    datasources: {
      db: {
        url: getAbsoluteDatabaseUrl(
          "PAKISTAN_DATABASE_URL",
          "../../packages/database/prisma-pakistan/pakistan.db"
        ),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pakistanPrisma = pakistanDb;
}