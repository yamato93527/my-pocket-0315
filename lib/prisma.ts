import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };
let _prisma: PrismaClient | null = null;

function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma;
  if (_prisma) return _prisma;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }

  const client = new PrismaClient({
    adapter: new PrismaPg({
      connectionString,
    }),
  });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  } else {
    _prisma = client;
  }
  return client;
}

// ビルド時は DATABASE_URL が無くてもモジュール読み込みで落ちないように Proxy で遅延初期化
export default new Proxy({} as PrismaClient, {
  get(_, prop) {
    return (getPrisma() as Record<string | symbol, unknown>)[prop];
  },
});
