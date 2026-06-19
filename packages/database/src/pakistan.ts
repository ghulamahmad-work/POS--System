import { PrismaClient } from "@prisma/client";

let pakistanDb: PrismaClient;

export function createPakistanDb() {
  if (!pakistanDb) {
    pakistanDb = new PrismaClient();
  }

  return pakistanDb;
}