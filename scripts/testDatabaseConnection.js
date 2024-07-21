// scripts/testDatabaseConnection.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
  try {
    await prisma.$connect();
    const users = await prisma.user.findMany();
    console.log("Database connection successful. Retrieved users:", users);
  } catch (error) {
    console.error("Database connection error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseConnection();
