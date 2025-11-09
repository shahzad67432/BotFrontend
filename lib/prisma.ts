import { PrismaClient } from "@prisma/client";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Use the existing PrismaClient if it exists (dev hot reload)
export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "info", "warn", "error"], // optional, for debugging
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
