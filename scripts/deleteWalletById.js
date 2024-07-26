const { PrismaClient } = require('@prisma/client');
const readline = require('readline');

const prisma = new PrismaClient();

async function deleteWallet() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Enter the Wallet ID to delete: ', async (walletId) => {
    if (!walletId) {
      console.log('Wallet ID is required');
      rl.close();
      return;
    }

    try {
      const wallet = await prisma.wallet.findUnique({
        where: { id: parseInt(walletId) },
        include: {
          transactions: true,
        },
      });

      if (!wallet) {
        console.log(`Wallet with ID ${walletId} not found`);
      } else {
        // Delete associated transactions first
        await prisma.transaction.deleteMany({
          where: { walletId: parseInt(walletId) },
        });

        // Delete the wallet
        await prisma.wallet.delete({
          where: { id: parseInt(walletId) },
        });
        console.log(`Wallet with ID ${walletId} and its associated transactions have been deleted`);
      }
    } catch (error) {
      console.error('Error deleting wallet:', error);
    } finally {
      rl.close();
      await prisma.$disconnect();
    }
  });
}

deleteWallet();
