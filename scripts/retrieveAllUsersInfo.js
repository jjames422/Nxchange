const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getAllUsersInfo() {
  try {
    // Get all users' information including fiat balance and crypto balances
    const users = await prisma.user.findMany({
      include: {
        fiatTransactions: true,
        cryptoTransactions: true,
        wallets: true,
        swiftTransfers: true,
        bankAccounts: true,
      },
    });

    return users;
  } catch (error) {
    console.error('Error retrieving users information:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  const usersInfo = await getAllUsersInfo();
  console.log(JSON.stringify(usersInfo, null, 2));
}

main().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
