// lib/prisma.js
import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.prisma) {
  global.prisma = new PrismaClient();
  global.prisma.$connect().catch(e => {
    console.error("Prisma client initialization error:", e);
  });
}

prisma = global.prisma;

export { prisma };
