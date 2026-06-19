import { PrismaClient } from "../generated/pakistan-client";
import path from "node:path";

const globalForPrisma = globalThis as unknown as {
  pakistanDb?: PrismaClient;
};

function toPrismaFileUrl(filePath: string) {
  return `file:${filePath.replace(/\\/g, "/")}`;
}

function getPakistanDatabaseUrl() {
  const configuredUrl = process.env.PAKISTAN_DATABASE_URL;

  if (
    configuredUrl &&
    !configuredUrl.includes("packages/database/prisma-pakistan")
  ) {
    return configuredUrl;
  }

  const cwd = process.cwd();
  const repoRoot =
    path.basename(cwd) === "pos-pakistan" &&
    path.basename(path.dirname(cwd)) === "apps"
      ? path.resolve(cwd, "../..")
      : cwd;

  return toPrismaFileUrl(
    path.join(
      repoRoot,
      "packages",
      "database-prisma",
      "prisma",
      "pakistan",
      "pakistan.db",
    ),
  );
}

export const pakistanDb =
  globalForPrisma.pakistanDb ??
  new PrismaClient({
    datasources: {
      db: {
        url: getPakistanDatabaseUrl(),
      },
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.pakistanDb = pakistanDb;
}
