const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function retrieveExchangeWalletInfo() {
  try {
    const exchangeWallets = await prisma.wallet.findMany({
      where: {
        isExchangeWallet: true
      },
      include: {
        privateKey: true
      }
    });

    if (exchangeWallets.length === 0) {
      console.log('No exchange wallets found.');
    } else {
      console.log('Exchange Wallet Information:');
      exchangeWallets.forEach(wallet => {
        console.log('--------------------------');
        console.log(`Network: ${wallet.network}`);
        console.log(`Symbol: ${wallet.symbol}`);
        console.log(`Address: ${wallet.address}`);
        console.log(`Private Key: ${wallet.privateKey.key}`);
        console.log(`Balance: ${wallet.balance}`);
        console.log(`Created At: ${new Date(wallet.createdAt)}`);
        console.log(`Updated At: ${new Date(wallet.updatedAt)}`);
      });
    }
  } catch (error) {
    console.error('Error retrieving exchange wallet information:', error);
  } finally {
    await prisma.$disconnect();
  }
}

retrieveExchangeWalletInfo().catch(e => {
  console.error(e);
}).finally(async () => {
  await prisma.$disconnect();
});
