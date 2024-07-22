const { PrismaClient } = require("@prisma/client");

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
    global.prisma.$connect().catch(e => {
      console.error("Prisma client initialization error:", e);
    });
  }
  prisma = global.prisma;
}

module.exports = { prisma };
